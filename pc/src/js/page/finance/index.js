define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $pageFinanceIndex = $('.page-finance-index');
    var $financeListWrap = $pageFinanceIndex.find('.finance-list-wrap');

    //创建表格列表
    new Table({
        parent:$financeListWrap,
        tableConfig:{
            headConfig:[
                { text:'订单号' },
                { text:'交易时间' },
                { text:'类型' },
                { text:'收入' },
                { text:'支出' }
            ]
        },
        ajaxData:{ model: 'trading/teegon' },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                arr1.push(item.orderNo || '');
                arr1.push(item.created || '');
                arr1.push(item.journal_type || '');
                arr1.push(item.income || '');
                arr1.push(item.outcome || '');

                arr.push(arr1);
            });
            return arr;
        }
    });

    module.exports = {
        init: function(){}
    }
});

