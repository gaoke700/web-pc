/**
 * Created by tiangaoke on 2017/2/22.
 */
define(function (require, exports, module) {
    var TabList = require('../ui-table.js');
    var Tabs = require('./tabs');
    var GoodMessage = function (orderId) {
        orderId = orderId || '';
        new Tabs([{
            tabName: '基本信息',
            content0: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=order_detail',
                    type: 'post',
                    data: { order_id: orderId },
                    dataType: 'json',
                    success: function (res) {
                        if (res.res == 'succ') {
                            var v = res.result;

                            var doms0 = `<div class="basic-details"><div class="basic-message">
                                    <div>订单编号：<span>${v.order.order_id}</span></div>
                                    <div>商品总额：￥<span>${v.order.cost_item}</span></div>
                                    <div class="symbol">
                                        <i>+</i>
                                        <div>运费：￥<span>${v.order.cost_freight}</span></div>
                                    </div>
                                    <div class="symbol">
                                        <i>-</i>
                                        <div>使用优惠券面值：￥<span>${v.coupon_price}</span></div>
                                        <div>满减/满送优惠金额：￥<span>${v.ordersMjrules.minus_mount || '0'}</span></div>
                                        <div>使用积分：<span>${v.score}</span> 抵扣 ￥ <span>${v.score2cash}</span></div>
                                        <div>后台改价金额：￥<span>${v.order.pmt_amount||'0'}</span></div>
                                    </div>
                                    <div class="symbol">
                                        <i>=</i>
                                        <div>订单总额：￥<span>${v.order.total_amount}</span></div>
                                        <div>实付金额：￥<span>${v.order.payed}</span></div>
                                    </div>
                                </div>`;
                            $('.content0').append(doms0);


                            if(v.subOrders&& v.subOrders.length>0){    //子订单
                                var subItems = [];
                                v.subOrders.forEach(function(e,i){
                                    subItems[i] = [];
                                    subItems[i].push(e.order_id);
                                    subItems[i].push(e.ship_name);
                                    subItems[i].push(e.ship_addr);
                                    subItems[i].push(e.ship_status);
                                    subItems[i].push(e.createtime);
                                })

                                var subOrderMessages = `<div class="sub-order-message">
                                    <div class="titles"><span>送礼订单信息</span></div>
                                    <div class="sub-order-message-list"></div>
                                </div>`;

                                $('.basic-details').append(subOrderMessages);

                                new TabList({
                                    parent:$('.sub-order-message-list'),
                                    bodyHtml: subItems,
                                    headConfig:[
                                        { width:'100px',text:'子订单编号' },
                                        { text:'收货人' },
                                        { width:'100px', text:'收货信息' },
                                        { width:'100px', text:'订单状态' },
                                        { width:'200px', text:'领取时间' }
                                    ]
                                });


                            }



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
                                    arr[i].push(e.statusName||'');

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

                            var doms1 = `<div class="consignee-message">
                                            <div class="titles"><span>收货人信息</span></div>
                                            <div class="goods-message-content">
                                                <div class="content-left">
                                                    <div>姓名：<span>${v.order.ship_name || ''}</span></div>
                                                    <div>电话：<span>${v.order.ship_mobile || ''}</span></div>
                                                    <div>地址：<span>${v.order.ship_addr || ''}</span></div>
                                                </div>
                                                <div class="content-right">
                                                    <div>地区：<span>${v.order.ship_area || ''}</span></div>
                                                    <div>邮编：<span>${v.order.ship_zip || ''}</span></div>
                                                    <div>卖家备注：<span>${v.order.memo || ''}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="consignee-message">
                                            <div class="titles"><span>推广员店铺信息</span></div>
                                            <div class="goods-message-content">
                                                <div>店铺名：<span>${v.order.d_store_name || ''}</span></div>
                                            </div>
                                        </div>`.trim();

                            $('.basic-details').append(doms1);
                        }
                    }
                })
            }
        }, {
            tabName: '收退款记录',
            content1: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=order_bills',
                    type: 'post',
                    data: {
                        order_id: orderId
                    },
                    dataType: 'json',
                    success: function (res) {
                        var v = res.result;

                        if(v.incomeList.length<=0 && v.expensesList.length<=0){
                            $('.content1').append(`<div class="tips">暂无记录</div>`);
                            return false;
                        }
                        if(v.incomeList && v.incomeList.length>0){

                            $('.content1').append(`<div>
                                        <div class="titles"><span>收款单据列表</span></div>
                                        <div class="income-list"></div>
                                    </div>`);

                            var arr = [];
                            v.incomeList.forEach(function (e,i) {
                                var status='';
                                switch (e.status){
                                    case 'succ':
                                        status='支付成功';
                                        break;
                                    case 'failed':
                                        status='支付失败';
                                        break;
                                    case 'cancel':
                                        status='未支付';
                                        break;
                                    case 'error':
                                        status='参数异常';
                                        break;
                                    case 'failed':
                                        status='支付失败';
                                        break;
                                    case 'progress':
                                        status='处理中';
                                        break;
                                    case 'timeout':
                                        status='超时';
                                        break;
                                    case 'ready':
                                        status='准备中';
                                        break;

                                }

                                arr[i]=[];
                                arr[i].push(e.t_end);
                                arr[i].push(e.payment_id);
                                arr[i].push(e.money);
                                arr[i].push(e.paymethod);
                                arr[i].push(status);
                                arr[i].push(e.op_name||'顾客');
                                arr[i].push(e.memo||'');

                            });

                            new TabList({
                                parent:$('.income-list'),
                                bodyHtml: arr,
                                headConfig:[
                                    { width:'100px', text:'单据日期' },
                                    { width:'130px', text:'流水号' },
                                    { width:'100px', text:'支付金额' },
                                    { width:'100px', text:'支付方式' },
                                    { width:'100px', text:'状态' },
                                    { width:'60px', text:'操作人' },
                                    { text:'备注' }
                                ]
                            });
                        }

                        if(v.expensesList && v.expensesList.length>0){

                            $('.content1').append(`<div>
                                        <div class="titles"><span>退款单据列表</span></div>
                                        <div class="refund-list"></div>
                                    </div>`);

                            var arr = [];
                            v.expensesList.forEach(function (e,i) {
                                var status='';
                                if(e.status=='succ'){
                                    status='支付成功';
                                }else if(e.status=='failed'){
                                    status='支付失败';
                                }else if(e.status=='cancel'){
                                    status='未支付';
                                }else if(e.status=='error'){
                                    status='参数异常';
                                }else if(e.status=='failed'){
                                    status='支付失败';
                                }else if(e.status=='progress'){
                                    status='处理中';
                                }else if(e.status=='timeout'){
                                    status='超时';
                                }else if(e.status=='ready'){
                                    status='准备中';
                                }

                                arr[i]=[];
                                arr[i].push(e.t_end);
                                arr[i].push(e.payment_id);
                                arr[i].push(e.money);
                                arr[i].push(e.paymethod);
                                arr[i].push(status);
                                arr[i].push(e.op_name||'顾客');
                                arr[i].push(e.memo||'');

                            });

                            new TabList({
                                parent:$('.refund-list'),
                                bodyHtml: arr,
                                headConfig:[
                                    { width:'100px', text:'单据日期' },
                                    { width:'130px', text:'流水号' },
                                    { width:'100px', text:'支付金额' },
                                    { width:'100px', text:'支付方式' },
                                    { width:'100px', text:'状态' },
                                    { width:'60px', text:'操作人' },
                                    { text:'备注' }
                                ]
                            });

                        }

                    }
                })
            }
        }, {
            tabName: '收退货记录',
            content2: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=order_delivery',
                    type: 'post',
                    data: {
                        order_id: orderId
                    },
                    dataType: 'json',
                    success: function (res) {
                        var v = res.result;
                        if(v.consignList.length<=0 && v.reshipList.length<=0){
                            $('.content2').append(`<div class="tips">暂无记录</div>`);
                            return false;
                        }
                        if(v.consignList && v.consignList.length>0){

                            $('.content2').append(`<div>
                                        <div class="titles"><span>收货单据列表</span></div>
                                        <div class="consign-list"></div>
                                    </div>`);

                            var arr = [];
                            v.consignList.forEach(function (e,i) {

                                arr[i]=[];
                                arr[i].push(e.t_begin);
                                arr[i].push(e.delivery_id);
                                arr[i].push(e.typeName);
                                arr[i].push(e.logi_name);
                                arr[i].push(e.logi_no);
                                arr[i].push(e.statusName);
                                arr[i].push(e.memo);

                            });

                            new TabList({
                                parent:$('.consign-list'),
                                bodyHtml: arr,
                                headConfig:[
                                    { width:'100px', text:'单据日期' },
                                    { width:'150px', text:'流水号' },
                                    { width:'100px', text:'类型' },
                                    { width:'100px', text:'物流公司' },
                                    { width:'100px', text:'物流单号' },
                                    { width:'50px', text:'状态' },
                                    { text:'备注' }
                                ]
                            });

                        }

                        if(v.reshipList && v.reshipList.length>0){

                            $('.content2').append(`<div>
                                        <div class="titles"><span>退款单据列表</span></div>
                                        <div class="reship-list"></div>
                                    </div>`);

                            var arr = [];
                            v.reshipList.forEach(function (e,i) {
                                arr[i].push(e.t_begin);
                                arr[i].push(e.delivery_id);
                                arr[i].push(e.typeName);
                                arr[i].push(e.logi_name);
                                arr[i].push(e.logi_no);
                                arr[i].push(e.statusName);
                                arr[i].push(e.memo);

                            });

                            new TabList({
                                parent:$('.reship-list'),
                                bodyHtml: arr,
                                headConfig:[
                                    { width:'100px', text:'单据日期' },
                                    { width:'150px', text:'流水号' },
                                    { width:'100px', text:'类型' },
                                    { width:'100px', text:'物流公司' },
                                    { width:'100px', text:'物流单号' },
                                    { width:'50px', text:'状态' },
                                    { text:'备注' }
                                ]
                            });
                        }

                    }
                })
            }
        }, {
            tabName: '订单备注',
            content3: '',
            tabClickFn: function () {
                var _this = this;
                $.ajax({
                    url: 'openapi.php?act=detailMark',
                    type: 'post',
                    data: {
                        order_id: orderId
                    },
                    dataType: 'json',
                    success: function (res) {

                        var v = res.result.mark_text;
                        var oldNotes = ``;
                        if(v.length && v.length>0){
                            var notes = ``;
                            v.forEach(function (e,i) {
                                notes += `<div>
                                    <div class="before">${e.add_time}</div>
                                    <div class="after">${e.content}</div>
                                </div>`;
                            });

                            oldNotes=`<div class="old-note">
                                <div class="titles"><span>备注历史</span></div>
                                <div class="old-note-content">${notes}</div>
                            </div>`;
                        }

                        var doms3 = `<div class="goods-note">
                        ${oldNotes}
                        <div class="new-note">
                            <div class="titles"><span>新增备注</span></div>
                            <div class="new-note-content">
                                <div>
                                    <div class="left">标记：</div>
                                    <div class="right radio-wrap">
                                        <label class="ui-radio"><input type="radio" name="radiox" value="b1" checked><i></i><span class="red iconss iconss-flag"></span></label>
                                        <label class="ui-radio"><input type="radio" name="radiox" value="b2" ><i></i><span class="green iconss iconss-flag"></span></label>
                                        <label class="ui-radio"><input type="radio" name="radiox" value="b3" ><i></i><span class="yellow iconss iconss-flag"></span></label>
                                        <label class="ui-radio"><input type="radio" name="radiox" value="b4" ><i></i><span class="orange iconss iconss-flag"></span></label>
                                        <label class="ui-radio"><input type="radio" name="radiox" value="b5" ><i></i><span class="purple iconss iconss-flag"></span></label>
                                        <label class="ui-radio"><input type="radio" name="radiox" value="b0" ><i></i><span class="blue iconss iconss-flag"></span></label>
                                    </div>
                                </div>
                                <div class="textarea-box">
                                    <div class="left">订单备注：</div>
                                    <div class="right textarea-wrap">
                                        <textarea class="ui-textarea" maxlength="120" placeholder="输入备注信息"></textarea>
                                        <div class="right-right"><span>0</span>/120</div>
                                    </div>
                                </div>
                            </div>
                            <div class="save">
                                <span class="ui-btn ui-btn-c-1">保存</span>
                            </div>
                        </div></div>`;


                        $('.content3').html(doms3);

                        $('.content3 .textarea-wrap textarea').on('input', function () {
                            $(this).siblings('.right-right').find('span').html($(this).val().length);
                        });

                        $('.content3 .save').on('click', function () {
                            var radioValue = $('.new-note input[checked]').val();
                            var textareaValue = $('.new-note textarea').val();
                            $.ajax({
                                url: 'openapi.php?act=order_saveMarkText',
                                type: 'post',
                                data: {
                                    mark_type: radioValue,
                                    mark_text: textareaValue,
                                    order_id: orderId
                                },
                                dataType:'json',
                                success:function(json){
                                    if(json.res=='succ'){
                                        _this.tabClickFn()
                                    }else{

                                        new base.promptDialog({
                                            str:'保存失败！'
                                        })
                                    }
                                }
                            });
                        });
                    }
                })
            }
        }, {
            tabName: '订单日志',
            content4: '',
            tabClickFn: function () {
                $.ajax({
                    url: 'openapi.php?act=order_logs',
                    type: 'post',
                    data: {
                        order_id: orderId
                    },
                    dataType: 'json',
                    success: function (res) {

                        var v = res.result;
                        if(v.logs && v.logs.data && v.logs.data.length<=0){
                            $('.content4').append(`<div class="tips">暂无记录</div>`);
                            return false;
                        }
                        if(v.logs && v.logs.data && v.logs.data.length>0){
                            $('.content4').append(`<div class="titles"><span>发货单据列表</span></div>
                                <div class="send-goods-list">
                                </div>`);

                            var arr = [];
                            v.logs.data.forEach(function(e,i){
                                arr[i]=[];
                                arr[i].push(i+1);
                                arr[i].push(e.acttime);
                                arr[i].push(e.op_name||'顾客');
                                arr[i].push(e.behavior);
                                arr[i].push(e.result=='success'?'成功':'失败');
                                arr[i].push(e.log_text||'');
                            });

                            new TabList({
                                parent:$('.send-goods-list'),
                                bodyHtml: arr,
                                headConfig:[
                                    { width:'100px',text:'序号' },
                                    { width:'130px', text:'时间' },
                                    { width:'100px', text:'操作人' },
                                    { width:'100px', text:'操作' },
                                    { width:'100px', text:'状态' },
                                    { text:'备注' }
                                ]
                            });

                        }
                    }
                })
            }
        }]);
    };

    module.exports = GoodMessage;
});
