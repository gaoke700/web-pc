define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    var $page = $('.page-coupons-index');
    var $listWrap = $page.find('.list-wrap');
    var searchData = { val:'', type:'coupon_title' };

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'优惠劵名称' },
                { text:'面值' },
                { text:'使用条件' },
                { text:'领取条件' },
                { text:'有效期' },
                { text:'优惠劵总数' },
                { text:'已领取' },
                { text:'已使用' },
                { text:'操作', width:'180px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageCouponsIndex.view
            },
            model: 'coupon/coupon'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                //'未开始' => array('status' => '1'),
                //'进行中' => array('status' => '2'),
                //'已结束' => array('status' => '3'),
                var couponId = item.coupon_id || '';
                var status = Number(item.status || 3);
                var caozText = '';

                switch (status){
                    case 1:
                        // caozText = '<a data-qrcode="' + (item.pro_url_qrcode || '') + '" data-url="'+ (item.pro_url || '') + " class="mr20 js-btn-preview" href="javacript:;">推广链接</a><a class="mr20" href="index.php?ctl=coupon/coupon&act=edit_coupon&coupon_id=' + couponId + '&op=edit">编辑</a><a data-id="' + couponId + '" class="js-btn-del" href="javascript:;">作废</a>';
                        caozText = '<a data-qrcode="' + (item.pro_url_qrcode || '') + '" data-url="' + (item.pro_url || '') + '" class="mr20 js-btn-preview" href="javacript:;">推广链接</a><a class="mr20" href="index.php?ctl=coupon/coupon&act=edit_coupon&coupon_id=' + couponId + '&op=edit">编辑</a><a data-id="' + couponId + '" class="js-btn-del" href="javascript:;">作废</a>';
                        break;
                    case 2:
                        caozText = '<a data-qrcode="' + (item.pro_url_qrcode || '') + '" data-url="' + (item.pro_url || '') + '" class="mr20 js-btn-preview" href="javacript:;">推广链接</a><a class="mr20" href="index.php?ctl=coupon/coupon&act=edit_coupon&coupon_id=' + couponId + '&op=edit">编辑</a><a data-id="' + couponId + '" class="js-btn-del" href="javascript:;">作废</a>';
                        break;
                    case 3:
                        caozText = '已结束<a href="javascript:;" data-id="' + couponId + '" class="ml20 page-del">删除</a>';
                        break;
                    case 4:
                        caozText = '已结束<a href="javascript:;" data-id="' + couponId + '" class="ml20 page-del">删除</a>';//已作废
                        break;
                    default:
                        caozText = '已结束<a href="javascript:;" data-id="' + couponId + '" class="ml20 page-del">删除</a>';
                }

                arr1.push(item.coupon_title || '');
                arr1.push(Number(item.price || 0).toFixed(2));
                arr1.push(item.use_cond || '');
                arr1.push(item.get_cond || '');
                arr1.push((item.begin_time || '') + ' 至 ' + (item.end_time || ''));
                arr1.push(item.total_num || 0);
                arr1.push(item.get_num || 0);
                arr1.push(item.used_num || 0);
                arr1.push(caozText);
                arr.push(arr1);
            });
            return arr;
        },
        renderItemCallback: function(){
            $.each($listWrap.find('.js-btn-preview'), function(i, item){
                var html = '';
                html += '<div class="level-list-preview">';
                html += '<p class="pb5 tc">扫一扫，分享页面领取优惠劵</p>';
                html += '<img style="display: block; width: 120px; height: 120px; margin: 0 auto;" src="' + ($(item).data('qrcode')||'') + '" />';
                html += '<div class="ui-block ui-block-align-c pt20"><input type="text" class="ui-input " value="' + ($(item).data('url')||'') + '" /><div class="ui-btn ui-btn-c-1 ui-btn-w-1 ml10 js-copy-share-url">复制</div></div>';
                html += '</div>';
                var popover = new base.Popover({
                    obj: $(item),
                    parent:$listWrap,
                    content: html,
                    arrowPos: 'up',
                    placement:3,
                    event: 'hover'
                });
                $(popover).on('createEnd', function(){
                    $listWrap.one('click', '.level-list-preview .js-copy-share-url', function(){
                        var parents = $(this).parents('.level-list-preview');
                        var val = parents.find('input').val();
                        if(val!==undefined&&val!==''){
                            parents.find('input').select();
                            document.execCommand("Copy");
                            new base.promptDialog({str:'复制成功'});
                        }
                    });
                });
            });
        }
    });

    //作废
    $listWrap.on('click', '.js-btn-del', function(){
        var id = $(this).data('id') || '';
        if(!id) { return false; }
        new base.Dialog({
            content:'确定作废吗？',
            okCallback: function(){
                base.ajax({
                    url:'openapi.php?act=del_coupon',
                    type:'post',
                    data:{id:id},
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '作废成功'), time:2000});
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '作废失败'), time:2000});
                        }
                    }
                })
            }
        });
    });

    //删除
    $listWrap.on('click', '.page-del', function(){
        var id = $(this).data('id') || '';
        if(!id) { return false; }
        new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                base.ajax({
                    url:'openapi.php?act=delete&model=coupon/coupon',
                    type:'post',
                    data:{id:id},
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
        });
    });


    //搜索
    $page.on('click', '.js-search-btn', function(){
        searchData.val = $page.find('input[name=val]').val();
        table.ajax({ select:searchData });
    });
    module.exports = {
        init: function(){}
    }
});

