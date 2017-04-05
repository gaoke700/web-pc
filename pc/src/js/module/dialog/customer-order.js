/**
 * Created by tiangaoke on 2017/2/22.
 */
define(function (require, exports, module) {
    var TabList = require('../ui-table.js');
    var Tabs = require('./tabs');
    var GoodMessage = function (refondId) {
        refondId = refondId || '';
        new Tabs([{
            tabName: '退款信息',
            content0: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=getAftersalesDetail',
                    type: 'post',
                    data: {
                        aftersales_id:refondId
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (res.res == 'succ') {
                            var v = res.result;

                            var doms0 = `<div class="refond-details">
                                <div><span>订单编号： <i>${v.order_id||''}</i></span></div>
                                <div>
                                    <span class="left-span">退款编号： <i>${v.id||''}</i></span>
                                    <span class="right-span">退款账号： <i>${v.account||''}</i></span>
                                </div>
                                <div>
                                    <span class="left-span">退款类型： <i>${v.typeName||''}</i></span>
                                    <span class="right-span">退款金额： ￥<i>${v.amountFormat||''}</i></span>
                                </div>
                                <div>
                                    <span class="left-span">退款原因： <i>${v.reason||''}</i></span>
                                    <span class="right-span">退款说明： <i>${v.explanation||''}</i></span>
                                </div>
                            </div>`;
                            $('.content0').append(doms0);


                            if(v.orderItem){    //退款商品

                                var e = v.orderItem;
                                $('.content0').append(`<div class="sub-order-message">
                                    <div class="titles"><span>退款商品</span></div>
                                    <div class="refond-goods-list"></div>
                                </div>`);

                                var arr = [];
                                var arr2=[];
                                arr2.push(e.name||'');
                                arr2.push(Math.floor(e.price*100)/100 ||'');
                                arr2.push(e.nums||'');
                                arr2.push(Math.floor(e.amount*100)/100||'');
                                arr.push(arr2);

                                new TabList({
                                    parent:$('.refond-goods-list'),
                                    bodyHtml: arr,
                                    headConfig:[
                                        { text:'商品名称' },
                                        { width:'100px', text:'商品单价' },
                                        { width:'100px', text:'商品数量' },
                                        { width:'200px', text:'商品总额' }
                                    ]
                                });


                            }


                        }
                    }
                })
            }
        }, {
            tabName: '订单详情',
            content1: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=getAftersalesDetailOrder',
                    type: 'post',
                    data: {
                        aftersales_id: refondId
                    },
                    dataType: 'json',
                    success: function (res) {
                        var v = res.result;
                        var doms1 = `<div class="basic-details"><div class="basic-message">
                                    <div>订单编号：<span>${v.order.order_id||''}</span></div>
                                    <div>商品总额：￥<span>${v.order.total_amount||''}</span></div>
                                    <div class="symbol">
                                        <i>+</i>
                                        <div>运费：￥<span>${v.order.cost_freight||''}</span></div>
                                    </div>
                                    <div class="symbol">
                                        <i>-</i>
                                        <div>使用优惠券面值：￥<span>${v.coupon_price||''}</span></div>
                                        <div>满减/满送优惠金额：￥<span>${v.ordersMjrules.minus_mount || '0'}</span></div>
                                        <div>使用积分：<span>${v.score||''}</span> 抵扣 ￥ <span>${v.score||''}</span></div>
                                        <div>后台改价金额：￥<span>${v.order.pmt_amount||'0'}</span></div>
                                    </div>
                                    <div class="symbol">
                                        <i>=</i>
                                        <div>订单总额：￥<span>${v.order.total_amount||''}</span></div>
                                        <div>实付金额：￥<span>${v.order.payed||''}</span></div>
                                    </div>
                                </div>`;
                        $('.content1').append(doms1);

                        if(v.goodsItems&& v.goodsItems.length>0){       //商品信息
                            var goodsMessages = `<div class="goods-message">
                                    <div class="titles"><span>商品信息</span></div>
                                    <div class="goods-message-list"></div>
                                </div>`;
                            $('.basic-details').append(goodsMessages);

                            var arr = [];
                            v.goodsItems.forEach(function (e,i) {
                                arr[i]=[];
                                arr[i].push(e.name || '');
                                arr[i].push('<p class="p5" style="line-height: 20px; word-break: break-all;">'+(e.bn || "")+'</p>');
                                arr[i].push(e.price||'');
                                arr[i].push(e.nums||'');
                                arr[i].push(e.amount||'');

                                var status='';
                                switch(e.refund_status){
                                    case 0:
                                        status = '正常';
                                        break;
                                    case 1:
                                        status = '待审核';
                                        break;
                                    case 2:
                                        status = '退款中';
                                        break;
                                    case 3:
                                        status = '退款完成';
                                        break;
                                }

                                arr[i].push(status);

                            });
                            new TabList({
                                parent:$('.basic-details .goods-message-list'),
                                bodyHtml: arr,
                                headConfig:[
                                    { text:'商品名称' },
                                    { width:'130px', text:'商品货号' },
                                    { width:'100px', text:'商品单价' },
                                    { width:'100px', text:'商品数量' },
                                    { width:'100px', text:'商品总额' },
                                    { width:'100px', text:'退货状态' }
                                ]
                            });
                        }

                        var htms = `<div class="consignee-message">
                                    <div class="titles"><span>收货人信息</span></div>
                                    <div class="goods-message-content">
                                        <div class="content-left">
                                            <div>姓名：<span>${v.order.ship_name||''}</span></div>
                                            <div>电话：<span>${v.order.ship_mobile||''}</span></div>
                                            <div>地址：<span>${v.order.ship_addr||''}</span></div>
                                        </div>
                                        <div class="content-right">
                                            <div>地区：<span>${v.order.ship_area||''}</span></div>
                                            <div>邮编：<span>${v.order.ship_zip||''}</span></div>
                                            <div>卖家备注：<span>${v.order.memo||''}</span></div>
                                        </div>
                                    </div>
                                </div></div>`.trim();

                        $('.basic-details').append(htms);

                    }
                })
            }
        }, {
            tabName: '协商记录',
            content2: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=getAftersalesDetailLog',
                    type: 'post',
                    data: {
                        aftersales_id: refondId
                    },
                    dataType: 'json',
                    success: function (res) {
                        var v = res.result;
                        if(v.refundLog && v.refundLog.length<=0){
                            $('.content2').append(`<div class="tips">暂无记录</div>`);
                            return false;
                        }else if(v.refundLog && v.refundLog.length>0){
                            $('.content2').html('<div class="records"></div>');
                            v.refundLog.forEach(function (e,i) {

                                if (e.op_type == 'member') {
                                    var doms = [];
                                    doms.push('<div class="record">');
                                        doms.push('<div class="titles"><span>买家</span></div>');
                                        doms.push('<div class="details">');
                                            doms.push('<div class="details-left">');
                                                doms.push(`<div>${e.title || ''}</div>`);
                                                if((e.status != 6) && (e.status != 3) && (e.status != 101) && (e.status != 102)){

                                                    doms.push(`<div>退款类型：${ (e.type=='refund')? '退款':'退款退货' }</div>`);
                                                    if(e.snapshot) {
                                                        doms.push('<div>');
                                                            doms.push('<div class="left">退款原因：</div>');
                                                            doms.push('<div class="right">');
                                                                doms.push(`<div> ${e.snapshot.reason || ''}</div>`);
                                                                if(e.snapshot.images && e.snapshot.images.length>0){
                                                                    doms.push('<div>');
                                                                    e.snapshot.images.forEach(function(e,i){
                                                                        doms.push(`<img class="reason-img" src="${ e.img }"/>`);
                                                                    });

                                                                    doms.push('</div>');
                                                                }
                                                            doms.push('</div>');
                                                        doms.push('</div>');

                                                        doms.push(`<div>退款金额：￥${e.snapshot.amount || ''}</div>`);

                                                        doms.push('<div>');
                                                            doms.push('<div class="left">退款说明：</div>');
                                                            doms.push(`<div class="right">${e.snapshot.description || ''}</div>`);
                                                        doms.push('</div>');
                                                    }

                                                }
                                                if ((e.status == 101)||(e.status == 102)) {

                                                    if(e.snapshot) {
                                                        doms.push(`<div>配送物流：${ e.snapshot.logi_name || '' }</div>`);
                                                        doms.push(`<div>物流单号：${ e.snapshot.logi_no || '' }</div>`);
                                                    }
                                                }

                                            doms.push('</div>');
                                            doms.push(`<div>${e.createTimeFormat}</div>`);
                                        doms.push('</div>');
                                    doms.push('</div>');

                                    $('.records').append(doms.join(''));

                                } else{

                                    var div = '';
                                    if(e.showExplanation == 'true'){
                                        div=`<div>
                                            <div class="left">拒绝理由：</div>
                                            <div class="right">${e.explanation || ''}</div>
                                        </div>`;
                                    }
                                    var html = `<div class="record">
                                        <div class="titles"><span>商家</span></div>
                                        <div class="details">
                                            <div class="details-left">
                                                <div>${e.title || ''}</div>
                                                ${div}
                                            </div>
                                            <div>${e.createTimeFormat}</div>
                                        </div>
                                    </div>`.trim();
                                    $('.records').append(html);
                                }
                                //if (e.snapshot)


                            })
                        }


                    }
                })
            }
        }]);
    };

    module.exports = GoodMessage;
});
