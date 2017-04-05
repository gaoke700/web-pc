define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $page = $('.page-weixin-articlelist');
    var $articlelistListWrap = $page.find('.articlelist-list-wrap');
    var articleListData = [];

    var headConfig = [
        { text:'类型', width:'100px' },
        { text:'标题' },
        { text:'封面', width:'130px' },
        { text:'最后修改时间'},
        { text:'操作', width:'130px' }
    ];
    if(pageWeixinArticlelist.view == 1){
        headConfig.splice(2, 1);
    }

    //创建表格列表
    var table = new Table({
        parent:$articlelistListWrap,
        tableConfig:{
            checkbox: true,
            headConfig:headConfig
        },
        ajaxData:{
            model: 'interaction/material',
            data:{ view:pageWeixinArticlelist.view }
        },
        renderItemFn: function(data){
            var arr = [];
            articleListData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var params = item.params || {};
                var image = params.image || '';
                var id = item.id || '';
                arr1.push(item.type || '');
                arr1.push(params.title || '');
                if(pageWeixinArticlelist.view != 1){
                    arr1.push('<div style="height: 70px; padding: 5px 0;">' + (image ? ('<img style="display: block; width: 70px; height: 70px; border-radius: 5px;" src="' + image + '" />') : '') + '</div>');
                }
                arr1.push(item.last_modify || '');
                arr1.push('<a href="index.php?ctl=weixin/material&act=edit&p[0]=' + id + '">编辑</a><a class="ml20 js-del-one" data-id="' + id + '" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //单条删除
    $articlelistListWrap.on('click', '.js-del-one', function(){
        var keyword = $(this).data('id') || '';
        new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                delkey([keyword]);
            }
        })
    });

    //批量删除
    $page.on('click', '.js-batch-remove', function(){
        var arr = getCheckData();
        if(arr.length <= 0){
            new base.Dialog({ content: '请先从列表中打勾选择需要操作的记录！', type: 'alert' });
            return false;
        }

        new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                delkey(arr, true)
            }
        })
    });

    //删除ajax
    function delkey(keyword, isBatch){
        var data = { op: 'article'};
        if(isBatch && keyword.length == 1 && keyword[0] == 'all'){
            data.type = keyword
        } else {
            data.keyword = keyword;
        }

        base.ajax({
            url:'openapi.php?act=wxReplyDelete',
            type:'post',
            data:data,
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '删除成功'), time:2000});
                    table.ajax({refresh: true});
                } else {
                    new base.promptDialog({str:(data.msg || '删除失败'), time:2000});
                }
            }
        })
    }

    //获取checkbox选择的数据
    function getCheckData(){
        var checkArr = table.UiTable.checkboxData;

        if(checkArr.length <=0 ){ return []};

        var checkData = [];
        if(checkArr.length == 1 && checkArr[0] == 'all'){
            checkData = checkArr;
        } else {
            $.each(checkArr, function(i, item){
                checkData.push(articleListData[item].id);
            });
        }

        return checkData;
    }

    module.exports = {
        init: function(){}
    }
});

