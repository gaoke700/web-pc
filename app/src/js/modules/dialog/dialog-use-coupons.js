define(function (require, exports, module) {
    var Dialog = require('js/common/plug/dialog.js');

    function DialogUseCoupons(opts){
        this.opts = $.extend({
            headerTxt:'选择优惠劵',
            submitOrder: '',    //必填
            chooseCoupons: function(){},
            renderCallback:function(){},
            cancelCallback: function(){}
        }, opts || {} );

        this.couponsList = {};
        this.choose = {};
        this.init();
    };

    DialogUseCoupons.prototype.constructor = DialogUseCoupons;

    DialogUseCoupons.prototype.init = function(){
        if(!this.opts.submitOrder){ return false; }
        this.$dialogUseCoupons = $('<div class="g-dialog-use-coupons"></div>');

        this.Dialog = new Dialog.Dialog({
            showHeader:true,
            showBtn: false,
            customContent: true,
            headerTxt: this.opts.headerTxt,
            cancelCallback: this.opts.cancelCallback,
            content: this.$dialogUseCoupons.html('<div class="g-dialog-use-coupons-list"></div><div class="g-dialog-use-coupons-btn-save js-btn-save">确定</div>'),
            style:{
                position:'bottom',
                borderRadius:.1,
                width: '100%'
            }
        });
        this.ajax();
        this.event();
    };

    DialogUseCoupons.prototype.render = function(opts){
        //htmls.push('<div class="g-dialog-use-coupons-list"><div class="g-dialog-use-coupons-list-no">很遗憾暂无可用优惠劵~</div></div>');
        //htmls.push('<div class="g-dialog-use-coupons-btn-save">确定</div>');
        var defaultOpt = $.extend({
            data:[],
            usable: true
        }, opts||{});

        var htmls = [];
        $.each(defaultOpt.data, function(i, item){
            htmls.push('<li data-key="' + (item.key || '') + '" class="g-dialog-use-coupons-li">');
            htmls.push('<p class="g-dialog-use-coupons-li-num">￥<span>' + Number(item.price || 0).toFixed(0) + '</span>元</p>');
            htmls.push('<div class="g-dialog-use-coupons-li-info">');
            htmls.push('<div class="g-dialog-use-coupons-li-info-text">');
            htmls.push('<p>' + (item.coupon_title || '') + '</p>');
            htmls.push('<p>使用期限 ' + (item.begin_time || '').substring(0,10).replace(/-/g, ".") + ' - ' + (item.end_time || '').substring(0,10).replace(/-/g, ".") + '</p>');
            htmls.push('</div>');
            htmls.push('<div class="g-dialog-use-coupons-li-info-yuan ' + (defaultOpt.usable ? 'js-btn-choose' : '') + '"><span class="icons icons-gou"></span></div>');
            htmls.push('</div>');
            htmls.push('</li>');
        });
        return htmls.join('');
    };

    DialogUseCoupons.prototype.ajax = function(){
        var _this = this, htmls = [];
        base.ajax({
            url: 'openapi.php?act=coupon',
            type:'post',
            data: {
                submitOrder: _this.opts.submitOrder
            },
            dataType: 'json',
            success: function(result){
                result = result || {};
                result.res = result.res || '';
                if(result.res != 'succ'){
                    return false;
                }
                result.result = result.result || {};
                var usable = result.result.usable || {};
                var unusable = result.result.unusable || {};
                if(usable.count > 0 || unusable.count > 0){
                    _this.couponsList = result.result;
                    if(usable.count > 0){
                        htmls.push('<p class="g-dialog-use-coupons-title">可用优惠卷（' + (usable.count || 0) + '）</p>');
                        htmls.push('<ul class="g-dialog-use-coupons-ul">' + _this.render({data:(usable.list || [])}) + '</ul>');
                    }
                    if(unusable.count > 0){
                        htmls.push('<p class="g-dialog-use-coupons-title">不可用优惠卷（' + (unusable.count || 0) + '）</p>');
                        htmls.push('<ul class="g-dialog-use-coupons-ul g-dialog-use-coupons-ul-no-use">' + _this.render({data:(unusable.list || []), usable: false}) + '</ul>');
                    }
                } else {
                    htmls.push('<div class="g-dialog-use-coupons-list-no">很遗憾暂无可用优惠劵~</div>');
                }
                _this.$dialogUseCoupons.find('.g-dialog-use-coupons-list').html(`<div>${htmls.join('')}</div>`);
                _this.chooseFn(usable.list[0] && usable.list[0].key || '');
                _this.opts.renderCallback();
            }
        });
    };

    DialogUseCoupons.prototype.event = function(){
        var _this = this;

        //选择使用优惠卷
        this.$dialogUseCoupons.on('click', '.js-btn-choose', function(){
            _this.chooseFn($(this).parents('.g-dialog-use-coupons-li').data('key'));
            _this.opts.cancelCallback();
        });

        this.$dialogUseCoupons.on('click', '.js-btn-save', function(){
            _this.Dialog.remove();
            if(base.jsonToArray(_this.choose).length > 0 && _this.couponsList.submitOrderUrl){
                window.location.href = _this.couponsList.submitOrderUrl + '&coupon_id=' + _this.choose.couponIds;
            }
            _this.opts.cancelCallback();
        });
    };

    DialogUseCoupons.prototype.chooseFn = function(key){
        if(!key){ return false; }
        var className = 'g-dialog-use-coupons-li-info-yuan-active';
        this.$dialogUseCoupons.find('.' + className).removeClass(className);
        $.each(this.$dialogUseCoupons.find('.g-dialog-use-coupons-li'), function(i, item){
            if($(item).data('key') && $(item).data('key') == key){
                $(item).find('.g-dialog-use-coupons-li-info-yuan').addClass(className);
            }
        });
        
        var index = base.utils.arrayFindkey(this.couponsList.usable.list, 'key', key);
        this.choose = this.couponsList.usable.list[index];
    };
    module.exports = DialogUseCoupons;
});
