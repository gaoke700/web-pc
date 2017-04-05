define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var Export = require('../../module/export.js');
    var Laydate = require('../../plugin/laydate/laydate.js');

    var $page = $('.page-bonus-query');
    var $listWrap = $page.find('.list-wrap');
    var $topBar = $page.find('.top-bar');
    var searchData = { pay_b_time:'', pay_e_time:'', type:'order_id', val:'' };
    var listData = [];

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

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                { text:'关联ID' },
                { text:'交易总额' },
                { text:'交易时间' },
                { text:'奖金金额' },
                { text:'奖金类型' },
                { text:'操作' }
            ]
        },
        ajaxData:{
            data:{ select:searchData },
            model: 'brokerage/records'
        },
        renderItemFn: function(data){
            var arr = [];
            listData = data;
            $.each(data, function(i, item){
                var arr1 = [];

                arr1.push(item.relation_id || '');
                arr1.push(item.price || 0.00);
                arr1.push(item.pay_time);
                arr1.push(item.rebates || 0.00);
                arr1.push(item.source || '');
                arr1.push('<a class="js-look" data-id="' + (item.order_id || '') + '" href="javascript:;">查看</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $topBar.on('click', '.js-search-btn', function(){
        searchData.pay_b_time = $topBar.find('input[name=pay_b_time]').val();
        searchData.pay_e_time = $topBar.find('input[name=pay_e_time]').val();
        searchData.val = $topBar.find('input[name=val]').val();
        table.ajax({ select:searchData });
    });

    //查看
    $listWrap.on('click', '.js-look', function(){
        var id = $(this).data('id') || '';
        var $look = $('<div style="width: 500px;"></div>');
        new base.Dialog({
            type:'alert',
            headerTxt: '推广员奖金详情',
            customContent: true,
            content:$look
        });
        base.ajax({
            url:'openapi.php?act=brokerageDetail',
            type:'post',
            data:{order_id: id},
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    var result = data.result || {};
                    var msgs = result.msgs || {};
                    var base_degree = msgs.base_degree || {};
                    var first_degree = msgs.first_degree || {};

                    var htmls = [];
                    htmls.push('<div class="p20 f12">');

                    htmls.push('<div class="ui-block pb20">');
                    htmls.push('<div class="w140 fb">本店推广员</div>');
                    htmls.push('<div class="w300">');
                    htmls.push('<p class="pb5">推广员店铺：' + (base_degree.name || '') + '</p>');
                    htmls.push('<p class="pb5">推广员帐号：' + (base_degree.phone || '') + '</p>');
                    htmls.push('<p class="pb5">推广员奖金：' + (base_degree.rebates || '') + '</p>');
                    htmls.push('<p>退款奖金：' + (base_degree.refund_rebates || '') + '</p>');
                    htmls.push('</div>');
                    htmls.push('</div>');

                    if(msgs.first_degree){
                        htmls.push('<div class="ui-block ui-border-t pt20">');
                        htmls.push('<div class="w140 fb">上级推广员</div>');
                        htmls.push('<div class="w300">');
                        htmls.push('<p class="pb5">推广员店铺：' + (first_degree.name || '') + '</p>');
                        htmls.push('<p class="pb5">推广员帐号：' + (first_degree.phone || '') + '</p>');
                        htmls.push('<p class="pb5">推广员奖金：' + (first_degree.rebates || '') + '</p>');
                        htmls.push('<p>退款奖金：' + (first_degree.refund_rebates || '') + '</p>');
                        htmls.push('</div>');
                        htmls.push('</div>');
                    }

                    htmls.push('</div>');
                    $look.html(htmls.join(''));
                } else {
                    new base.promptDialog({str:(data.msg || '获取失败'), time:2000});
                }
            }
        });
    });

    //导出
    var popover = new base.Popover({
        obj: $topBar.find('.js-export'),
        parent:$topBar,
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
                    allData:listData,
                    name:'order_id'
                },
                form: { action : '?ctl=seller/brokerage&act=export', data:{ select:searchData, export_type:type} }
            });
        })
    });

    module.exports = {
        init: function(){}
    }
});

