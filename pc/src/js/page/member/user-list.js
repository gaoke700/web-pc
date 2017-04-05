define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $pageMemberUserList = $('.page-member-user-list');
    var $userListSearch = $pageMemberUserList.find('.user-list-search');
    var $userWrap = $pageMemberUserList.find('.user-wrap');

    var userTableData = [];

    //创建表格列表
    var userTable = new Table({
        parent:$userWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                { text:'用户帐号' },
                { text:'手机号', width:'100px'},
                { text:'微信号', width:'100px'},
                { text:'注册时间', width:'80px'},
                { text:'会员卡'},
                { text:'会员昵称'},
                { text:'推荐人', width:'100px'},
                // { text:'订单数', width:'60px'},
                { text:'订单金额', width:'80px'},
                { text:'渠道', width:'100px'},
                {
                    text:'积分',
                    width:'60px'
                    //change: true,
                    //changeType: 'number',
                    //changeFn: function(data){
                    //    console.log(data);
                    //}
                },
                { width:'110px', text:'操作' }
            ]
        },
        ajaxData:{
            model: 'member/member',
            data:{ select:getSearchData() }
        },
        renderItemFn: function(data){
            userTableData = data;
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var memberId = item.member_id || '';
                var phone = item.phone || '';
                arr1.push('<p class="ui-ellipsis-1 w" title="' + phone + '">' + phone + '</p>');
                arr1.push(item.mobile || '');
                arr1.push(item.wx || '');
                arr1.push(item.regtime || '');
                arr1.push('<span class="ui-color1">' + (item.member_lv_name || '') + '</span><br />' + (item.member_lv_cardnum || ''));
                arr1.push(item.name || '');
                arr1.push(item.distributor_uname || '');
                // arr1.push(item.total_orders_num || 0);
                arr1.push(Number(item.total_orders_amount || 0).toFixed(2));
                arr1.push(item.source || '');
                arr1.push(item.score || 0);
                arr1.push('<a class="js-btn-set-lv" data-id="' + memberId + '" href="javascript:;">调整等级</a><a data-index="' + i + '" class="js-change-score ml20" href="javascript:;">修改</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //单条修改会员等级
    $userWrap.on('click', '.js-btn-set-lv', function(){
        var id = $(this).data('id');
        if(!id){ return false; }
        var index = base.utils.arrayFindkey(userTableData, 'member_id', id);
        if(index < 0){ return false; }
        var data = userTableData[index];
        var str = (data.phone || '') + '<br />' + (data.member_lv_name || '') + '<br />' + (data.member_lv_cardnum || '');
        setLv([id], str);
    });

    //批量修改会员等级
    $pageMemberUserList.on('click', '.js-btn-set-lv-all', function(){
        var result = userTable.UiTable.checkboxData;
        if(result.length <= 0) {
            new base.promptDialog({str:'请先选择需要操作的数据', time:2000});
            return false;
        }
        if(result.length == 1 && result[0] == 'all'){
            setLv(result, ('批量调整<br />' + (userTable.data.count || 0) + '位会员的等级'));
            return false;
        }

        var arr = [];
        $.each(result, function(i, item){
            arr.push(userTableData[item].member_id || '');
        });
        setLv(arr, ('批量调整<br />' + result.length + '位会员的等级'));
    });

    //修改积分
    $userWrap.on('click', '.js-change-score', function(){
        var index = $(this).data('index') || 0;
        var data = userTableData[index];
        var htmls = [];
        htmls.push('<div class="f12 w500"><div class="p30">');
        htmls.push('<div class="ui-block ui-block-align-c pb10 pt5"><p class="w80 pr10 tr">用户帐号：</p><p class="ui-color2">' + (data.phone || '') + '</p></div>');
        htmls.push('<div class="ui-block ui-block-align-c pb10 pt5"><p class="w80 pr10 tr">会员昵称：</p><p class="ui-color2">' + (data.name || '') + '</p></div>');
        htmls.push('<div class="ui-block ui-block-align-c pb10 pt5"><p class="w80 pr10 tr">当前积分：</p><p class="ui-color2">' + (data.score || 0) + '</p></div>');
        htmls.push('<div class="ui-block ui-block-align-c pb10 pt5"><p class="w80 pr10 tr">增减积分：</p><input name="edit_score" style="width: 140px; display: block;" class="ui-input" type="number" /><p class="ui-color2 pl10">输入正值增加，负值减少</p></div>');
        htmls.push('<div class="ui-block pt5"><p class="w80 pr10 tr">备注：</p>');
        htmls.push('<div class="ui-textarea-wrap"><textarea name="editmemo" data-maxLen="120" class="ui-textarea w300 h100"></textarea><p class="ui-textarea-wrap-text">0/120</p></div>');
        htmls.push('</div>');
        htmls.push('</div></div>');
        var dialog = new base.Dialog({
            content:htmls.join(''),
            headerTxt: '修改积分',
            style:{ padding:'0'},
            okCallback: function(){
                dialog.saveThrough = false;
                var editScore = dialog.containerEle.find('input[name=edit_score]').val();
                var editmemo = dialog.containerEle.find('textarea[name=editmemo]').val();
                base.ajax({
                    url:'openapi.php?act=set_score',
                    type:'post',
                    data:{
                        mid:(data.member_id || ''),
                        edit_score:editScore,
                        memo:editmemo
                    },
                    success: function(result){
                        result = result || {};
                        if(result.res && result.res == 'succ'){
                            new base.promptDialog({str:(result.msg || '成功'), time:2000});
                            dialog.remove();
                            userTable.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(result.msg || '失败'), time:2000});
                        }
                    }
                });
            }
        });
    });

    //搜索
    $userListSearch.on('click', '.js-search-btn', function(){
        userTable.ajax({ select:getSearchData() });
    });

    //设置会员等级
    function setLv(data, str){
        if(!data){ return false;}
        //var str = (type == 1) ? () : ('批量调整<br />35位会员的等级');

        var htmls = [];
        htmls.push('<div class="g-dialog-set-user-lv js-dialog-set-lv">');
        htmls.push('<div class="set-lv-1"><div class="set-lv-bg set-lv-bg-1"></div><div class="set-lv-1-text"><p>' + str + '</p></div></div>');
        htmls.push('<div class="set-lv-text">调整为</div>');
        htmls.push('<div class="set-lv-1"><div class="set-lv-bg set-lv-bg-2"></div><div class="set-lv-1-text"><select class="ui-select">' + $userListSearch.find('.js-search-lvid').html() + '</select></div></div>');
        htmls.push('</div>');
        var dialog = new base.Dialog({
            content:htmls.join(''),
            headerTxt:'调整用户会员等级',
            btnOkTxt:'确定调整',
            style:{ padding:'0' },
            okCallback: function(){
                var selectVal = $('.js-dialog-set-lv').find('select').val();

                dialog.saveThrough = false;
                base.ajax({
                    url:'openapi.php?act=batch_save_member_lv',
                    type:'post',
                    data:{
                        model:'goods/tag',
                        data:{
                            select: {
                                member_lv_id: selectVal,
                                member_ids: data
                            }
                        }
                    },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            dialog.remove();
                            new base.promptDialog({str:'调整成功'});
                            userTable.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '调整失败'), time:2000});
                        }
                    }
                })

            }
        })
    }

    //获取接口查询条件
    function getSearchData(){
        return {
            lvid:$userListSearch.find('.js-search-lvid').val(),
            account: $userListSearch.find('.js-search-account').val(),
            val: $userListSearch.find('.js-search-val').val()
        }
    }

    module.exports = {
        init: function(){}
    }
});
