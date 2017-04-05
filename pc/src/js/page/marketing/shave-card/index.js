define(function (require, exports, module) {
    var Table = require('../../../module/table.js');

    var $page = $('.page-shavecard-index');
    var $listWrap = $page.find('.list-wrap');
    var $jsSearchParent= $page.find('.js-search-parent');
    var searchData = { type:'shaveCard', val:'' };
    var listData = [];

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'活动名称' },
                { text:'参与次数'},
                { text:'活动有效期'},
                { text:'参与限制'},
                { text:'奖品种类'},
                { text:'活动状态'},
                { text:'操作', width:'160px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageShavecardIndex.view
            },
            model: 'promotion/shaveCard'
        },
        renderItemFn: function(data){
            var arr = [];
            listData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var prizeCats = item.prize_cats || {};
                var prizeCatNum = prizeCats.prize_cat_num || 0;
                var status = item.mystatus || 0;
                var id = item.act_id || '';
                var czTxt = '';
                if(status == 1){
                    czTxt = '<a class="mr20 qrma" data-qrurl="'+item.qr+'" data-url="'+item.shaveCardUrl+'" >二维码</a><a class="mr20" href="index.php#ctl=promotion/shaveCard&act=showEdit&p[0]=' + id + '">编辑</a><a class="js-del-one" data-id="' + id + '" href="javascript:;">删除</a>';
                } else if(status == 2){
                    czTxt = '<a class="mr20 qrma" data-qrurl="'+item.qr+'" data-url="'+item.shaveCardUrl+'">二维码</a><a class="js-termination-one mr20" data-id="' + id + '" href="javascript:;">终止</a><a href="index.php#ctl=promotion/shaveCard&act=showEdit&p[0]=' + id + '&op=view">查看</a>';
                } else {
                    czTxt = '<a href="index.php#ctl=promotion/shaveCard&act=showEdit&p[0]=' + id + '&op=view">查看</a>';
                }

                arr1.push(item.act_name || '');
                arr1.push((item.join_times || 0) + '<a class="ml10" href="index.php?ctl=promotion/shaveCardPrize&act=index&act_id=' + id + '">查看详情</a>');
                arr1.push((item.begin_time || '') + ' 至 ' + (item.end_time || ''));
                arr1.push(item.limit_join_times || '');
                arr1.push('<div>' + (prizeCats.cat_name || '') + '<br /><p class="ui-color1 ' + (prizeCatNum ? 'js-show-jiangxiang' : '') + '" data-index="' + i + '">' + prizeCatNum +'种奖项</p></div>');
                arr1.push(item.act_status || '');
                arr1.push(czTxt);
                arr.push(arr1);
            });
            return arr;
        },
        renderItemCallback: function(){
            $.each($listWrap.find('.js-show-jiangxiang'), function(i, item){
                var index = $(this).data('index');
                var data = listData[index] && listData[index].prize_list || [];

                var html = '';
                html += '<div class="pl10 pr10 tl" style="min-width: 280px;">';
                html += '<p class="tc ui-h2 f14 pb10">奖项种类</p>';
                $.each(data, function(n, m){
                    html += '<p class="pb10 pt10 ' + (n >= data.length-1 ? '' : 'ui-border-b') + '"><span class="ui-h2 pr20">' + (m.prize_name || '') + '</span><span class="ui-color2">' + (m.remark||'') + '</span></p>';
                });
                html += '';
                html += '</div>';
                new base.Popover({
                    obj: $(item),
                    parent:$listWrap,
                    content: html,
                    arrowPos: 'right',
                    //placement:3,
                    event: 'hover'
                });
            });




            $('.qrma').each(function(i,item){
                (function(){
                    var html = '';
                    html += '<div class="level-list-preview">';
                    html += '<p class="pb5 tc">扫一扫，分享页面领取刮刮卡</p>';
                    html += '<img style="display: block; width: 120px; height: 120px; margin: 0 auto;" src="' + $(item).data('qrurl') + '" />';
                    html += '<div class="ui-block ui-block-align-c pt20"><input type="text" class="ui-input " value="' + $(item).data('url') + '" /><div class="ui-btn ui-btn-c-1 ui-btn-w-1 ml10 js-copy-share-url">复制</div></div>';
                    html += '</div>';
                    var popover = new base.Popover({
                        obj: $(item),
                        parent:$listWrap,
                        content: html,
                        arrowPos: 'right',
                        placement:1,
                        event: 'hover'
                    });
                    $(popover).on('createEnd', function(){
                        $listWrap.one('click', '.level-list-preview .js-copy-share-url', function(){
                            var val = $listWrap.find('.level-list-preview input').val();
                            if(val!==undefined&&val!==''){
                                $listWrap.find('.level-list-preview input').select();
                                document.execCommand("Copy");
                                new base.promptDialog({str:'复制成功'});
                            }
                        });
                    });
                })();
            })
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
                    data: { act_id:id, op:op, type:'shaveCard' },
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

