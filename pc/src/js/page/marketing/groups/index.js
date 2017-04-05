define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    //var UiRadioSlide = require('../../../module/ui-radio-slide.js');

    var $page = $('.page-groups-index');
    var $listWrap = $page.find('.list-wrap');
    var $bar = $page.find('.bar');
    var $jsSearchParent= $page.find('.js-search-parent');
    var searchData = { type:'act_name', val:'' };

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'拼团名称', width:'200px' },
                { text:'拼团商品' },
                { text:'拼团有效期' },
                { text:'拼团价格', width:'150px'},
                { text:'活动状态', width:'90px' },
                { text:'操作', width:'160px'}
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageGroupsIndex.view
            },
            model: 'promotion/groupsActivity'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.act_id || '';
                var goodsName = item.goods_name || '';

                var goodHtml = [];
                goodHtml.push('<div class="ui-block ui-block-align-c pl5 pt5 pb5" style="width: 100%;">');
                goodHtml.push('<img style="display: block; width: 70px; height: 70px; border-radius: 5px;" src="' + (item.thumbnail_pic || '') + '" />');
                goodHtml.push('<div class="pl10 tl" style="-webkit-box-flex: 1;"><p class="ui-ellipsis-1" title="' + goodsName + '">' + goodsName + '</p>');
                goodHtml.push('<p>价格:' + Number((item.goods_price || 0)).toFixed(2) + '元</p>');
                // groups_price
                goodHtml.push('<p>库存:' + (item.goods_store || 0) + '</p></div>');
                goodHtml.push('</div>');

                var czTxt = '';
                if(item.is_edit){
                    czTxt += '<a class="mr10" href="index.php?ctl=promotion/groups&act=edit&act_id=' + id + '">编辑</a>';
                }

                if(item.is_del){
                    czTxt += '<a data-id="' + id + '" class="mr10 js-del" href="javascript:;">删除</a>';
                }

                if(item.is_act){
                    czTxt += '<a class="mr10" href="index.php?ctl=promotion/groupsTeam&act=index&act_id=' + id + '">活动数据</a>';
                }

                if(item.is_show){
                    czTxt += '<a class="mr10" href="index.php?ctl=promotion/groups&act=edit&act_id=' + id + '">查看</a>';
                }

                if(item.is_finish){
                    czTxt += '<a data-id="' + id + '" class="mr10 js-end" href="javascript:;">终止</a>';
                }

                arr1.push(item.act_name || '');
                arr1.push(goodHtml.join(''));
                arr1.push((item.start_time || '') + ' 至 ' + (item.end_time || ''));
                arr1.push(item.groups_price || '');
                arr1.push(item.act_status || '');
                arr1.push('<p class="pl10">' + czTxt + '</p>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //新增拼团
    $page.on('click', '.js-add-groups', function(){
        if(!Number(pageGroupsIndex.isUse)){
            new base.Dialog({
                content:'为了更便捷处理微拼团中可能发生的活动退款事宜，<br />马上开启“云起微商城代收”功能',
                btnOkTxt:'马上开启',
                btnCancelTxt:'再想想',
                okCallback: function(){
                    window.location.href = 'index.php?ctl=system/setting&act=show_store_payinfo';
                }
            });
        } else {
            window.location.href = $(this).attr('href');
        }
        return false;
    });

    //搜索
    $jsSearchParent.on('click', '.js-search-btn', function(){
        searchData.val = $jsSearchParent.find('input[name=val]').val();
        table.ajax({ select:searchData });
    });

    //删除
    $listWrap.on('click', '.js-del', function(){
        var id = $(this).data('id') || '';
        ajaxFn(id, '确定删除吗？');
    });

    //终止
    $listWrap.on('click', '.js-end', function(){
        var id = $(this).data('id') || '';
        ajaxFn(id, '确定终止吗？');
    });

/*
    var uiRadioSlide = new UiRadioSlide({
        appendDom: $bar.find('.switch'),
        append: true,
        status:Number(pageGroupsIndex.switch),
        clickCallback:function(obj){
            var status = obj.status2;
            if(status){
                new base.Dialog({
                    content:'确定关闭拼团频道吗？',
                    okCallback: function(){
                        changeSwitch(Math.abs(status-1), function(){
                            uiRadioSlide.off();
                        });
                    }
                });
            } else {
                new base.Dialog({
                    content:'确定开启拼团频道吗？',
                    okCallback: function(){
                        changeSwitch(Math.abs(status-1), function(){
                            uiRadioSlide.on();
                        });
                    }
                });
            }
        }
    });

    function changeSwitch(val, callback){
        base.ajax({
            url:'openapi.php?act=groupSetConf',
            type:'post',
            data:{ status:val },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '成功'), time:2000});
                    callback(data);
                } else {
                    new base.promptDialog({str:(data.msg || '失败'), time:2000});
                }
            }
        })
    }
*/

    function ajaxFn(id, content){
        var dialog = new base.Dialog({
            content:content,
            okCallback: function(){
                dialog.saveThrough = false;
                base.ajax({
                    url:'openapi.php?act=groupToFinish',
                    type:'post',
                    data:{ act_id:id },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '成功'), time:2000});
                            dialog.remove();
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '失败'), time:2000});
                        }
                    }
                })
            }
        })
    }

    module.exports = {
        init: function(){}
    }
});

