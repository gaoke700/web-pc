define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $page = $('.page-bonus-log');
    var $listWrap = $page.find('.list-wrap');

    var modelArr = ['brokerage/sitelog','brokerage/goodslog','brokerage/sellerlog'];

    var pageIndex=pageBonusLog.view;//0.店铺奖金修改日志  1.商品奖金修改日志  2.销售员开启关闭日志

    var config={
        table:{
            0:{
                head:[
                    { text:'修改时间' },
                    { text:'本店销售奖金(%)' },
                    { text:'一级分店奖金(%)' },
                    { text:'二级分店奖金(%)' },
                    { text:'奖金提现金额限制' },
                    { text:'奖金提现天数限制' }
                ]
            },
            1:{
                head:[
                    { text:'修改时间' },
                    { text:'商品ID' },
                    { text:'商品编号' },
                    { text:'商品名称' },
                    { text:'本店销售奖金(%)' },
                    { text:'一级分店奖金(%)' },
                    { text:'二级分店奖金(%)' }
                ]
            },
            2:{
                head:[
                    { text:'修改时间' },
                    { text:'状态' }
                ]
            }
        }
    };



    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            checkbox: false,
            headConfig:config.table[pageIndex].head
        },
        ajaxData:{
            model: modelArr[pageIndex]
        },
        renderItemFn: function(data){
            var arr = [];
            //console.log(data);
            $.each(data, function(i, item){
                var arr1 = [];
                if(pageIndex==0){
                    arr1.push(`${item.last_time}`);
                    arr1.push(`${item.base_degree}`);
                    arr1.push(`${item.first_degree}`);
                    arr1.push(`${item.second_degree||''}`);
                    arr1.push(`${item.brokerage_limit}`);
                    arr1.push(`${item.day_limit}`);
                }
                if(pageIndex==1){
                    arr1.push(`${item.last_time}`);
                    arr1.push(`${item.goods_id}`);
                    arr1.push(`${item.goods_bn}`);
                    arr1.push(`${item.goods_name}`);
                    arr1.push(`${item.base_degree}`);
                    arr1.push(`${item.first_degree}`);
                    arr1.push(`${item.second_degree||''}`);
                }
                if(pageIndex==2){
                    arr1.push(`${item.last_time}`);
                    arr1.push(`${item.statusName}`);
                }
                arr.push(arr1);
            });
            return arr;
        }
    });

    module.exports = {
        init: function(){}
    }
});

