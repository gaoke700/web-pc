define(function (require, exports, module) {
    var Table = require('../../../module/table.js');

    var $page = $('.page-oplog-index');
    var $listWrap = $page.find('.list-wrap');
    var $topBar = $page.find('.top-bar');
    var searchData = { type:'', val:'' };
    var listData = [];

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'日志ID', width:'210px' },
                { text:'操作人'},
                { text:'操作时间'},
                { text:'ip地址'},
                { text:'方法名'},
                { text:'工作组'},
                { text:'操作方法'}
            ]
        },
        ajaxData:{
            data:{ select:searchData },
            model: 'system/oplog'
        },
        renderItemFn: function(data){
            var arr = [];
            listData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item._id || {};
                arr1.push(id.$id || '');
                arr1.push(item.op_name || '');
                arr1.push(item.time || '');
                arr1.push(item.ip || '');
                arr1.push(item.op_zh || '');
                arr1.push(item.workgroup || '');
                arr1.push(item.op_act || '');
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

    module.exports = {
        init: function(){}
    }
});

