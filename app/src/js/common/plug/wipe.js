define(function (require, exports, module) {

    function Wipe(opts){
        if(!opts && !opts.id && !opts.cover){
            return false;
        }
        this.conNode = document.getElementById(opts.id);
        this.cover = opts.cover;
        this.mask = null;
        this.maskCtx = null;
        this.width = opts.width || 300;
        this.height = opts.height || 100;
        this.clientRect = null;
        this.drawPercentCallback = opts.drawPercentCallback || null;
        this.isTouch = false;
        this.eTouchstart = opts.eTouchstart || null;
        this.init();
    };

    Wipe.prototype.constructor = Wipe;

    Wipe.prototype.init = function(){
        this.mask = this.mask || document.createElement('canvas');

        if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
            this.conNode.appendChild(this.mask);
            this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null;
            this.bindEvent();
        }

        this.maskCtx = this.maskCtx || this.mask.getContext('2d');
        this.mask.width = this.width;
        this.mask.height = this.height;
        this.mask.getContext('2d').clearRect(0, 0, this.width, this.height);

        var image = new Image(), _this = this;
        image.onload = function () {
            _this.maskCtx.drawImage(this, 0, 0, _this.width, _this.height);
            _this.maskCtx.globalCompositeOperation = 'destination-out';
        };
        // image.crossOrigin = 'anonymous';
        image.src = this.cover;
    };

    Wipe.prototype.bindEvent = function(){
        var _this = this;
        var device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
        var clickEvtName = device ? 'touchstart' : 'mousedown';
        var moveEvtName = device ? 'touchmove': 'mousemove';
        if (!device) {
            var isMouseDown = false;
            document.addEventListener('mouseup', function(e) {
                isMouseDown = false;
            }, false);
        } else {
            document.addEventListener("touchmove", function(e) {
                if (isMouseDown) {
                    e.preventDefault();
                }
            }, false);
            document.addEventListener('touchend', function(e) {
                isMouseDown = false;
            }, false);
        }
        this.mask.addEventListener(clickEvtName, function (e) {
            if(_this.eTouchstart && !_this.isTouch){
                _this.eTouchstart();
                _this.isTouch = true;
            }
            isMouseDown = true;
            var docEle = document.documentElement;
            if (!_this.clientRect) {
                _this.clientRect = { left: 0, top:0 };
            }
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
            var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
            _this.drawPoint(x, y);
        }, false);

        this.mask.addEventListener(moveEvtName, function (e) {
            if(!device && !isMouseDown) {
                return false;
            }
            var docEle = document.documentElement;
            if(!_this.clientRect){
                _this.clientRect = { left: 0, top:0 };
            }
            var x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft;
            var y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop;
            _this.drawPoint(x, y);
        }, false);
    };

    Wipe.prototype.getTransparentPercent = function(ctx, width, height){
        var imgData = ctx.getImageData(0, 0, width, height),
            pixles = imgData.data,
            transPixs = [];
        for (var i = 0, j = pixles.length; i < j; i += 4) {
            var a = pixles[i + 3];
            if (a < 128) {
                transPixs.push(i);
            }
        }
        return (transPixs.length / (pixles.length / 4) * 100).toFixed(2);
    };

    Wipe.prototype.drawPoint = function(x, y){
        this.maskCtx.beginPath();
        var radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, 30);
        radgrad.addColorStop(1, 'rgba(0,0,0,1)');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.maskCtx.fillStyle = radgrad;
        this.maskCtx.arc(x, y, 30, 0, Math.PI * 2, true);
        this.maskCtx.fill();
        if (this.drawPercentCallback){
            this.drawPercentCallback.call(null, this.getTransparentPercent(this.maskCtx, this.width, this.height));
        }
    };

    module.exports = Wipe;
});