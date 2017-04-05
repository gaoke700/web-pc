define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $pageDepositIndex = $('.page-deposit-index');
    var $depositListWrap = $pageDepositIndex.find('.deposit-list-wrap');

    //创建表格列表
    new Table({
        parent:$depositListWrap,
        tableConfig:{
            headConfig:[
                { text:'提现时间' },
                { text:'提现金额' },
                { text:'收支流水号' },
                { text:'状态' },
                { text:'备注' }
            ]
        },
        ajaxData:{ model: 'trading/deposit' },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                arr1.push(item.created || '');
                arr1.push(item.tran_amount || '');
                arr1.push(item.front_log_no || '');
                arr1.push(item.wrs_error || '');
                arr1.push(item.wrs_result || '');

                arr.push(arr1);
            });
            return arr;
        }
    });

    module.exports = {
        init: function(){}
    }
});

