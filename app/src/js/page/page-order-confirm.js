define(function (require, exports, module) {
    module.exports = {
        init: function () {

            var DialogNewAddress = require('js/modules/dialog/dialog-new-address.js');  //新增地址
            var DialogAddressEditor = require('js/modules/dialog/dialog-address-editor.js');  //编辑地址
            var DialogUseCoupons = require('js/modules/dialog/dialog-use-coupons.js'); //使用优惠劵
            var DialogSecondary = require('js/common/plug/dialog.js'); //普通弹框

            const doc = document;
            const $tabHd = doc.querySelector('.delivery-hd');
            const $hd = doc.querySelectorAll('.delivery-hd li');
            const $bd = doc.querySelectorAll('.delivery-bd li');
            const $newbox = doc.querySelector('.common-address-newbox');
            const $editbox = doc.querySelector('.common-address-editbox');
            const $single = doc.querySelector('.shop-goods-single');
            const $more = doc.querySelector('.shop-goods-more');
            const $coupon = doc.querySelector('.shoop-coupon');
            var scroll = base.yesNoScroll();

            //配送方式--tab
            if ($tabHd) { //如果开启了自提，到店自提tab才会显示

                function tab(th, td) {
                    for (var i = 0; i < th.length; i++) {
                        th[i].index = i;
                        th[i].addEventListener('click', function () {
                            for (var j = 0; j < th.length; j++) {
                                th[j].classList.remove('on');
                                td[j].classList.remove('on');
                            }
                            this.classList.add('on');
                            td[this.index].classList.add('on');

                        });
                    }
                }

                tab($hd, $bd);

                //存储提货人姓名和手机号
                $('.picking-store-name').on('blur', function () {
                    sessionStorage.setItem("picking-store-name", $(this).val());
                })
                $('.picking-store-phone').on('blur', function () {
                    sessionStorage.setItem("picking-store-phone", $(this).val());
                })
                if (sessionStorage.getItem("picking-store-name")) {
                    $('.picking-store-name').val(sessionStorage.getItem("picking-store-name"));
                }
                if (sessionStorage.getItem("picking-store-phone")) {
                    $('.picking-store-phone').val(sessionStorage.getItem("picking-store-phone"));
                }
                if ($('.picking-store-address').html() != '请选择提货门店') {
                    // console.log($('.picking-store-address').html());
                    $('.picking-store-address').addClass('deep333');
                }
            }

            //新增--收货地址
            if ($newbox) { //如果新增收货地址存在
                $newbox.addEventListener('click', function () {
                    new DialogNewAddress({
                        DialogNewAddress: '新增收货地址'  //一般不需要传
                    });
                });
            }
            //编辑--收货地址
            if ($editbox) { //如果新增收货地址存在
                $editbox.addEventListener('click', function () {
                    new DialogAddressEditor({
                        headerTxt: '编辑收货地址',
                        chooseAddress: function (result) {
                            //这里返回的是选择的地址json字段
                            // console.log(result);
                        }
                    });
                });
            }

            //渲染商品
            if (pageOrderConfirm.goods.length <= 1) {  //单个
                require.async('js/modules/m-shopping.js', function (MShopping) {

                    var isShowMark = false;
                    var obj = pageOrderConfirm.goods[0];
                    // console.log(obj);
                    if ($('.order-submit-btn').hasClass('seckill')) {     //秒杀标签
                        obj.markInfo = ['秒杀'];
                        isShowMark = true;
                    }
                    obj.aHref = `product-${obj.goods_id}.html`;
                    var mShopping = new MShopping({
                        configData: {
                            isShowImgSrc: true,
                            isShowMark: isShowMark
                        },
                        ajaxData: obj
                    });
                    mShopping.render(function (dom) {
                        $single && $single.appendChild(dom);
                    })
                });
            } else { //多个
                $more && $more.addEventListener('click', function () {
                    require.async('js/modules/dialog/dialog-order-good-more.js', function (DialogOrderGoodMore) {
                        scroll.noScroll();
                        new DialogOrderGoodMore({
                            data: pageOrderConfirm.goods,
                            cancelCallback:function(){
                                scroll.yesScroll();
                            }
                        });
                        require.async('js/common/plug/iscroll.js', function (IScroll) {
                            new IScroll('.g-dialog-order-goods-more', {mouseWheel: true, preventDefault: false});
                        });
                    });
                });
            }

            //积分开关
            var use_score_off = false;//是否使用了积分
            {
                var btn = doc.querySelector('.score-on-off');//是否开启了积分
                if (btn) {
                    var score = doc.querySelector('.shop-score-num').innerHTML;//使用的积分数量
                    var oMoney = doc.querySelector('.bottom-money');//实付款容器
                    var iMoney = oMoney.innerHTML.substring(1);//实付款
                    var useScoreOff = doc.querySelector('.use_score_off');//积分开关

                    btn.addEventListener('click', function () {
                        if (score == 0) {
                            return false;
                        }
                        if (this.classList.contains('on')) {
                            this.classList.remove('on');
                            oMoney.innerHTML = '￥' + iMoney;
                            use_score_off = false;
                            useScoreOff && useScoreOff.classList.remove('on');
                        } else {
                            this.classList.add('on');
                            oMoney.innerHTML = '￥' + (iMoney - score).toFixed(2);
                            use_score_off = true;
                            useScoreOff && useScoreOff.classList.add('on');
                        }
                    })
                }
            }

            //显示礼物价格
            var givingMessageOnOff = false;
            var btn = doc.querySelector('.giving-message-on-off');
            if (btn) {
                btn.addEventListener('click', function () {

                    if (this.classList.contains('on')) { //关

                        this.classList.remove('on');
                        givingMessageOnOff = false;
                        this.setAttribute('data-onoff', '0');
                    } else { //开
                        this.classList.add('on');
                        givingMessageOnOff = true;
                        this.setAttribute('data-onoff', '1');
                    }
                })
            }

            //选择--优惠劵
            $coupon && $coupon.addEventListener('click', function () {
                scroll.noScroll();
                var dialogUseCoupons = new DialogUseCoupons({
                    submitOrder: pageOrderConfirm.coupon.submitOrder,    //必填
                    renderCallback: function () {
                        require.async('js/common/plug/iscroll.js', function (IScroll) {
                            new IScroll('.g-dialog-use-coupons-list', {mouseWheel: true, preventDefault: false});
                        });
                    },
                    cancelCallback: function () {
                        scroll.yesScroll();
                    }
                });
            });
            //优惠劵--0张可用时置灰
            {
                if ($coupon) {
                    var shopCouponNum = $coupon.querySelector('.shoop-coupon-num').innerHTML;
                    if ((shopCouponNum * 1) == 0) {
                        $coupon.querySelector('strong').classList.add('on');
                    }
                }
            }

            //提交订单
            {
                var oBtn = doc.querySelector('.order-submit-btn');
                oBtn.addEventListener('click', () => {
                    var $storeNameEle = doc.querySelector('.picking-store-name');
                    var $storeIdEle = doc.querySelector('.picking-store-id');
                    var $storePhoneEle = doc.querySelector('.picking-store-phone');
                    var $storeAddressEle = doc.querySelector('.picking-store-address');

                    var $storeName = $storeNameEle && $storeNameEle.value.trim();
                    var $storeId = $storeIdEle && $storeIdEle.value.trim();
                    var $storeAddress = $storeAddressEle && $storeAddressEle.innerHTML;
                    var phone = doc.querySelector('.picking-store-phone');//手机输入框
                    var deliveryType = doc.querySelector('.delivery-type').value;
                    var $storePhone = $storePhoneEle && $storePhoneEle.value.trim();
                    var isClick = true;
                    if ($hd.length > 0) {
                        for (var i = 0; i < $hd.length; i++) {
                            if ($hd[i].classList.contains('on')) {
                                if ($hd[i].dataset.address == 'common') { //快递配送
                                    var adress = document.querySelector('.has-address');
                                    if (!adress) { //没有填写地址
                                        new DialogSecondary.dialogPrompt1({
                                            content: '请填写收货地址',
                                        });
                                    } else { //已填写
                                        orderSucc($storeName, $storePhone, $storeId);
                                    }
                                } else { //门店自提

                                    var isPhone = false;
                                    if ($storeName || $storePhone || $storeAddress) {
                                        if ($storeName == '' || $storePhone == '' || $storeAddress == '请选择提货门店') { //未填写自提信息
                                            new DialogSecondary.dialogPrompt1({
                                                content: '请填写提货信息！',
                                            });
                                            return false;
                                        }
                                    }
                                    //验证手机号
                                    var reg = /^1[3578]\d{9}$/; //11位手机号码
                                    if (reg.test($storePhone) == true) { //验证成功
                                        isPhone = true;
                                    } else { //验证失败
                                        isPhone = false;
                                    }
                                    if (!isPhone) {
                                        new DialogSecondary.dialogPrompt1({
                                            content: '请输入正确的手机号',
                                        });
                                        phone.select();
                                        return false;
                                    }

                                    orderSucc($storeName, $storePhone, $storeId); //已填写
                                }
                            }
                        }
                        ;
                    } else { //送礼
                        orderSucc($storeName, $storePhone, $storeId);
                    }

                    function orderSucc(storeName, storePhone, storeId) {
                        const oData = doc.querySelector('#shoppingData');
                        let data = JSON.parse(oData.innerHTML);//全部信息
                        const message = doc.querySelector('.message-input');
                        var showPrice = doc.querySelector('.giving-message-on-off');
                        var groupActIdEle = doc.querySelector('.group-act-id');
                        var groupTeamIdEle = doc.querySelector('.group-team-id');
                        var groupActId = groupActIdEle && groupActIdEle.value;
                        var groupTeamId = groupTeamIdEle && groupTeamIdEle.value;
                        if (showPrice) {
                            var showPriceDataOnOff = showPrice.getAttribute('data-onoff');
                        }

                        if (message) {//普通订单
                            data.consignee.memo = message.value;//买家想说的话
                        }
                        const messagaGifts = doc.querySelector('.giving-message-input input');
                        if (messagaGifts) {//送礼订单
                            data.consignee.memo = messagaGifts.value;//买家想说的话
                        }

                        data.payment.id = doc.querySelector('#payment').value;//支付方式
                        data.order_source = doc.querySelector('#order_source').value;//订单来源
                        data.act_id = doc.querySelector('#act_id').value;//活动id
                        data.use_score_off = use_score_off;//是否开启了积分
                        data.delivery_type = deliveryType;//开启门店自提
                        data.store_name = storeName;//自提-姓名
                        data.store_phone = storePhone;//自提-手机号
                        data.store_id = storeId;//自提-门店id
                        data.show_price = showPriceDataOnOff;//礼物价格开关
                        data.group_act_id = groupActId;//拼团活动ID
                        data.team_id = groupTeamId;//拼团teamID
                        if (isClick) {
                            oBtn.innerHTML = '下单中...';
                            isClick = false;

                            if (oBtn.classList.contains('normal')) {//普通订单
                                $.ajax({
                                    url: '?ctl=orders&act=create&NoCheckForbiddenWord=1',
                                    type: 'post',
                                    data: data,
                                    dataType: 'json',
                                    success: function (res) {
                                        if (res.res == 'succ') {//下单成功
                                            var order_id = res.info.order_id;
                                            window.location.href = '?ctl=orders&act=payMethod&p[0]=' + order_id;
                                        } else {//下单失败
                                            new DialogSecondary.dialogPrompt1({
                                                content: res.msg
                                            });
                                            isClick = true;
                                            oBtn.innerHTML = '确认下单';
                                        }
                                    }
                                })
                            } else {
                                if (oBtn.classList.contains('seckill')) {//秒杀订单
                                    $.ajax({
                                        url: 'index.php?ctl=orders&act=create&seckill=1',
                                        type: 'post',
                                        timeout: 10000,
                                        data: data,
                                        dataType: 'json',
                                        success: function (data) {
                                            var goodsUrl = 'product-' + data.info.goods_id + '.html';
                                            if (data.res == 'succ') {
                                                var ajaxTrue = true, ajaxNum = 0, ajaxTime = 3000;
                                                let ajaxFn = () => {
                                                    $.ajax({
                                                        url: 'index.php?ctl=orders&act=seckill_confirm_order&taskId=' + data.info.order_id,
                                                        type: 'post',
                                                        dataType: 'json',
                                                        success: function (data) {
                                                            if (data.status == 'success') {
                                                                window.location.href = '?ctl=orders&act=payMethod&p[0]=' + data.order_id;
                                                            } else {
                                                                if (ajaxTrue && (data.status == 'waiting')) {
                                                                    setTimeout(function () {
                                                                        ajaxNum++;
                                                                        if (ajaxNum == 5) {
                                                                            ajaxTrue = false;
                                                                            isClick = true;
                                                                            oBtn.innerHTML = '确认下单';
                                                                        }
                                                                        ajaxFn();
                                                                    }, ajaxTime);
                                                                } else {
                                                                    window.location.href = '?ctl=orders&act=seckill_fail&p[0]=' + data.msg + '&redirect_url=' + encodeURIComponent(goodsUrl);
                                                                }
                                                            }
                                                        }
                                                    })
                                                };
                                                ajaxFn();
                                            } else {
                                                window.location.href = '?ctl=orders&act=seckill_fail&p[0]=none&redirect_url=' + encodeURIComponent(goodsUrl);
                                            }
                                        }
                                    });
                                }
                                if (oBtn.classList.contains('group')) {//拼团订单
                                    $.ajax({
                                        url: '?ctl=orders&act=create&NoCheckForbiddenWord=1&group=pingtuan',
                                        type: 'post',
                                        timeout: 10000,
                                        data: data,
                                        dataType: 'json',
                                        success: function (data) {
                                            if (data.res == 'succ') {
                                                window.location.href = 'index.php?ctl=orders&act=group_loading&p[0]=' + data.info.order_id;
                                            } else {
                                                alert(data.msg);
                                            }
                                        }
                                    });
                                }
                            }
                        }
                    }
                })
            }
        }
    }
});