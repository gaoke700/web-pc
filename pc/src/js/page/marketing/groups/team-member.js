define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    var Laydate = require('../../../plugin/laydate/laydate.js');

    var $page = $('.page-groups-team-member');
    var $listWrap = $page.find('.list-wrap');
    var $bar = $page.find('.bar');
    var searchData = {from_join_time:'', to_join_time:'', order_id: ''};

    Laydate({
        elem: '#startTime1',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        festival: true
    });
    Laydate({
        elem: '#endTime1',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        festival: true
    });

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'参团人'},
                { text:'参团时间' },
                { text:'订单编号' },
                { text:'订单编号' }
            ]
        },
        ajaxData:{
            data:{
                team_id:pageGroupsTeamMember.teamId,
                select:searchData,
                view:pageGroupsTeamMember.view
            },
            model: 'promotion/groupsTeamMember'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var userNameHtml = [];
                userNameHtml.push('<div class="ui-block ui-block-align-c pl5 pt5 pb5" style="width: 100%;">');
                userNameHtml.push('<img style="display: block; width: 70px; height: 70px; border-radius: 5px;" src="' + (item.userface || '') + '" />');
                userNameHtml.push('<p class="pl10 tl" style="-webkit-box-flex: 1;">' + (item.username || '') + '</p>');
                userNameHtml.push('</div>');

                arr1.push(userNameHtml.join(''));
                arr1.push(item.join_time || '');
                arr1.push(item.pay_status || '');
                arr1.push(item.order_id || '');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $bar.on('click', '.js-btn-search', function(){
        searchData.from_join_time = $bar.find('input[name=from_join_time]').val();
        searchData.to_join_time = $bar.find('input[name=to_join_time]').val();
        searchData.order_id = $bar.find('input[name=order_id]').val();
        table.ajax({ select:searchData });
    });

    module.exports = {
        init: function(){}
    }
});

