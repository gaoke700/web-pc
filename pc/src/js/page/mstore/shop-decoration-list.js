//店铺(模板)装修列表页面
define(function (require, exports, module) {
    module.exports = {
        init: function () {
            var pageParent = $('.page-shop-decoration-list');
            var tableParent = $('.page-mstore-list');
            var Table = require('../../module/table.js');
            var UiRadioSlide = require('../../module/ui-radio-slide.js');
            var renderTableObj=null;

            //两个弹窗
            //new base.Dialog({content:'内容',okCallback:function(){}});
            //base.promptDialog({str:`删除失败:${json.msg}`,time:2000});

            //渲染功能
            var renderPower={
                //初始化
                init:function(){
                    this.del();
                    this.search();
                },
                //删除  index.php?ctl=template/module&act=deleteHtmlTpl   html_tpl_id
                del:function(){
                    tableParent.on('click','.page-table-del',function(){
                        var $this=$(this);
                        var html_tpl_id=$this.data('html_tpl_id');
                        new base.Dialog({
                            content:'删除后将无法恢复，是否继续删除?',
                            btnOkTxt:'删除',
                            okCallback:function(){
                                $.ajax({
                                    url:'index.php?ctl=template/module&act=deleteHtmlTpl',
                                    type:'post',
                                    data:{
                                        html_tpl_id:html_tpl_id
                                    },
                                    dataType:'json',
                                    success:function(json){
                                        if(json.res=='succ'){
                                            base.promptDialog({str:`删除成功`});
                                            renderTable();
                                        }else{
                                            base.promptDialog({str:`删除失败:${json.msg}`,time:2000});
                                        }
                                    }
                                })
                            },
                        });
                    })
                },
                //预览
                view:function(){

                    $('.page-table-view').each(function(i, item){
                        var src = $(this).data('view') || '';
                        var url = $(this).data('url') || '';
                        var html = '';
                        html += '<div class="p5">';
                        html += '<img style="display: block; width: 120px; height: 120px; margin: 0 auto 15px;" src="' + src + '" />';
                        html += '<div class="ui-block ui-block-align-c"><p class="pr10">扫一扫，手机预览</p><a class="ui-btn ui-btn-c-1" href="' + (url||'javascript:;') + '" target="_blank">PC预览</a></div>';
                        html += '</div>';

                        new base.Popover({
                            obj: $(item),
                            parent:pageParent,
                            content: html,
                            arrowPos: 'right',
                            placement:2,
                            event: 'hover'
                        });
                    });

/*
                    $('.page-table-view').each(function(i, item){
                        var src=$(this).data('view');
                        var html=`
                            <div style="width: 160px;height: 160px;"><img width="100%" height="100%" src="${src}" alt=""></div>
                        `;
                        new base.Popover({
                            obj: $(item),
                            parent:pageParent,
                            content: html,
                            arrowPos: 'right',
                            placement:2,
                            event: 'hover'
                        });
                    });
*/
                },
                //使用  index.php?ctl=template/module&act=applyHtmlTpl   html_tpl_id
                use:function(json){
                    var opt=$.extend(true,{
                        html_tpl_id:0,
                        status:'off',//假设默认是关闭状态
                        success:function(){
                            //console.log('使用成功');
                        },
                        fail:function(){
                            //console.log('使用失败');
                        },
                    },json);
                    if(opt.status=='on'){//已经开启
                        base.promptDialog({str:`无法关闭,请重新选择默认模板`,time:2000});
                        return false;
                    }
                    new base.Dialog({
                        content:'确定使用?',
                        okCallback:function(){
                            $.ajax({
                                url:'index.php?ctl=template/module&act=applyHtmlTpl',
                                type:'post',
                                data:{
                                    html_tpl_id:opt.html_tpl_id,
                                },
                                dataType:'json',
                                success:function(json){
                                    if(json.res=='succ'){
                                        base.promptDialog({str:`使用成功`,callback:function(){
                                            opt.success();
                                            renderTable();
                                        }});
                                    }else{
                                        opt.fail();
                                        base.promptDialog({str:`使用失败:${json.msg}`,time:2000});
                                    }
                                }
                            })
                        },
                    });
                },
                //搜索
                search:function(){
                    pageParent.on('click','.page-btn-search',function(){
                        var val=$(this).parents('.ui-search').find('input').val();
                        renderTableObj.ajax({
                            select: {
                                name: val,
                            }
                        });
                    });
                }
            };
            //渲染表格
            function renderTable(){
                tableParent.html('');
                renderTableObj=new Table({
                    parent: tableParent,
                    tableConfig: {
                        headConfig: [
                            { text: '名称' },
                            { text: '最后修改时间', sort: true, name: 'update_time' },
                            { text: '是否使用' },
                            { text: '操作' }
                        ]
                    },
                    ajaxData: { model: 'template/htmlTpl' },
                    renderItemFn: function (data) {
                        var arr=[];
                        data.forEach(function(v){
                            var pageTableActive=``;
                            var delHTML=``;
                            var mr='';
                            if(!v.showDelete){//模板没有被使用
                                delHTML=`<a class="page-table-del" href="javascript:;" data-html_tpl_id="${v.html_tpl_id}">删除</a>`;
                                mr='mr20';
                            }else{//模板使用中
                                pageTableActive=`page-table-active`;
                            }
                            arr.push([
                                `<div class="page-table-name ${pageTableActive}">${v.name}</div>`,
                                `<div class="page-table-time ${pageTableActive}">${v.update_time}</div>`,
                                `<div class="page-table-use ${pageTableActive}" data-status="${v.status}" data-html_tpl_id="${v.html_tpl_id}"></div>`,
                                `
                                    <div class="page-table-opt ${pageTableActive}">
                                        <a class="page-table-view mr20" data-view="${v.preview}" data-url="${v.pcPreviewUrl}" href="javascript:;">预览</a>
                                        <a class="page-table-edit ${mr}" href="${v.edit}&surl=${pageShopdecorationlist.surl}">编辑</a>
                                        ${delHTML}
                                    </div>
                                `,
                            ])
                        });
                        return arr;
                    },
                    renderItemCallback:function(){
                        $('.page-table-use').each(function(i,e){
                            var status='off';
                            if(e.dataset.status=='1'){
                                status='on';
                            }
                            var uiRadioSlide=new UiRadioSlide({
                                checkTxt:{
                                    on:'已开启',
                                    off:'已关闭',
                                },
                                status:status,//默认开启还是关闭(默认关闭)  'off'  'on'
                                clickCallback:function(obj){//点击时的回调
                                    var html_tpl_id=uiRadioSlide.parent.parents('.page-table-use').data('html_tpl_id');
                                    renderPower.use({
                                        html_tpl_id:html_tpl_id,
                                        status:obj.status,
                                    });
                                }
                            });
                            $(this).append(uiRadioSlide.parent);
                        });
                        renderPower.view();
                    }
                });
            }
            renderTable();
            renderPower.init();
        }
    }
});