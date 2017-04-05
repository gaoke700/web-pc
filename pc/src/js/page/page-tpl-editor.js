define(function (require, exports, module) {

    //把组件保存的数据传递给iframe
    function postMsgIframe(id, data){
        if(!id) return false;
        data = data || {};
        var oPreview = document.getElementById('preview');
        var aPreviewItem = oPreview.querySelectorAll('.preview-item');
        for(var i=0; i<aPreviewItem.length; i++){
            if(aPreviewItem[i].dataset.id == id){
                aPreviewItem[i].querySelector("iframe").contentWindow.postMessage(data, '*');
            }
        };
    }

    module.exports = {
        init: function(){
            var $ = MJQ;
            window.PageTplEditorStatus = true;
            $('#main').animate({scrollTop:0}, '100');
            var pageAttr = pageTplEditor.pageAttr || 'htmlTpl';
            var Components = require('../component/components.js');
            var Drag = require('../common/drag.js');
            var DragPlugin = require('../common/drag-plugin.js');

            //右侧组件列表渲染
            var CreatWidgetList = require('./page-tpl-editor/creat-widget-list.js');
            //保存的函数
            var SaveData = require('./page-tpl-editor/save-data.js');

            var $pageTplEditor = $('.page-tpl-editor');
            var $componentsSet = $('#components-set');
            var $dragWrap = $componentsSet.find('.drag-wrap');
            var $dragInfinity = $dragWrap.find('.drag-infinity');
            var $dragOne = $dragWrap.find('.drag-one');
            var $componentSet = $componentsSet.find('.component-set');
            var $componentSetTitle = $componentsSet.find('.set-title');
            var $hdTop = $pageTplEditor.find('.hd-top');
            var $hdBottom = $pageTplEditor.find('.hd-bottom');
            var $preview = $('#preview');
            var $previewWrap = $preview.find('.preview-warp');
            var $previewItem = $previewWrap.find('.preview-item');

            window.addEventListener('message',function(e){
                var data = e.data;
                var id = data.id || '';
                if(!id){ return false;}
                var height = data.height || 198;
                var $item = $previewWrap.find($("[data-id=" + id + "]"));
                $item.css({height:height});
                $item.find('iframe').css({height:height});
                $item.find('.view').css({height:height});
            },false);

            //编辑模版名称、模版分享描述
            var EditorTplName = require('./page-tpl-editor/editor-tpl-name.js')({
                parent: $hdTop,
                pageAttr: pageAttr,
                htmlTplId: pageTplEditor.html_tpl_id
            });

            //可视区的组件拖拽
            var PreviewWidget = require('./page-tpl-editor/preview-widget.js')({
                parent: $previewWrap,
                pageId: pageTplEditor.page_id,
                webRootUrl: pageTplEditor.webRootUrl
            });

            var IsUseCurrents = require('./page-tpl-editor/is-use-current.js');
            var IsUseCurrent = new IsUseCurrents({
                parent: $hdBottom.find('.btn-save-use'),
                status: pageTplEditor.page.status || 0
            });
            // 所有new出来的组件实例都挂载到这个下面，方便后续调用
            var allComponent = {};

            //保存整个页面修改或者关闭本页面保存
            function savePageAll(opts){
                var tplNameData = { html_tpl_id: pageTplEditor.html_tpl_id };
                var PreviewWidgetData = PreviewWidget.getData();
                var xxx = {};
                $.each($hdTop.find('input'), function(i, item){
                    var name = $(this).attr('name');
                    var val = $(this).val();
                    PreviewWidgetData[name] = val;
                    xxx[name] = val;
                });
                var data = [ { act:'updatePage', data: PreviewWidgetData } ];
                if(pageAttr == 'htmlTpl'){
                    data.push({ act:'updateHtmlTpl', data:xxx })
                }

                if(IsUseCurrent.status != 0){
                    data.push({
                        act:'applyHtmlTpl',
                        data: {
                            html_tpl_id: pageTplEditor.html_tpl_id
                        }
                    })
                }

                var widgetData = [];
                var isDataTrue = 0;
                $.each(allComponent, function(index, item){
                    widgetData.push({
                        module_id: index,
                        config: allComponent[index].result()
                    });
                    if(item.hasOwnProperty('isDataTrue')){
                        if(!item.isDataTrue){
                            isDataTrue++;
                        }
                    }
                });

                data.push({
                    act:'updateModule',
                    data: widgetData
                });

                if(isDataTrue <= 0){
                    postData();
                    return false;
                }

                new base.Dialog({
                    headerTxt:'提示信息',
                    content: ('当前' + isDataTrue + '个组件填写异常，您确定关闭此页面吗'),
                    btnOkTxt:'保存并关闭',
                    okCallback: function(){
                        postData();
                    },
                    cancelCallback: function(){
                        if(opts.callback && (typeof opts.callback == "function")){
                            opts.callback();
                        }
                    }
                });

                function postData(){
                    var loadingDialog = base.loadingDialog();
                    base.ajax({
                        type:'post',
                        url: 'index.php?ctl=template/module&act=multiSave',
                        data: {data:data},
                        success: function(result){
                            loadingDialog.off();
                            result = result || {};
                            if(result.res && result.res == 'succ'){
                                var str = '<p style="font-size: 18px; color: #e76550;">模版保存成功！</p>';
                                if(IsUseCurrent.isUse){
                                    str += '<p>已设为当前使用</p>';
                                }
                                base.promptDialog({
                                    str:str,
                                    time: 2000,
                                    callback: function(){
                                        window.PageTplEditorStatus = false;
                                        if(opts.callback && (typeof opts.callback == "function")){
                                            opts.callback();
                                        }
                                        //W.page('index.php?ctl=template/htmlTpl&act=index');
                                    }
                                });
                            } else {
                                base.promptDialog({
                                    str:'保存失败'
                                });
                                if(opts.callback && (typeof opts.callback == "function")){
                                    opts.callback();
                                }
                            }
                        },
                        error: function(result){
                            loadingDialog.off();
                            base.promptDialog({
                                str:'保存失败'
                            });
                            if(opts.callback && (typeof opts.callback == "function")){
                                opts.callback();
                            }
                        }
                    });
                }
            };

            function cleanBtnDragClass(){
                var $btnDragDefault = $dragWrap.find('.btn-drag-default');
                $.each($btnDragDefault, function(i,item){
                    var className = $(this).data('class');
                    $(this).find('span').attr('class', className);
                });
            };

            //右侧组件编辑区
            var widgetEditor = {
                render: function(){
                    $.each(pageTplEditor.modules, function(i, item){
                        item.config.id = item.config.id || item.module_id;
                        item.config.sign = item.config.sign || item.sign;
                        allComponent[item.module_id] = new Components[item.sign]({
                            parent:$componentSet,
                            setData:item.config
                        });
                        $(allComponent[item.module_id]).on('changeData', function(){
                            postMsgIframe(item.module_id, (arguments[1] && arguments[1].data || {}));
                        });
                    });
                    $componentSet.children().not('.component-default').hide();
                }
            };

            //初始化组件列表、左侧预览区、右侧组件编辑区
            CreatWidgetList($dragInfinity.find('dd'), $dragOne.find('dd'));
            PreviewWidget.render(pageTplEditor.configModules);
            widgetEditor.render();

            //右侧组件拖动的一些属性和方法
            var widgetFn = {
                nearlyObjIndex: false,
                activeEle: null,
                activeData: {},
                obj: null,
                spanClass: ''
            };
            widgetFn.init = function(){
                //右侧组件拖拽事件
                var widgetDrag = new Drag({
                    ele: $dragWrap.find('.btn-drag-default'),
                    moveLimits:{
                        bottom:'infinity'
                    }
                });
                $(widgetDrag).on('mouseDownStart', widgetFn.mouseDownStart);
                $(widgetDrag).on('mouseMoveIng', widgetFn.mouseMoveIng);
                $(widgetDrag).on('mouseUpEnd', widgetFn.mouseUpEnd);
            };

            widgetFn.mouseDownStart = function(){
                cleanBtnDragClass();
                widgetFn.nearlyObjIndex = false;
                $previewItem = $previewWrap.find('.preview-item');

                var opt = arguments[1];
                widgetFn.obj = opt.obj;
                widgetFn.activeData.sign = widgetFn.obj.data('sign');
                widgetFn.activeData.name = widgetFn.obj.data('name');
                widgetFn.activeData.useNum = widgetFn.obj.data('use-num');
                widgetFn.spanClass = widgetFn.obj.data('class');
                widgetFn.obj.find('span').attr('class', (widgetFn.spanClass + '-2'));
                if(widgetFn.activeData.useNum != 'infinity'){
                    if($previewWrap.find($("[data-sign=" + widgetFn.activeData.sign + "]")).length >= widgetFn.activeData.useNum){
                        base.promptDialog({
                            str: ('左侧已经存在' + widgetFn.activeData.useNum + '个该组件')
                        });

                        $previewWrap.find('.preview-item-active').removeClass('preview-item-active');
                        $previewWrap.find($("[data-sign=" + widgetFn.activeData.sign + "]")).addClass('preview-item-active');
                        return false;
                    }
                }

                widgetFn.activeEle = widgetFn.obj.clone().removeClass('btn-drag-default');
                widgetFn.activeEle.css({'position':'fixed', 'left':opt.objDis.x,'top':opt.objDis.y, 'z-index':'999', 'margin':0});
                widgetFn.obj.parent().append(widgetFn.activeEle);
            };

            widgetFn.mouseMoveIng = function(){
                var opt = arguments[1];
                var moveDis = opt.moveDis;
                widgetFn.activeEle.css({'left': moveDis.x,'top': moveDis.y});

                //如果没在手机区域不处理
                //if(!DragPlugin.isDivCoincidence(widgetFn.activeEle, $previewWrap)){
                if(!DragPlugin.isDivCoincidence2(widgetFn.activeEle, $preview.parent())){
                    $previewWrap.find('.placed-area').remove();
                    return false;
                }

                //手机区域没有组件
                if($previewItem.length<1){
                    if($previewWrap.find('.placed-area').length<1){
                        $previewWrap.append('<div class="placed-area">放在此区域</div>');
                    }
                    return false;
                }

                //手机区域存在组件
                $previewWrap.find('.placed-area').remove();
                widgetFn.nearlyObjIndex = DragPlugin.findNearObj(widgetFn.activeEle, $previewItem);
                if(widgetFn.nearlyObjIndex !== false){
                    $previewItem.eq(widgetFn.nearlyObjIndex).before('<div class="placed-area">放在此区域</div>');
                } else {
                    $previewWrap.append('<div class="placed-area">放在此区域</div>');
                }
            };

            widgetFn.mouseUpEnd = function(){
                var opt = arguments[1];
                var objDis = opt.objDis;
                var target = {x:0,y:0};
                var isAdd = false;

                target.x = objDis.x;
                target.y = objDis.y;

                if(DragPlugin.isDivCoincidence2(widgetFn.activeEle, $preview.parent())){
                    var placedAreaDis = $previewWrap.find('.placed-area').offset();
                    target.x = placedAreaDis.left;
                    target.y = placedAreaDis.top;
                    isAdd = true;
                } else {
                    target.x = objDis.x;
                    target.y = objDis.y;
                    isAdd = false;
                }

                widgetFn.activeEle.animate({'left':target.x,'top':target.y}, 100, function(){
                    widgetFn.activeEle.remove();
                    $previewWrap.find('.placed-area').remove();
                    if(!isAdd) return false;

                    $previewWrap.find('.preview-item-active').removeClass('preview-item-active');
                    widgetFn.activeData.id = 'id' + new Date().getTime();

                    SaveData.widget({
                        data:{
                            sign: widgetFn.activeData.sign,
                            page_id: pageTplEditor.page_id
                        },
                        success: function(result){
                            widgetFn.activeData.id = result.data.module_id;
                            var addEleHtmls = PreviewWidget.creat(widgetFn.activeData||{});
                            if(widgetFn.nearlyObjIndex !== false){
                                $previewItem.eq(widgetFn.nearlyObjIndex).before(addEleHtmls);
                            } else {
                                $previewWrap.append(addEleHtmls);
                            }

                            $componentSet.children().hide();

                            $componentSet.find('.c-component-active').removeClass('c-component-active');
                            allComponent[widgetFn.activeData.id] = new Components[widgetFn.activeData.sign]({
                                parent:$componentSet,
                                setData:{ id:widgetFn.activeData.id, sign:widgetFn.activeData.sign }
                            });

                            $(allComponent[widgetFn.activeData.id]).on('changeData', function(){
                                var data = arguments[1] && arguments[1].data || {};
                                if(!data.id){ return false;}
                                postMsgIframe(data.id, data);
                            });

                            $componentSet.find($("[data-id=" + widgetFn.activeData.id + "]")).addClass('c-component-active');
                            PreviewWidget.drag.init($previewWrap.find('.preview-item-active'));
                            allComponent[widgetFn.activeData.id].isSave = true;
                            if(widgetFn.activeData.sign == 'NavImg'){
                                var componentData = allComponent[widgetFn.activeData.id].result();
                                SaveData.widget({
                                    data:{
                                        data:[ { module_id: widgetFn.activeData.id, config: componentData } ]
                                    },
                                    update: true,
                                    success: function(result){
                                        allComponent[widgetFn.activeData.id].isSave = true;
                                        postMsgIframe(widgetFn.activeData.id, componentData);
                                    }
                                });
                            }
                        }
                    });
                });
            };

            widgetFn.init();

            //选中预览区的某个组件
            $previewWrap.on('click', '.preview-item', function(){
                var id = $(this).data('id');
                var sign = $(this).data('sign');
                $previewWrap.find('.preview-item-active').removeClass('preview-item-active');
                $(this).addClass('preview-item-active');

                cleanBtnDragClass();
                var $btnDragActive = $dragWrap.find($("[data-sign=" + sign + "]"));
                $btnDragActive.find('span').attr('class', $btnDragActive.data('class') + '-2');

                $componentSet.children().hide();
                $componentSet.find('.c-component-active').removeClass('c-component-active');
                $componentSet.find($("[data-id=" + id + "]")).addClass('c-component-active').show();
            });

            //删除组件
            $previewWrap.on('click', '.btn-remove', function(){
                var $parents = $(this).parents('.preview-item');
                var id = $parents.data('id');
                var sign = $parents.data('sign');

                new base.Dialog({
                    headerTxt:'删除当前组件',
                    content:'删除后将无法恢复，是否继续删除？',
                    btnOkTxt:'删除',
                    okCallback: function(){
                        $parents.remove();
                        $componentSet.find($("[data-id=" + id + "]")).remove();
                        delete allComponent[id];
                        var $btnDragActive = $dragWrap.find($("[data-sign=" + sign + "]"));
                        $btnDragActive.find('span').attr('class', $btnDragActive.data('class'));
                    }
                });
            });

            //设为当前使用
            $hdBottom.on('click', '.btn-save-use', function(){
                IsUseCurrent.setStatus({
                    parent: $hdBottom.find('.btn-save-use')
                });
            });

            //预览
            $hdBottom.on('click', '.js-btn-preview', function(){
                var $that = $(this);

                var widgetData = [];
                $.each(allComponent, function(index, item){
                    widgetData.push({
                        module_id: index,
                        config: allComponent[index].result()
                    });
                });
                $.each(widgetData, function(i, item){
                    postMsgIframe(item.module_id, item.config);
                })
            });

            //保存
            $hdBottom.on('click', '.js-btn-save', function(){
                base.onunload({isOpen: true});
                var $that = $(this);
                if($(this).attr('data-status') != 1) return false;
                $(this).attr('data-status', 0);
                savePageAll({
                    callback: function(){
                        $that.attr('data-status', 1);
                    }
                });
            });

            //离开页面时触发弹框
            base.onunload();
        }
    }
});

