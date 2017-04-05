define(function (require, exports, module) {
    var Table = require('../../../module/table.js');

    var $page = $('.page-fullreduction-index');
    var $listWrap = $page.find('.list-wrap');
    var $jsSearchParent = $page.find('.js-search-parent');

    var searchData = { val:'', type:'mj' };

    //创建表格列表
    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'活动名' },
                { text:'有效期' },
                { text:'状态' },
                { text:'操作'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageFullReductionIndex.view
            },
            model: 'promotion/mj'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.mj_id || '';
                var status = item.mystatus || 0;
                var czTxt = '';
                if(status == 1){
                    czTxt = '<a class="mr20" href="index.php?ctl=promotion/mj&act=edit&mj_id=' + id + '">编辑</a><a class="js-del-one" data-id="' + id + '" href="javascript:;">删除</a>';
                } else if(status == 2){
                    czTxt = '<a class="js-termination-one mr20" data-id="' + id + '" href="javascript:;">终止</a><a href="index.php?ctl=promotion/mj&act=edit&mj_id=' + id + '">查看</a>';
                } else {
                    czTxt = '<a href="index.php?ctl=promotion/mj&act=edit&mj_id=' + id + '">查看</a>';
                }

                arr1.push(item.mj_name || '');
                arr1.push((item.start_time || '') + ' 至 ' + (item.end_time || ''));
                arr1.push(item.act_status || '');
                arr1.push(czTxt);
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $jsSearchParent.on('click', '.js-search-btn', function(){
        searchData.val = $jsSearchParent.find('input[name=val]').val();
        table.ajax({ select:searchData });
    });

    //删除
    $listWrap.on('click', '.js-del-one', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false;}
        czAjax(id, 'del', '确定删除吗？');
    });

    //终止
    $listWrap.on('click', '.js-termination-one', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false;}
        czAjax(id, 'stop', '确定终止吗？');
    });

    function czAjax(id, op, txt){
        new base.Dialog({
            content:txt,
            okCallback: function(){
                base.ajax({
                    url:'openapi.php?act=upSecKillRow',
                    type:'post',
                    data: { act_id:id, op:op },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '操作成功'), time:2000});
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '操作失败'), time:2000});
                        }
                    }
                });
            }
        })
    }

    module.exports = {
        init: function(){}
    }
});

