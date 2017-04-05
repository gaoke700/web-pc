define(function (require, exports, module) {
    var $ = MJQ;
    var Drag = require('../../common/drag.js');
    var DragPlugin = require('../../common/drag-plugin.js');

    function PreviewWidget(opts){
        var $previewWrap = opts.parent || null;
        var pageId = opts.pageId || '';
        var webRootUrl = opts.webRootUrl || '';
        //可视区的组件拖拽
        var drag = {
            nearlyObjIndex: false,
            obj:null
        };
        drag.init = function(obj){
            if(!obj || obj.length <= 0) return false;
            var iL = obj.offset().left;
            var iR = iL + obj.outerWidth();
            var dragg = new Drag({
                ele: obj,
                moveLimits:{
                    left:iL,
                    right:iR,
                    bottom:'infinity'
                }
            });
            $(dragg).on('mouseDownStart', drag.mouseDownStart);
            $(dragg).on('mouseMoveIng', drag.mouseMoveIng);
            $(dragg).on('mouseUpEnd', drag.mouseUpEnd);
        };

        drag.mouseDownStart = function(){
            var opt = arguments[1];
            drag.obj = opt.obj;
        };

        drag.mouseMoveIng = function(){
            var opt = arguments[1];
            var moveDis = opt.moveDis;
            drag.obj.css({'left': moveDis.x,'top': moveDis.y});
            drag.obj.addClass('drag-ele');

            $previewWrap.find('.placed-area').remove();
            var $previewItem1 = $previewWrap.find('.preview-item').not('.drag-ele');
            drag.nearlyObjIndex = DragPlugin.findNearObj(drag.obj, $previewItem1);
            if(drag.nearlyObjIndex !== false){
                $previewItem1.eq(drag.nearlyObjIndex).before('<div class="placed-area">放在此区域</div>');
            } else {
                $previewWrap.append('<div class="placed-area">放在此区域</div>');
            }
        };

        drag.mouseUpEnd = function(){
            var isClick = arguments[1].isClick;
            if(!isClick){
                if($previewWrap.find('.placed-area').length<=0) return false;
                var $placedArea = $previewWrap.find('.placed-area');
                drag.obj.animate({'left':$placedArea.offset().left,'top':$placedArea.offset().top}, 100, function(){
                    drag.obj.removeClass('drag-ele');
                    drag.obj.insertAfter($placedArea);
                    $placedArea.remove();
                });
            }
        };

        function render(data){
            var htmls = '';
            $.each(data, function(i ,item){
                htmls += creat(item);
            });

            var reg = new RegExp('preview-item-active', 'g');
            htmls = htmls.replace(reg, ' ');
            $previewWrap.html(htmls);
            drag.init($previewWrap.find('.preview-item'));
        }

        //渲染拖拽组件的ifram到手机可视区
        function creat(opt){
            if(!opt) return false;
            var data = [];

            if(!(opt instanceof Array)){
                data.push(opt);
            }

            var htmls = [];
            $.each(data, function(i, item){
                var id = item.id || '';
                var name = item.name || '';
                var sign = item.sign || '';

                htmls.push('<div class="preview-item preview-item-active" data-id="' + id + '" data-sign="' + sign + '" data-name="' + name + '"><div class="wrap">');
                htmls.push('<div class="r-func"><div class="move-decoration"><i class="icons-double-arrow"></i></div><div class="btn-remove"><i class="icons-close2"></i></div></div>');
                htmls.push('<div class="view"><p><i class="icons-editor5"></i><span>编辑</span></p></div>');
                htmls.push('<iframe frameborder="0" scrolling="no" src="' + webRootUrl + 'index.php?ctl=module&act=render&name=' + name + '&id=' + id + '&sign=' + sign + '" data-name="' + name + '"></iframe>');
                htmls.push('</div></div>');
            });

            return htmls.join('');
        };

        function getData(){
            var data = {
                page_id: pageId,
                config: {
                    modules: []
                }
            };

            $.each($previewWrap.find('.preview-item'), function(){
                data.config.modules.push({
                    id: $(this).data('id'),
                    sign: $(this).data('sign'),
                    name: $(this).data('name')
                });
            });
            return data;
        }

        return {
            drag: drag,
            render: render,
            creat: creat,
            getData: getData
        }
    }
    module.exports = PreviewWidget;
});
