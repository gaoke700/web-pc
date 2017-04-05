define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    var actId = base.utils.getUrlObj().act_id || '';

    var $page = $('.page-shavecard-winner');
    var $listWrap = $page.find('.list-wrap');
    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'参与人' },
                { text:'参与时间'},
                { text:'获得奖品'},
                { text:'消耗积分'}
            ]
        },
        ajaxData:{
            data:{ view:pageShavecardWinner.view, act_id:actId },
            model: 'promotion/shaveCardPrize'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var userNames = item.user_names || {};
                arr1.push(userNames.phone || '');
                arr1.push(item.join_time || '');
                arr1.push(item.prize_id || '');
                arr1.push(item.spent_points || '');
                arr.push(arr1);
            });
            return arr;
        }
    });

    module.exports = {
        init: function(){}
    }
});

