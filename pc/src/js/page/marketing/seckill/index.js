define(function (require, exports, module) {
    var Table = require('../../../module/table.js');

    var $page = $('.page-seckill-index');
    var $listWrap = $page.find('.list-wrap');
    var $jsSearchParent= $page.find('.js-search-parent');
    var searchData = { type:'goods_name', val:'' };

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'秒杀商品' },
                { text:'活动有效期', width:'300px' },
                { text:'提醒人数', width:'120px' },
                { text:'活动状态', width:'120px' },
                { text:'操作', width:'120px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageSeckillIndex.view
            },
            model: 'promotion/secKill'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var actName = item.act_name || {};

                var goodHtml = [];
                goodHtml.push('<div class="ui-block ui-block-align-c pl5" style="width: 100%;">');
                goodHtml.push('<img style="display: block; width: 60px; height: 60px;" src="' + (actName.thumbnail_pic || '') + '" />');
                goodHtml.push('<p class="pl10 tl">' + (actName.goods_name || '') + '<br />秒杀价格:' + (actName.price || '') + '<br />秒杀库存:' + (actName.store || 0) + '</p>');
                goodHtml.push('</div>');

                var status = item.mystatus || 0;
                var id = item.act_id || '';
                var goodsId = item.goods_id || '';
                var czTxt = '';
                if(status == 1){
                    czTxt = '<a class="mr20" href="index.php?ctl=promotion/secKill&act=showEdit&p[0]=' + goodsId + '&p[1]=' + id + '">编辑</a><a class="js-del-one" data-id="' + id + '" href="javascript:;">删除</a>';
                } else if(status == 2){
                    czTxt = '<a class="js-termination-one mr20" data-id="' + id + '" href="javascript:;">终止</a><a href="index.php#ctl=promotion/secKill&act=showEdit&p[0]=' + goodsId + '&p[1]=' + id + '">查看</a>';
                } else {
                    czTxt = '<a href="index.php#ctl=promotion/secKill&act=showEdit&p[0]=' + goodsId + '&p[1]=' + id + '">查看</a>';
                }

                arr1.push(goodHtml.join(''));
                arr1.push((item.begin_time || '') + '至' + (item.end_time || ''));
                arr1.push(item.remind_num || 0);
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
                    data: { act_id:id, op:op, type:'secKill' },
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

