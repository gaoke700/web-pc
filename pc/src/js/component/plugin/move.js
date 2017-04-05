define(function (require, exports, module) {
    var $ = MJQ;
    var Drag = require('../../common/drag.js');
    var DragPlugin = require('../../common/drag-plugin.js');

    function Move(obj){
        if(!obj) return false;
        if(obj.length<=0) return false;
        this.nearlyObjIndex = false;
        this.parent = null;
        this.obj = obj;
        this.index = 0;
        this.init()
    }

    Move.prototype.constructor = Move;
    Move.prototype.init = function(){
        var _this = this;
        this.parent = this.obj.parent();
        var iL = this.obj.offset().left;
        var iR = iL + this.obj.outerWidth();
        var dragg = new Drag({
            ele: this.obj,
            moveLimits:{
                //left:iL,
                //right:iR,
                //bottom:'infinity'
            }
        });
        $(dragg).on('mouseDownStart', function(){
            _this.mouseDownStart(arguments[1]);
        });
        $(dragg).on('mouseMoveIng', function(){
            _this.mouseMoveIng(arguments[1]);
        });
        $(dragg).on('mouseUpEnd', function(){
            var isClick = arguments[1].isClick;
            _this.mouseUpEnd(isClick);
        });
    };

    Move.prototype.mouseDownStart = function(opt){
        this.obj = opt.obj;
        this.index = this.obj.index();
        this.height = this.obj.outerHeight();
    };

    Move.prototype.mouseMoveIng = function(opt){
        var opt = opt;
        var moveDis = opt.moveDis;
        var width = this.obj.width();
        this.obj.css({'left': moveDis.x,'top': moveDis.y, 'width': width});
        this.obj.addClass('drag-ele');

        if(this.obj.parent().find('.placed-area').length > 0){
            this.obj.parent().find('.placed-area').remove();
        }
        var $previewItem1 = this.obj.parent().children().not('.drag-ele, .default');
        this.nearlyObjIndex = DragPlugin.findNearObj(this.obj, $previewItem1);
        if(this.nearlyObjIndex !== false){
            $previewItem1.eq(this.nearlyObjIndex).before('<div class="placed-area" style="height: ' + this.height + 'px">放在此区域</div>');
        } else {
            if(this.obj.parent().find('.default').length > 0){
                this.obj.parent().find('.default').before('<div class="placed-area" style="height: ' + this.height + 'px">放在此区域</div>');
            } else {
                this.obj.parent().append('<div class="placed-area" style="height: ' + this.height + 'px">放在此区域</div>');
            }
        }
    };

    Move.prototype.mouseUpEnd = function(isClick){
        if(isClick){ return false};
        var _this = this;
        var $placedArea = this.obj.parent().find('.placed-area');
        var oldIndex = _this.obj.parent('.upload-item-wrap').find('.c-component-upload-img-item').index(_this.obj);
        if($placedArea.length<=0 || $placedArea.is(":hidden")) return false;
        this.obj.animate({'left':$placedArea.offset().left,'top':$placedArea.offset().top}, 100, function(){
            _this.obj.removeClass('drag-ele');
            _this.obj.insertAfter($placedArea);
            _this.obj.css({'width':'auto'});
            var newIndex = _this.obj.parent('.upload-item-wrap').find('.c-component-upload-img-item').index(_this.obj);
            $(_this).trigger('mouseUpEndd', [{index:[oldIndex, newIndex]}]);
            $placedArea.hide();
        });
    };

    module.exports = Move;
});