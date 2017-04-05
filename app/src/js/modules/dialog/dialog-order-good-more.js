define(function(require, exports, module) {
    var Dialog = require('js/common/plug/dialog.js');

    function DialogOrderGoodsMore(opts) {
        this.opts = $.extend({
            headerTxt: '商品清单',
            data:[],
            cancelCallback:function(){}
        }, opts || {});

        this.init();
    }

    DialogOrderGoodsMore.prototype.constructor = DialogOrderGoodsMore;

    DialogOrderGoodsMore.prototype.init = function() {
        this.$DialogOrderGoodsMore = $('<div class="g-dialog-order-goods-more"></div>');

        this.dialog = new Dialog.Dialog({
            showHeader: true,
            // showBtn: false,
            customContent: true,
            headerTxt: this.opts.headerTxt,
            showBtn:false,
            content: this.$DialogOrderGoodsMore.html(`<div>${this.render()}</div>`),
            style: {
                position: 'bottom',
                borderRadius: .1,
                width: '100%'
            },
            cancelCallback:this.opts.cancelCallback
        });
    };

    DialogOrderGoodsMore.prototype.render = function() {
        var htmls = [];

        $.each(this.opts.data, function(i, item) {
            var price = Number(item.nowPrice || 0).toFixed(2);
            htmls.push('<ul class="g-dialog-order-goods-more-ul"><li>');
            htmls.push('<div class="m-shopping-content">');
            htmls.push('<div class="m-shopping-img">');
            htmls.push('<a href="javascript:void(0)">');
            htmls.push('<img class="lazy-load on" src="' + (item.imgSrc || '') + '" />');
            htmls.push('</a>');
            htmls.push('</div> ');
            htmls.push('<div class="m-shopping-info">');
            htmls.push('<div class="m-shopping-info-txt">');
            htmls.push('<div class="m-shopping-info-txt-name">' + (item.goodsName || '') + '</div>');
            htmls.push('<div class="m-shopping-info-txt-standard">');
            htmls.push('<span>规格:</span>');
            htmls.push('<span class="m-shopping-info-txt-standard-txt">' + (item.goodsStandard || '') + '</span>');
            htmls.push('</div>');
            htmls.push('<div class="m-shopping-info-txt-price">');
            htmls.push('<span>￥</span>');
            htmls.push('<span class="m-shopping-info-txt-price-big">' + price.split('.')[0] + '</span>');
            htmls.push('<span>.</span>');
            htmls.push('<span>' +  price.split('.')[1] + '</span>');
            htmls.push('</div>');
            htmls.push('<div class="m-shopping-info-txt-num">');
            htmls.push('<span class="m-shopping-info-txt-num-des">×</span>');
            htmls.push('<span class="m-shopping-info-txt-num-txt">' + (item.goodsBuyNum || 0) + '</span>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</li></ul>');
        });

        return htmls.join('');
    };

    module.exports = DialogOrderGoodsMore;
});