define(function (require, exports, module) {
    var $ = MJQ;
    var userSelect = 'WebkitUserSelect';

    function Drag(opts){
        if(!(opts && opts.ele)){
            console.log('请传入需要拖动的元素');
            return;
        };
        this.ele = opts.ele;
        this.isClick = true;
        this.moveLimits = opts.moveLimits || {};
        this.moveLimits.left = this.moveLimits.left || 0;
        this.moveLimits.right = (this.moveLimits.right || $(window).width()) - this.ele.outerWidth();
        this.moveLimits.top = this.moveLimits.top || 0;
        this.moveLimits.bottom = (this.moveLimits.bottom || $(window).height()) - this.ele.outerHeight();
        this.init();
    };

    Drag.prototype.constructor = Drag;

    Drag.prototype.init = function(){
        var _this = this;
        this.ele.on('mousedown', function(e){
            _this.mouseDown(this,e);
        })
    };

    Drag.prototype.mouseDown = function(obj, e){
        var _this = this;
        if(e.target.nodeName.toLowerCase() == 'input'){
            return false;
        }
        this.objDis = {
            x: $(obj).offset().left,
            y: $(obj).offset().top
        };

        this.dis = {
            x: (e.pageX - this.objDis.x),
            y: (e.pageY - this.objDis.y)
        };

        $(this).trigger('mouseDownStart', [{
            objDis: this.objDis,
            dis: this.dis,
            obj: $(obj)
        }]);

        $(document).on('mousemove', function(e){
            _this.mouseMove(this, e);
        });

        $(document).on('mouseup', function(){
            _this.mouseUp(this);
        });

        if(typeof userSelect === "string"){
            return document.documentElement.style[userSelect] = "none";
        }
        document.unselectable  = "on";
        document.onselectstart = function(){
            return false;
        };

        return false;
    };

    Drag.prototype.mouseMove = function(obj, e){
        var moveDis = {
            x: (e.clientX - this.dis.x),
            y: (e.clientY - this.dis.y)
        };
        if(this.moveLimits.left != 'infinity'){
            moveDis.x = moveDis.x < this.moveLimits.left ? this.moveLimits.left : moveDis.x;
        }
        if(this.moveLimits.right != 'infinity'){
            moveDis.x = moveDis.x > this.moveLimits.right ? this.moveLimits.right : moveDis.x;
        }
        if(this.moveLimits.top != 'infinity'){
            moveDis.y = moveDis.y < this.moveLimits.top ? this.moveLimits.top : moveDis.y;
        }
        if(this.moveLimits.bottom != 'infinity'){
            moveDis.y = moveDis.y > this.moveLimits.bottom ? this.moveLimits.bottom : moveDis.y;
        }
        this.isClick = false;
        $(this).trigger('mouseMoveIng', [{moveDis:moveDis}]);
    };

    Drag.prototype.mouseUp = function(){
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
        $(this).trigger('mouseUpEnd', [{objDis: this.objDis, isClick: this.isClick}]);
        if(typeof userSelect === "string"){
            return document.documentElement.style[userSelect] = "text";
        }
        document.unselectable  = "off";
        document.onselectstart = null;
    };

    module.exports = Drag;
});