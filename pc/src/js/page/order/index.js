define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var Export = require('../../module/export.js');
    var Laydate = require('../../plugin/laydate/laydate.js');
    var OrderListDialog = require('../../module/dialog/order-list.js');

    var $pageOrderIndex = $('.page-order-index');
    var $orderListWrap = $pageOrderIndex.find('.order-list-wrap');
    var $orderListSeniorSearch = $pageOrderIndex.find('.order-list-senior-search');
    var orderTableData = [];
    var ajaxModel = pageOrderIndex.model;
    var searchData = {
        create_b_date:(base.utils.getUrlObj().create_b_date || ''),       //下单时间(开始)
        create_e_date:(base.utils.getUrlObj().create_e_date || ''),       //下单时间(结束)
        pay_b_date:'',          //付款时间(开始)
        pay_e_date:'',          //付款时间(结束)
        fuzzy_order_id:'',      //订单号
        order_source:'',        //订单类型
        ship_name:'',           //收货人
        ship_mobile:'',         //收货人手机
        member_name:''          //用户名
    };
    if(searchData.create_b_date){
        $orderListSeniorSearch.find('input[name=create_b_date]').val(searchData.create_b_date);
    }
    if(searchData.create_e_date){
        $orderListSeniorSearch.find('input[name=create_e_date]').val(searchData.create_e_date);
    }

    Laydate({
        elem: '#startTime',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });
    Laydate({
        elem: '#endTime',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });
    Laydate({
        elem: '#startTime1',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });
    Laydate({
        elem: '#endTime1',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });

    // base.bus.setSidebar3Num({model:ajaxModel});

    //创建表格列表
    var orderTable = new Table({
        parent:$orderListWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                { text:'订单号', width:'140px' },
                { text:'下单时间', width:'140px' },
                { text:'订单总额' },
                { text:'收货人' },
                { text:'付款状态' },
                { text:'发货状态'},
                { text:'渠道来源'},
                { text:'订单来源'},
                { text:'操作', width:'170px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageOrderIndex.view
            },
            model: ajaxModel
        },
        renderItemFn: function(data){
            var arr = [];
            orderTableData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var orderId = item.order_id || '';
                var unallowDeliveryWords = '亲，该笔订单为送礼订单，请直接对子订单进行发货!';

                var operation = '';
                var buttonStatus = '';

                var unallowDelivery = 0;

                if(item._order_source == 'gifts' && !item.dealer_order_id ){
                    unallowDelivery = 1;
                }

                if(item.delivery_type == 'store'){
                    unallowDelivery = 1;
                    unallowDeliveryWords = '此订单为自提订单，不支持物流发货。请等待用户到店完成自提!';
                }

                if(item.refund_status == 1){
                    unallowDelivery = 1;
                    unallowDeliveryWords = '此订单有退款申请!';
                }

                if(pageOrderIndex.bindShop){
                    buttonStatus = ' huise ';
                }

                if( item.status == 'active' || item.status =='pending' ){
                    switch(pageOrderIndex.view){
                        case 1:
                            operation += '<a class="ml20 js-order-editor-btn ' + buttonStatus + '" data-id="' + orderId + '" href="?ctl=order/order&act=showEdit&p[0]=' + orderId + '">编辑</a>';
                            operation += '<a class="ml20 js-order-cancel-btn ' + buttonStatus + '" data-id="' + orderId + '" href="javascript:;">取消订单</a>';
                            //operation += '<a onclick="if(confirm("作废后该订单何将不允许再做任何操作，确认要执行吗？"))"" class="ml20" href="javascript:;" data-buttonStatus="' + buttonStatus + '">取消订单</a>';
                            break;
                        case 2:
                            if(item._pay_status == 4){ buttonStatus = ' huise '; }
                            operation += '<a class="ml20 js-order-send-goods ' + buttonStatus + '" data-id="' + orderId + '" data-text="' + unallowDeliveryWords + '" data-delivery="' + unallowDelivery + '" href="javascript:;">发货</a>';
                            break;
                        default:
                            if(item._pay_status == 0){
                                operation += '<a class="ml20 js-order-editor-btn ' + buttonStatus + '" data-id="' + orderId + '" href="?ctl=order/order&act=showEdit&p[0]=' + orderId + '">编辑</a>';
                                operation += '<a class="ml20 js-order-cancel-btn ' + buttonStatus + '" data-id="' + orderId + '" href="javascript:;">取消订单</a>';
                            }else if( item._ship_status == 0){
                                if(item._pay_status == 4){ buttonStatus = ' huise '; }
                                if(item._pay_status == 1){
                                    operation += '<a class="ml20 js-order-send-goods ' + buttonStatus + '" data-id="' + orderId + '" data-text="' + unallowDeliveryWords + '" data-delivery="' + unallowDelivery + '" href="javascript:;">发货</a>';
                                }
                            }
                    }
                }
                operation += '<a data-id="' +　orderId　+　'" class="ml20 js-btn-order-preview" href="javascript:;">查看</a>';

                arr1.push(item.order_id || '');
                arr1.push(item.createtime || '');
                arr1.push(Number(item.total_amount || 0).toFixed(2));
                arr1.push(item.ship_name || '');
                arr1.push(item.pay_status);
                arr1.push(item.ship_status || '未发货');
                arr1.push(item.market_source || '');
                arr1.push(item.order_source || '');
                arr1.push(operation.replace('ml20', ''));
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $orderListSeniorSearch.on('click', '.js-btn-search-order', function(){
        getSearchData();
        orderTable.ajax({ select:searchData });
    });

    //点击发货
    $orderListWrap.on('click', '.js-order-send-goods', function(){
        if($(this).hasClass('huise')){
            return false;
        }

        var delivery = $(this).data('delivery');
        if(delivery == 1){
            new base.promptDialog({str:$(this).data('text'), time:2000});
            return false;
        }

        var orderId = $(this).data('id');
        base.ajax({
            url:('openapi.php?act=ship_info&orderid=' + orderId),
            type:'post',
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    //userTable.ajax({refresh: true});
                    sendGoodsDialog(data.result || {});
                } else {
                    new base.promptDialog({str:(data.msg || '发货失败'), time:2000});
                }
            }
        })
    });

    //编辑
    $orderListWrap.on('click', '.js-order-editor-btn', function(){
        if($(this).hasClass('huise')){
            return false;
        }
    });

    //查看
    $orderListWrap.on('click',  '.js-btn-order-preview', function(){
        var id = $(this).data('id');
        OrderListDialog(id);
    });

    //取消订单
    $orderListWrap.on('click', '.js-order-cancel-btn', function(){
        if($(this).hasClass('huise')){
            return false;
        }
        var id = $(this).data('id') || '';
        if(!id){ return false; }
        new base.Dialog({
            content:'取消后该订单何将不允许再做任何操作，确认要执行吗？',
            okCallback: function(){
                base.ajax({
                    url:'openapi.php?act=order_cancle',
                    type:'post',
                    data: { order_id:id },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '取消订单成功'), time:2000});
                            orderTable.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '取消订单失败'), time:2000});
                        }
                    }
                })
            }
        })
    });

    //导出
    var popover = new base.Popover({
        obj: $pageOrderIndex.find('.js-order-export'),
        parent:$pageOrderIndex,
        content: '<div class="export-options ui-select-custom"><p class="ui-select-custom-item" data-value="csv">csv-逗号分隔的文本文件...</p><p class="ui-select-custom-item" data-value="xls">xls-Excel文件...</p></div>',
        arrowPos: 'up',
        placement:1
    });
    $(popover).on('createEnd', function(){
        popover.$popover.on('click', '.export-options .ui-select-custom-item', function(){
            var type = $(this).data('value') || '';
            popover.remove();
            Export({
                filter: {
                    checkboxData: orderTable.UiTable.checkboxData,
                    allData:orderTableData,
                    name:'order_id'
                },
                form: { action : '?ctl=order/order&act=export', data:{ view: pageOrderIndex.view, select:searchData, export_type:type} }
            });
        })
    });

    function sendGoodsDialog(data){
        if(!data){ return false; }
        var htmls = [];
        var optionsHtmls = '';

        var orderData = data.order || {};
        var corplistData = data.corplist || [];
        var orderId = orderData.order_id || '';

        $.each(corplistData, function(i, item){
            optionsHtmls += '<option value="' + ( item.corp_id || '') + '">' + ( item.name || '') + '</option>';
        });

        htmls.push('<div class="page-order-send-goods w400 p30 f12">');
        htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">订单号：</p>' + orderId + '[' + (orderData.ship_status === '0' ? '发货' : '未发货') + ']</span></div>');
        htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">收货人：</p><span>' + ( orderData.ship_name || '' ) + '</span></div>');
        htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr"><i class="pr5 ui-color3">*</i>物流公司：</p><select name="corpId" class="ui-select" style="width: 234px;">' + optionsHtmls + '</select></div>');
        htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr"><i class="pr5 ui-color3">*</i>物流单号：</p><input style="width: 224px;" name="corpText" class="ui-input" type="text" /></div>');
        htmls.push('</div>');

        var dialog = new base.Dialog({
            content: htmls.join(''),
            btnOkTxt:'发货',
            headerTxt: ('订单[' + orderId + ']发货操作'),
            customContent: true,
            okCallback: function(){
                dialog.saveThrough = false;
                var corpId = $('.page-order-send-goods').find('select[name=corpId]').val() || '';
                var corpText = $('.page-order-send-goods').find('input[name=corpText]').val() || '';

                if(corpText == ''){
                    new base.promptDialog({str:'物流单号不能为空', time:2000});
                    return false;
                }
                postSendGoods({
                    order_id:orderId,
                    logi_id:corpId,
                    logi_no:corpText
                }, function(){
                    dialog.remove();
                    orderTable.ajax({refresh: true});
                });
            }
        });

    }

    function postSendGoods(postData, callback){
        base.ajax({
            url:'openapi.php?act=toDelivery',
            type:'post',
            data: postData,
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '发货成功'), time:2000});
                    if(callback) callback();
                } else {
                    new base.promptDialog({str:(data.msg || '发货失败'), time:2000});
                }
            }
        })
    }

    //获取搜索字段
    function getSearchData(){
        searchData.create_b_date = $orderListSeniorSearch.find('input[name=create_b_date]').val();
        searchData.create_e_date = $orderListSeniorSearch.find('input[name=create_e_date]').val();
        searchData.pay_b_date = $orderListSeniorSearch.find('input[name=pay_b_date]').val();
        searchData.pay_e_date = $orderListSeniorSearch.find('input[name=pay_e_date]').val();
        searchData.fuzzy_order_id = $orderListSeniorSearch.find('input[name=fuzzy_order_id]').val();
        searchData.order_source = $orderListSeniorSearch.find('select[name=order_source]').val();
        searchData.ship_name = $orderListSeniorSearch.find('input[name=ship_name]').val();
        searchData.ship_mobile = $orderListSeniorSearch.find('input[name=ship_mobile]').val();
        searchData.member_name = $orderListSeniorSearch.find('input[name=member_name]').val();
    };

    module.exports = {
        init: function(){}
    }
});

