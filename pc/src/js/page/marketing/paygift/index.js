define(function (require, exports, module) {
    var Table = require('../../../module/table.js');

    var $page = $('.page-paygift-index');
    var $listWrap = $page.find('.list-wrap');
    var $jsSearchParent= $page.find('.js-search-parent');
    var searchData = { type:'name', val:'' };

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'活动名称' },
                { text:'活动有效期' },
                { text:'奖品类型' },
                { text:'活动状态' },
                { text:'操作', width:'120px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pagePaygiftIndex.view
            },
            model: 'promotion/paygift'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];

                var status = item.status || 0;
                var id = item.id || '';
                var czTxt = '';

                if(status == 1){
                    czTxt = '<a class="mr20" href="index.php?ctl=promotion/paymentGift&act=edit&id=' + id + '">编辑</a><a class="js-del-one" data-id="' + id + '" href="javascript:;">删除</a>';
                } else if(status == 2){
                    czTxt = '<a class="js-termination-one mr20" data-id="' + id + '" href="javascript:;">终止</a><a href="index.php?ctl=promotion/paymentGift&act=read&id=' + id + '">查看</a>';
                } else {
                    czTxt = '<a href="index.php?ctl=promotion/paymentGift&act=read&id=' + id + '">查看</a>';
                }

                arr1.push(item.name || '');
                arr1.push((item.startTime || '') + ' 至 ' + (item.endTime || ''));
                arr1.push(item.giftType || '');
                arr1.push(item.statusName || '');
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
        czAjax('openapi.php?act=delete', id, '确定删除您的支付有礼活动吗？');
    });

    //终止
    $listWrap.on('click', '.js-termination-one', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false;}
        czAjax('openapi.php?act=paygiftOff', id, '确定终止您的支付有礼活动吗？');
    });

    function czAjax(url, id, txt){
        new base.Dialog({
            content:txt,
            okCallback: function(){
                base.ajax({
                    url:url,
                    type:'post',
                    data: { id:id, model: 'promotion/paygift'},
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

