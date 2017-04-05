define(function (require, exports, module) {
    var $ = MJQ;

    function ScrollLoad(opts){
        this.opts = {
            parent:null,
            pH:0,   //元素的高度
            bStop: true
        };
        this.init(opts||{});
    };

    ScrollLoad.prototype.constructor = ScrollLoad;

    ScrollLoad.prototype.init = function(opts){
        $.extend(this.opts, opts);
        if(!this.opts.parent) return false;

        var _this = this;
        this.opts.pH = this.opts.parent.innerHeight();
        this.opts.parent.on('scroll', function(){
            _this.scroll($(this));
        });
    };

    ScrollLoad.prototype.scroll = function(obj){
        var sH = obj[0].scrollHeight;
        var sT = obj[0].scrollTop;
        if(sT + this.opts.pH >= sH - 40 && this.opts.bStop){
            this.opts.bStop = false;
            $(this).trigger('scrollEnd');
        }
    };

    module.exports = ScrollLoad;
});
