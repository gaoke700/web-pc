define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    var Laydate = require('../../../plugin/laydate/laydate.js');

    var $page = $('.page-groups-team');
    var $listWrap = $page.find('.list-wrap');
    var $bar = $page.find('.bar');
    var searchData = {firstTime:'', lastTime:''};

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
                { text:'团长'},
                { text:'开始时间' },
                { text:'结束时间' },
                { text:'拼团状态'},
                { text:'拼团人数'},
                { text:'操作', width:'80px'}
            ]
        },
        ajaxData:{
            data:{
                act_id:pageGroupsTeam.actId,
                select:searchData,
                view:pageGroupsTeam.view
            },
            model: 'promotion/groupsTeam'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                //act_person_num  活动人数
                //join_person_num  参与人数
                //team_id
                //username  团长名
                //userface    团长头像

                var userNameHtml = [];
                userNameHtml.push('<div class="ui-block ui-block-align-c pl5 pt5 pb5" style="width: 100%;">');
                userNameHtml.push('<img style="display: block; width: 70px; height: 70px; border-radius: 5px;" src="' + (item.userface || '') + '" />');
                userNameHtml.push('<p class="pl10 tl" style="-webkit-box-flex: 1;">' + (item.username || '') + '</p>');
                userNameHtml.push('</div>');

                arr1.push(userNameHtml.join(''));
                arr1.push(item.begin_time || '');
                arr1.push(item.end_time || '');
                arr1.push(item.team_status || '');
                arr1.push((item.join_person_num || '') + '/' + (item.act_person_num || 0));
                arr1.push('<a href="index.php?ctl=promotion/groupsTeamMember&act=index&team_id=' + (item.team_id || '') + '">查看</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $bar.on('click', '.js-btn-search', function(){
        searchData.firstTime = $bar.find('input[name=firstTime]').val();
        searchData.lastTime = $bar.find('input[name=lastTime]').val();
        table.ajax({ select:searchData });
    });

    module.exports = {
        init: function(){}
    }
});

