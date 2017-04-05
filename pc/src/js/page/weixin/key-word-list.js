define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $page = $('.page-weixin-keywordlist');
    var $keywordlistListWrap = $page.find('.keywordlist-list-wrap');

    var keyWordListData = [];

    //创建表格列表
    var table = new Table({
        parent:$keywordlistListWrap,
        tableConfig:{
            // checkbox: true,
            headConfig:[
                { text:'关键词', width:'240px' },
                { text:'素材' },
                { text:'操作', width:'130px' }
            ]
        },
        ajaxData:{ model: 'interaction/keyword' },
        renderItemFn: function(data){
            var arr = [];
            keyWordListData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.id || '';
                var keyWord = item.keyword || '';
                var mId = item.m_id || '';
                arr1.push(keyWord);
                arr1.push(mId);
                arr1.push('<a href="index.php?ctl=weixin/keyword&act=edit&p[0]=' + keyWord +'&p[1]=' + mId + '">编辑</a><a class="ml20 js-del-one" data-keyword="' + keyWord + '" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //单条删除
    $keywordlistListWrap.on('click', '.js-del-one', function(){
        var keyword = $(this).data('keyword') || '';
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
        var data = { op: 'reply'};  //'article'
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
                checkData.push(keyWordListData[item].keyword);
            });
        }

        return checkData;
    }

    module.exports = {
        init: function(){}
    }
});

