define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var Export = require('../../module/export.js');
    var Laydate = require('../../plugin/laydate/laydate.js');

    var $page = $('.page-bonus-send');
    var $listWrap = $page.find('.list-wrap');
    var $topBar = $page.find('.top-bar');
    var searchData = { handelTimeType:'', startTime:'', endTime:'', type:'' };
    var listData = [];

    Laydate({
        elem: '#startTime',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });
    Laydate({
        elem: '#endTime',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                { text:'推广员提现帐号', width:'140px' },
                { text:'手机号', width:'90px' },
                { text:'姓名' },
                { text:'店铺名' },
                { text:'申请时间', width:'130px' },
                { text:'提现金额', width:'80px' },
                { text:'用户帐号' },
                { text:'提现状态', width:'80px' },
                { text:'打款时间', width:'130px' },
                { text:'备注' }
            ]
        },
        ajaxData:{
            data:{ select:searchData },
            model: 'brokerage/drawdeposit'
        },
        renderItemFn: function(data){
            var arr = [];
            listData = data;
            $.each(data, function(i, item){
                var arr1 = [];

                arr1.push(item['l.account'] || '');
                arr1.push(item['m.mobile'] || '');
                arr1.push(item['m.name'] || '');
                arr1.push(item['m.params'] || '');
                arr1.push(item['l.create_time'] || '');
                arr1.push(item['l.money'] || '');
                arr1.push(item['m.phone'] || '');
                arr1.push(item['l.type'] || '');
                arr1.push(item['l.drawing_time'] || '');
                arr1.push(item['l.memo'] || '');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $topBar.on('click', '.js-search-btn', function(){
        searchData.handelTimeType = $topBar.find('select[name=handelTimeType]').val();
        searchData.startTime = $topBar.find('input[name=startTime]').val();
        searchData.endTime = $topBar.find('input[name=endTime]').val();
        searchData.type = $topBar.find('select[name=type]').val();
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
                    name:'id'
                },
                form: { action : '?ctl=seller/drawdeposit&act=export', data:{ select:searchData, export_type:type} }
            });
        })
    });

    //批量确认打款
    $topBar.on('click', '.js-confirm-money', function(){
        getCheckData(function(result){
            var dialog = new base.Dialog({
                content:'确认是否已打款给销售员？',
                okCallback: function(){
                    dialog.saveThrough = false;
                    batchChange({
                        editType:'drawing',
                        id:result
                    }, function(){
                        dialog.remove();
                    });
                }
            })
        });
    });

    //批量拒绝
    $topBar.on('click', '.js-refused', function(){
        getCheckData(function(result){
            var dialog = new base.Dialog({
                content:'确认是否拒绝销售员的提现请求',
                okCallback: function(){
                    dialog.saveThrough = false;
                    batchChange({
                        editType:'refuse',
                        id:result
                    }, function(){
                        dialog.remove();
                    });
                }
            })
        });
    });

    //批量备注
    $topBar.on('click', '.js-note', function(){
        getCheckData(function(result, len){
            var htmls = [];
            htmls.push('<div class="p30 f12 tl dialog-batch-memo">');
            htmls.push('<p class="pb5 f14 pl20">您当前正在编辑<span class="ui-color3 pl5 pr5">' + len + '</span>条数据。</p>');
            htmls.push('<p class="pb20 pl20 ui-color2">本操作可强制覆盖原备注，请谨慎操作。</p>');
            htmls.push('<div class="ui-block pb20"><p class="w80 pr10 tr pt5">添加备注：</p>');
            htmls.push('<div class="ui-textarea-wrap"><textarea name="memo" data-maxLen="100" class="ui-textarea w300 h100"></textarea><p class="ui-textarea-wrap-text">0/100</p></div>');
            htmls.push('</div>');
            htmls.push('</div>');

            var dialog = new base.Dialog({
                headerTxt:'批量备注',
                style:{ padding: '0'},
                content:htmls.join(''),
                okCallback: function(){
                    dialog.saveThrough = false;
                    batchChange({
                        editType:'addmemo',
                        id:result,
                        memo:$('.dialog-batch-memo').find('textarea[name=memo]').val()
                    }, function(){
                        dialog.remove();
                    });
                }
            });
        });
    });

    function getCheckData(callback){
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
                exportData.push(listData[item]['id'] || '');
            });
        }
        callback(exportData, checkData);
    }

    function batchChange(data, callback){
        base.ajax({
            url:'openapi.php?act=singleBatchEdit',
            type:'post',
            data:data,
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '操作成功'), time:2000});
                    table.ajax({refresh: true});
                    if(callback) callback();
                } else {
                    new base.promptDialog({str:(data.msg || '操作失败'), time:2000});
                }
            }
        });
    }

    module.exports = {
        init: function(){}
    }
});

