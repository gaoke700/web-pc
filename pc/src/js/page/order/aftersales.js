define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var Export = require('../../module/export.js');
    var Laydate = require('../../plugin/laydate/laydate.js');
    var CustomerOrderDialog = require('../../module/dialog/customer-order.js');

    var $pageOrderAftersales = $('.page-order-aftersales');
    var $orderAftersalesWrap = $pageOrderAftersales.find('.order-aftersales-wrap');
    var $aftersalesSeniorSearch = $pageOrderAftersales.find('.aftersales-senior-search');
    var orderTableData = [];

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

    var searchData = {
        create_b_date:'',       //申请时间(开始)
        create_e_date:'',       //申请时间(结束)
        fuzzy_order_id:'',      //订单号
        id:'',                  //退款编号
        ship_name:''            //收货人
    };

    //创建表格列表
    var table = new Table({
        parent:$orderAftersalesWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                { text:'退款编号' },
                { text:'订单编号' },
                { text:'申请时间' },
                { text:'退款类型' },
                { text:'退款金额', width:'80px' },
                { text:'收款人手机' },
                { text:'退款状态', width:'90px' },
                { text:'操作', width:'300px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageOrderAftersales.view
            },
            model: 'trading/aftersales'
        },
        renderItemFn: function(data){
            var arr = [];
            orderTableData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.id || '';
                var actions = item.actions || [];
                var operation = '';

                $.each(actions, function(i, item){
                    operation += '<a data-id="' + id + '" data-status="' + String(item.toStatus || 0) + '" data-comstatus="' + String(item.comStatus || 0) + '" class="js-change-status ' + (i == (actions.length-1) ? '' : 'mr20') + '" href="javascript:;">' + (item.text || '') + '</a>'
                });
                operation += '<a data-id="' + id + '" class="ml20 js-btn-order-preview" href="javascript:;">查看</a>';

                arr1.push(id);
                arr1.push(item.order_id || '');
                arr1.push(item.create_time || '');
                arr1.push(item.type || '');
                arr1.push(Number(item.amount || 0).toFixed(2));
                arr1.push(item.phone || '');
                arr1.push(item.status || '');
                arr1.push(operation);
                arr.push(arr1);
            });
            return arr;
        }
    });

    //操作修改状态
    $orderAftersalesWrap.on('click', '.js-change-status', function(){
        var id = $(this).data('id') || '';
        var status = $(this).data('status') || '0';
        var comstatus = $(this).data('comstatus') || '0';

        var index = base.utils.arrayFindkey(orderTableData, 'id', id);
        if(index > -1 && id){
            changeStatus({
                id:id,
                status:status,
                comstatus:comstatus,
                data:orderTableData[index]
            });
        }
    });

    //导出
    var popover = new base.Popover({
        obj: $pageOrderAftersales.find('.js-order-export'),
        parent:$pageOrderAftersales,
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
                    checkboxData: table.UiTable.checkboxData,
                    allData:orderTableData,
                    name:'id'
                },
                form: { action : '?ctl=refund/aftersales&act=export', data:{ view: pageOrderAftersales.view, select:searchData, export_type:type} }
            });
        })
    });

    //查看
    $orderAftersalesWrap.on('click',  '.js-btn-order-preview', function(){
        var id = $(this).data('id')||'';
        CustomerOrderDialog(id);
    });

    //搜索
    $aftersalesSeniorSearch.on('click', '.js-btn-search-order', function(){
        getSearchData();
        table.ajax({ select:searchData });
    });

    //获取搜索字段
    function getSearchData(){
        searchData.create_b_date = $aftersalesSeniorSearch.find('input[name=create_b_date]').val();
        searchData.create_e_date = $aftersalesSeniorSearch.find('input[name=create_e_date]').val();
        searchData.fuzzy_order_id = $aftersalesSeniorSearch.find('input[name=fuzzy_order_id]').val();
        searchData.id = $aftersalesSeniorSearch.find('input[name=id]').val();
        searchData.ship_name = $aftersalesSeniorSearch.find('input[name=ship_name]').val();
    };

    function changeStatus(opts){
        var id = opts.id || '';
        var data = opts.data || {};
        var status = opts.status || '';
        var comstatus = opts.comstatus || '';
        if(!id || !status){
            return false;
        }

        //aftersales_id   : 退款ID [method:post]
        //toStatus        : 要变成的状态 [method:post]
        //explanation     : toStatus为拒绝状态时的拒绝理由 [method:post]
        //address         : 退货地址 [method:post]
        //refuse          : 商家拒绝是否收货(收货:received,未收货:unreceived) [method:post]
        var ajaxData = {
            aftersales_id: id,
            toStatus: status,
            explanation: '',
            address: '',
            refuse: ''
        };

        var txt2 = '<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">退款类型：</p><p>' + (data.type || '') + '</p></div><div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">退款金额：</p><p>' + Number(data.amount || 0).toFixed(2) + '</p></div>';
        var zhTxt = '<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">退款账户：</p><p>' + (data.account || '') + '</p></div>';
        var comstatusFn = {};

        //同意申请
        comstatusFn.xx1 = {
            txt:'同意申请',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">请您仔细查看退款申请，无误后再点击“同意申请”按钮</p>');
                htmls.push(txt2);
                htmls.push(zhTxt);
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">退款积分：</p><p>' + (data.score || '') + '</p></div>');
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //拒绝申请
        comstatusFn.xx2 = {
            txt:'拒绝申请',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">建议您先与买家协商后，再决定是否拒绝退款；<br />若您拒绝退款，买家可修改退款申请，并重新申请退款。</p>');
                htmls.push(txt2);
                htmls.push('<div class="ui-block"><p class="w80 pr10 tr">拒绝理由：</p>');
                htmls.push('<div class="ui-textarea-wrap"><textarea name="explanation" data-maxLen="100" class="ui-textarea w300 h100" placeholder="请输入详细拒绝理由"></textarea><p class="ui-textarea-wrap-text">0/100</p></div>');
                htmls.push('</div>');
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //拒绝申请
        comstatusFn.xx3 = {
            txt:'确认退款',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">请您务必先退款给客户，再点击”确认退款”按钮</p>');
                htmls.push(txt2);
                htmls.push(zhTxt);
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //同意退款
        comstatusFn.xx4 = {
            txt:'同意申请',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push(txt2);
                htmls.push('<div class="ui-block"><p class="w80 pr10 tr">退货地址：</p>');
                htmls.push('<div class="ui-textarea-wrap"><textarea name="address" data-maxLen="100" class="ui-textarea w300 h100" placeholder="请填写退货地址"></textarea><p class="ui-textarea-wrap-text">0/100</p></div>');
                htmls.push('</div>');
                htmls.push('<div class="ui-block ui-block-align-c pb10 pt5"><p class="w80 pr10 tr"></p><p class="ui-color2">地址格式：上海市徐汇区桂林路396号，张三，136****9827</p></div>');
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //拒绝申请
        comstatusFn.xx5 = {
            txt:'拒绝申请',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">建议您先与买家协商后，再决定是否拒绝退款；<br />若您拒绝退款，买家可修改退款申请，并重新申请退款。</p>');
                htmls.push(txt2);
                htmls.push('<div class="ui-block"><p class="w80 pr10 tr">拒绝理由：</p>');
                htmls.push('<div class="ui-textarea-wrap"><textarea name="explanation" data-maxLen="100" class="ui-textarea w300 h100" placeholder="请输入详细拒绝理由"></textarea><p class="ui-textarea-wrap-text">0/100</p></div>');
                htmls.push('</div>');
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //已收货同意退款
        comstatusFn.xx6 = {
            txt:'同意申请',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">请您仔细查看退款申请，无误后再点击“同意申请”按钮</p>');
                htmls.push(txt2);
                htmls.push(zhTxt);
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">退款积分：</p><p>' + (data.score || '') + '</p></div>');
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">配送物流：</p><p>' + (data.logi_name || '') + '</p></div>');
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">物流单号：</p><p>' + (data.logi_no || '') + '</p></div>');
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //拒绝退款
        comstatusFn.xx7 = {
            txt:'拒绝申请',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">建议您先与买家协商后，再决定是否拒绝退款；<br />若您拒绝退款，买家可修改退款申请，并重新申请退款。</p>');
                htmls.push(txt2);
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">配送物流：</p><p>' + (data.logi_name || '') + '</p></div>');
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">物流单号：</p><p>' + (data.logi_no || '') + '</p></div>');
                htmls.push('<div class="ui-block ui-block-align-c pb10"><p class="w80 pr10 tr">收货状态：</p><div class="ui-block ui-block-align-c"><label class="ui-radio mr20"><input type="radio" name="refuse" value="received" checked><i></i>已收货</label><label class="ui-radio"><input type="radio" name="refuse" value="unreceived"><i></i>未收货</label></div></div>');
                htmls.push('<div class="ui-block"><p class="w80 pr10 tr">拒绝理由：</p>');
                htmls.push('<div class="ui-textarea-wrap"><textarea name="explanation" data-maxLen="100" class="ui-textarea w300 h100" placeholder="请输入详细拒绝理由"></textarea><p class="ui-textarea-wrap-text">0/100</p></div>');
                htmls.push('</div>');
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        //确认已退款
        comstatusFn.xx8 = {
            txt:'确认退款',
            htmls: function(){
                var htmls = [];
                htmls.push('<div class="f12 w500"><div class="p30">');
                htmls.push('<p class="ui-color3 pb20 pl20 tl">请您务必先退款给客户，再点击“确认退款”按钮</p>');
                htmls.push(txt2);
                htmls.push(zhTxt);
                htmls.push('</div></div>');
                return htmls.join('');
            }
        };

        var dialog = new base.Dialog({
            content:comstatusFn['xx' + comstatus].htmls(),
            btnOkTxt:comstatusFn['xx' + comstatus].txt,
            headerTxt: '退款审核',
            style:{ padding:'0'},
            okCallback: function(){
                dialog.saveThrough = false;
                ajaxData.explanation = dialog.containerEle.find('textarea[name=explanation]').val();
                ajaxData.address = dialog.containerEle.find('textarea[name=address]').val();
                ajaxData.refuse = dialog.containerEle.find('input[name=refuse]').val();
                console.log(dialog);
                base.ajax({
                    url:'openapi.php?act=getAftersalesChangeStatus',
                    type:'post',
                    data:ajaxData,
                    success: function(result){
                        result = result || {};
                        if(result.res && result.res == 'succ'){
                            new base.promptDialog({str:(result.msg || '成功'), time:2000});
                            dialog.remove();
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(result.msg || '失败'), time:2000});
                        }
                    }
                });
            }
        });
    }

    module.exports = {
        init: function(){}
    }
});

