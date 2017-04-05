define(function (require, exports, module) {
    var $ = MJQ;
    var UploadImg = require('./plugin/upload-img.js');

    function StoreHeader(opts){
        opts = opts || {};
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                style: 1,
                spacing: 5,
                sliderTime: 3000,
                imgInfo: []
            }
        };
        this.parent = null;
        this.step1 = null;
        this.step2 = null;
        this.isSave = true;
        this.init(opts);
    };

    StoreHeader.prototype.constructor = StoreHeader;

    StoreHeader.prototype.init = function(opts){
        $.extend(true, this.opts, opts);
        if(this.opts.setData.sliderTime < 3000 && this.opts.setData.sliderTime != 2000){
            this.opts.setData.sliderTime = 3000;
        }
        var _this = this;
        this.parent = $('<div class="c-component-storeHeader" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">店铺头部样式选择</p></div>');
        this.step1 = $('<div class="c-component-storeHeader-step1"></div>');
        this.step1.append(this.renderStep1());
        this.renderStep2();
        var spacingStr = '<div style="margin: 0 25px 15px;"><span>间距：</span><input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div>';
        this.parent.append(spacingStr);
        this.parent.append(this.step1);
        this.parent.append(this.step2);
        this.opts.parent.append(this.parent);

        this.parent.on('input', '.input-spacing', function(){
            $(this).val($(this).val().replace(/[^\d]/g,''));
        });

        this.parent.on('blur', '.input-spacing', function(){
            var val = $(this).val().replace(/[^\d]/g,'') || 5;
            $(this).val(val);
            _this.opts.setData.spacing = val;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        this.step1.on('click', '.js-btn-choose', function(e){
            if($(e.target).parent().hasClass('btn-editor')){
                _this.step1.hide();
                _this.step2.show();
            } else {
                _this.changeStyle($(this));
            }
        });
    };

    StoreHeader.prototype.renderStep1 = function(){
        var itemHtmls = '', _this = this;

        $.each([1,2,3,4,5], function(i, item){

            itemHtmls += '<div class="js-btn-choose c-component-storeHeader-step1-item ' + (item == _this.opts.setData.style ? 'c-component-storeHeader-step1-item-active' : '') + '" data-style="' + item + '">';
            if(item == 5){
                itemHtmls += '<div class="btn-editor"><i class="icons-editor5"></i><span>特殊样式</span></div>';
            }
            itemHtmls += '<div class="btn-radio"><i class="icons-tick4"></i></div>';
            itemHtmls += '<img class="style-img" src="user_components/admin/dist/images/component/store-header/' + item + '.png">';
            itemHtmls += '</div>';
        });

        return itemHtmls;
    };

    StoreHeader.prototype.renderStep2 = function(){
        var _this = this;
        this.step2 = $('<div class="c-component-storeHeader-step2" style="display: none;"></div>');
        this.step2.append(this.step2Style());
        this.uploadImg = new UploadImg({
            maxImgLen:5,
            imgSize:{
                h:300
            },
            imgArr: this.opts.setData.imgInfo
        });
        this.step2.append(this.uploadImg.opts.parent);

        $(this.uploadImg).on('changeData', function(){
            var opts = arguments[1];
            if(opts.imgArr && opts.imgArr.length > 0){
                _this.opts.setData.imgInfo = _this.uploadImg.result();
                _this.isSave = false;
                $(_this).trigger('changeData', [{ data: _this.result() }]);
            }
        });
    };

    StoreHeader.prototype.step2Style = function(){
        var $step2Style = $('<div class="c-component-storeHeader-step2-style"></div>');
        var sliderTime = this.opts.setData.sliderTime || 3000;
        var htmls = [], optionHtml = '', _this = this;

        $.each([2000,3000,5000], function(i ,item){
            optionHtml += '<div class="option ' + (item == sliderTime ? 'active': '') + '" data-value="' + item + '">' + item/1000 + 's</div>';
        });
        htmls.push('<p class="btn-return"><&nbsp;返回店铺头部样式选择</p>');
        htmls.push('<div class="c-component-choose-time" data-value="' + sliderTime + '">');
        htmls.push('<div class="title">');
        htmls.push('<p>滚动间隔 ' + sliderTime/1000 + 's</p>');
        htmls.push('<span><i></i></span>');
        htmls.push('</div>');
        htmls.push('<div class="option-wrap">' + optionHtml + '</div>');
        $step2Style.html(htmls.join(''));

        $step2Style.on('click', '.c-component-choose-time .title', function(e){
            _this.changeTime($(this), e);
        });

        $step2Style.on('click', '.btn-return', function(){
            _this.step2.hide();
            _this.step1.show();
            _this.opts.setData.imgInfo = _this.uploadImg.result();
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        return $step2Style;
    };

    StoreHeader.prototype.changeStyle = function(obj){
        if(this.opts.setData.style == obj.data('style')) return false;
        this.step1.find('.c-component-storeHeader-step1-item').removeClass('c-component-storeHeader-step1-item-active');
        obj.addClass('c-component-storeHeader-step1-item-active');
        this.opts.setData.style = obj.data('style');
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    StoreHeader.prototype.changeTime = function(obj, e){
        var _this = this;
        var $parent = obj.parent();
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

    StoreHeader.prototype.result = function(){
        return this.opts.setData;
    };

    module.exports = StoreHeader;
});