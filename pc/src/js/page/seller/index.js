define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var Export = require('../../module/export.js');

    var $page = $('.page-seller-index');
    var $listWrap = $page.find('.list-wrap');
    var $topBar = $page.find('.top-bar');
    var searchData = { type:'', val:'' };
    var listData = [];

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                { text:'推广员ID', width:'75px' },
                { text:'标签'},
                { text:'奖金金额', width:'90px' },
                { text:'用户帐号', width:'134px' },
                { text:'手机号码', width:'90px' },
                { text:'昵称'},
                { text:'店铺名'},
                { text:'开店时间', width:'80px'},
                { text:'上级推广员', width:'90px'},
                { text:'下级推广员数', width:'90px'}
                //{ text:'成交订单数', width:'90px'},
                //{ text:'成交订单金额', width:'90px'}
            ]
        },
        ajaxData:{
            data:{ select:searchData },
            model: 'member/distributor'
        },
        renderItemFn: function(data){
            var arr = [];
            listData = data;
            $.each(data, function(i, item){
                var arr1 = [];

                var tagArr = item.tag || [];
                var tagHtml = '';
                $.each(tagArr, function(i, item){
                    tagHtml += (item.cut_tag_title || '') + (i >= tagArr.length-1 ? '' : '， ');
                });
                arr1.push(item.member_id || '');
                arr1.push('<p class="ui-ellipsis-1" title="' + tagHtml + '">' + tagHtml + '</p>');
                arr1.push((item.member_balance || '') + ' ');
                arr1.push('<div title="'+(item.phone||'')+'">'+(item.phone||'')+'</div>');
                arr1.push('<div title="'+(item.mobile||'')+'">'+(item.mobile||'')+'</div>');
                arr1.push(item.name || '');
                arr1.push(item.store_name || '');
                arr1.push(item.bind_time || '');
                arr1.push(item.parent_member_id || '');
                arr1.push(item.child_count || '');
                //arr1.push(item.store_orders_num || '');
                //arr1.push(item.store_orders_amount || '');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $topBar.on('click', '.js-search-btn', function(){
        searchData.type = $topBar.find('select[name=type]').val();
        searchData.val = $topBar.find('input[name=val]').val();
        table.ajax({ select:searchData });
    });

    //导出
    var popover = new base.Popover({
        obj: $topBar.find('.js-export'),
        parent:$topBar,
        content: '<div class="export-options ui-select-custom"><p class="ui-select-custom-item" data-value="csv">csv-逗号分隔的文本文件...</p><p class="ui-select-custom-item" data-value="xls">xls-Excel文件...</p></div>',
        arrowPos: 'up',
        placement:1
    });
    $(popover).on('createEnd', function(){
        popover.$popover.on('click', '.export-options .ui-select-custom-item', function(){
            var type = $(this).data('value') || '';
            popover.remove();
            Export({
                filter: {
                    checkboxData: table.UiTable.checkboxData,
                    allData:listData,
                    name:'member_id'
                },
                form: { action : '?ctl=seller/seller&act=export', data:{ select:searchData, export_type:type} }
            });
        })
    });

    //批量打标签
    $topBar.on('click', '.js-change-tag', function(){
        var allData = table.UiTable.checkboxData;
        if(allData.length <= 0) {
            new base.promptDialog({str:'请先选择需要操作的数据', time:2000});
            return false;
        }
        var checkData = allData.length;
        var exportData = [];
        if(allData.length == 1 && allData[0] == 'all'){
            exportData = allData;
            checkData = table.data && table.data.count || allData.length;
        } else {
            $.each(allData, function(i, item){
                exportData.push(listData[item]['member_id'] || '');
            });
        }

        getTag(function(result){
            var tagHtml = '';
            $.each(result, function(i, item){
                tagHtml += '<label class="ui-checkbox mr20 mb10" style="display: inline-block;"><input type="checkbox" name="tag" value="' + (item.tag_id || '') + '"><i></i>' + (item.tag_name || '') + '</label>';
            });

            var htmls = [];
            htmls.push('<div class="p30 f12 tl dialog-change-tag">');
            htmls.push('<p class="pb20 f14">您当前正在编辑<span class="ui-color3 pl5 pr5">' + checkData + '</span>条数据。</p>');
            htmls.push('<div class="ui-block">');
            htmls.push('<p>销售员标签：</p>');
            htmls.push('<div class="w400">' + tagHtml + '</div>');
            htmls.push('</div>');
            htmls.push('</div>');

            var dialog = new base.Dialog({
                headerTxt:'批量打标签',
                style:{ padding:'0'},
                content:htmls.join(''),
                okCallback: function(){
                    dialog.saveThrough = false;
                    var checkTag = [];
                    $('.dialog-change-tag').find('input[name=tag]:checked').each(function(i, item){
                        checkTag.push($(this).val());
                    });
                    base.ajax({
                        url:'openapi.php?act=do_batch_tag',
                        type:'post',
                        data:{
                            memberId: exportData,
                            tagId:checkTag
                        },
                        success: function(data){
                            data = data || {};
                            if(data.res == 'succ'){
                                new base.promptDialog({str:(data.msg || '操作成功'), time:2000});
                                dialog.remove();
                                table.ajax({refresh: true});
                            } else {
                                new base.promptDialog({str:(data.msg || '操作失败'), time:2000});
                            }
                        }
                    });
                }
            });
        });
    });

    function getTag(callback){
        base.ajax({
            url:'openapi.php?act=getList&model=member/tags',
            type:'post',
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    callback(data.result && data.result.list || []);
                } else {
                    new base.promptDialog({str:(data.msg || '失败'), time:2000});
                }
            }
        });
    }

    module.exports = {
        init: function(){}
    }
});

