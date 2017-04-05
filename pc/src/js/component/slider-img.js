define(function (require, exports, module) {
    var $ = MJQ;
    var UploadImg = require('./plugin/upload-img.js');

    function SliderImg(opts){
        opts = opts || {};
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                spacing: 5,
                sliderTime: 3000,
                imgInfo: []
            }
        };
        this.ele = null;
        this.isSave = true;
        this.init(opts);
    };

    SliderImg.prototype.constructor = SliderImg;

    SliderImg.prototype.init = function(opts){
        var _this = this;
        $.extend(true, this.opts, opts);
        if(this.opts.setData.sliderTime < 3000 && this.opts.setData.sliderTime != 2000){
            this.opts.setData.sliderTime = 3000;
        }

        this.uploadImg = new UploadImg({
            maxImgLen:8,
            imgArr: this.opts.setData.imgInfo
        });
        this.ele = $('<div class="c-component-sliderImg" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">轮播广告设置</p></div>');
        this.chooseStyleWrap = $('<div class="c-component-sliderImg-style"></div>');
        this.chooseStyleWrap.html(this.renderStyle());
        this.ele.append(this.chooseStyleWrap);
        this.ele.append(this.uploadImg.opts.parent);
        this.opts.parent.append(this.ele);

        this.ele.on('input', '.input-spacing', function(){
            $(this).val($(this).val().replace(/[^\d]/g,''));
        });

        this.ele.on('blur', '.input-spacing', function(){
            var val = $(this).val().replace(/[^\d]/g,'') || 5;
            $(this).val(val);
            _this.opts.setData.spacing = val;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        $(this.uploadImg).on('changeData', function(){
            var opts = arguments[1];
            if(opts.imgArr && opts.imgArr.length > 0){
                _this.opts.setData.imgInfo = opts.imgArr;
                _this.isSave = false;
                $(_this).trigger('changeData', [{ data: _this.result() }]);
            }
        });

        this.chooseStyleWrap.on('click', '.choose-time .title', function(e){
            _this.changeTime($(this), e);
        });
    };

    SliderImg.prototype.renderStyle = function(){
        var sliderTime = this.opts.setData.sliderTime || 3000;
        var htmls = [], optionHtml = '';

        $.each([2000,3000,5000], function(i ,item){
            optionHtml += '<div class="option ' + (item == sliderTime ? 'active': '') + '" data-value="' + item + '">' + item/1000 + 's</div>';
        });

        htmls.push('<div class="choose-time c-component-choose-time" data-value="' + sliderTime + '">');
        htmls.push('<div class="title">');
        htmls.push('<p>滚动间隔 ' + sliderTime/1000 + 's</p>');
        htmls.push('<span><i></i></span>');
        htmls.push('</div>');
        htmls.push('<div class="option-wrap">' + optionHtml + '</div>');
        htmls.push('<div style="margin: 15px 0;"><span>间距：</span><input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div>');

        return htmls.join('');
    };

    SliderImg.prototype.changeTime = function(obj, e){
        var _this = this;
        var $parent = obj.parent('.choose-time');
        var $optionWrap = $parent.find('.option-wrap');

        if($optionWrap.is(":hidden")){
            $optionWrap.show();
        }

        $optionWrap.on('click', '.option', function(e){
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            var value = $(this).data('value');
            $parent.data('value', value);
            $parent.find('.title p').html('滚动间隔 ' + value/1000 + 's');
            $optionWrap.hide();
            _this.opts.setData.sliderTime = value;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
            e.stopPropagation();
        });


        $(document).one("click", function(){
            $optionWrap.hide();
        });
        e.stopPropagation();
    };

    SliderImg.prototype.result = function(){
        var arr = [], result = this.uploadImg.result();
        for(var i=0; i<result.length; i++){
            arr.push(result[i]);
        }
        this.opts.setData.imgInfo = arr;
        return this.opts.setData;
    };

    module.exports = SliderImg;
});