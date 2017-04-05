define(function (require, exports, module) {
    var Dialog = require('js/common/plug/dialog.js');
    var loading = base.loading();

    function DialogGetCoupons(opts){
        this.opts = $.extend({
            headerTxt:'领取优惠劵',
            loadDomOverFn:null
        }, opts || {} );

        this.couponsList = [];

        this.init();
    }

    DialogGetCoupons.prototype.constructor = DialogGetCoupons;

    DialogGetCoupons.prototype.init = function(){
    	var _this=this;
        this.$dialogGetCoupons = $('<div class="g-dialog-get-coupons"></div>');
        new Dialog.Dialog({
            showHeader:true,
            showBtn: false,
            customContent: true,
            closeCallback: _this.opts.closeCallback,
            headerTxt: this.opts.headerTxt,
            content: this.$dialogGetCoupons.html('<ul class="g-dialog-get-coupons-ul"></ul>'),
            style:{
                position:'bottom',
                borderRadius:.1,
                width: '100%'
            }
        });
        this.ajax();
        this.event();
    };

    DialogGetCoupons.prototype.renderList = function(){
        var htmls = [];
        $.each(this.couponsList, function(i, item){
            if(!item.coupon_id){ return false; }
            htmls.push('<li class="g-dialog-get-coupons-li" data-ipSendNum="' + (item.ip_send_num || 0) + '" data-id="' + item.coupon_id + '">');
            htmls.push('<div class="g-dialog-get-coupons-num">￥<span>' + Number(item.price || 0).toFixed(0) + '</span></div>');
            htmls.push('<div class="g-dialog-get-coupons-tip">');
            htmls.push('<p>' + (item.coupon_title || '') + '</p>');
            htmls.push('<p>' + (item.begin_time || '').substring(0,10).replace(/-/g, ".") + ' - ' + (item.end_time || '').substring(0,10).replace(/-/g, ".") + '</p>');
            htmls.push('<p>' + (item.goods_ids ? '部分商品可用' : '全店铺商品通用') + '</p>');
            htmls.push('</div>');
            if(item.getTag == 0){
                htmls.push('<div class="g-dialog-get-coupons-status"><div class="g-dialog-get-coupons-status-btn js-btn-get-coupons">点击领取</div></div>');
            }else if(item.getTag == 3){
                htmls.push('<div class="g-dialog-get-coupons-status"><div class="g-dialog-get-coupons-status-text">已领完</div></div>');
            }else {
                htmls.push('<div class="g-dialog-get-coupons-status"><div class="g-dialog-get-coupons-status-text">已领取</div></div>');
            }
            htmls.push('</li>');
        });
        return htmls.join('');
    };

    DialogGetCoupons.prototype.ajax = function(){
        var htmls = '', _this = this;

        base.ajax({
            url: 'openapi.php?act=coupon_list',
            type:'post',
            data: {
                pagesize:100,
                page:1
            },
            dataType: 'json',
            success: function(result){
                result = result || {};
                if(result.res == 'succ'){
                    var data = result.result || {};
                    _this.couponsList = data.data || [];
                    htmls = _this.couponsList.length > 0 ? _this.renderList() : '暂无可领取的优惠卷';
                }
                _this.$dialogGetCoupons.find('.g-dialog-get-coupons-ul').html(htmls);
                _this.opts.loadDomOverFn&&_this.opts.loadDomOverFn();
            }
        });
    };

    DialogGetCoupons.prototype.event = function(){
        var _this = this;

        //领取优惠卷
        var isClick=true;
        this.$dialogGetCoupons.on('click', '.js-btn-get-coupons', function(){
            if(isClick){
                isClick=false;
                loading.show();
                var $li = $(this).parents('.g-dialog-get-coupons-li');
                var id = $li.data('id');
                var index = base.utils.arrayFindkey(_this.couponsList, 'coupon_id', id);
                if(_this.couponsList[index] && _this.couponsList[index].ip_send_num &&  (_this.couponsList[index].ip_send_num > 0 || _this.couponsList[index].ip_send_num == 'infinity')){
                    _this.getCoupons(id, function(result){
                        isClick=true;
                        loading.hide();
                        Dialog.dialogPrompt1({
                            content: (result.msg || ''),
                            time: 2000
                        });
                        if(result.res == 'succ'){
                            if(_this.couponsList[index].ip_send_num == 'infinity'){ return false;}
                            _this.couponsList[index].ip_send_num--;
                            if(_this.couponsList[index].ip_send_num <= 0){
                                $li.find('.g-dialog-get-coupons-status').html('<div class="g-dialog-get-coupons-status-text">已领取</div>');
                            }
                        }
                    });
                } else {
                    Dialog.dialogPrompt1({
                        content: '您没有可领次数',
                        time: 2000
                    });
                }
            }
        });
    };

    DialogGetCoupons.prototype.getCoupons = function(id, callback){
        var _this = this;
        if(!id){ return false; }
        base.ajax({
            url: 'openapi.php?act=getCoupon',
            type:'post',
            data: {
                coupon_id:id
            },
            dataType: 'json',
            success: function(result){
                if(callback){
                    callback(result||{})
                };
            }
        });
    };

    module.exports = DialogGetCoupons;
});
