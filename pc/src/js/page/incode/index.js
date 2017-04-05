define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var Laydate = require('../../plugin/laydate/laydate.js');

    var $page = $('.page-incode-index');
    var $incodeListWrap = $page.find('.incode-list-wrap');
    var $incodeListSearch = $page.find('.incode-list-search');

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

    var searchData = {
        s_time:'',              //验证时间(开始)
        e_time:'',              //验证时间(结束)
        store_id:'',            //验证门店
        incode:''               //提货码
    };

    //创建表格列表
    var table = new Table({
        parent:$incodeListWrap,
        tableConfig:{
            headConfig:[
                { text:'关联订单编号' },
                { text:'验证门店' },
                { text:'验证提货码' },
                { text:'操作人' },
                { text:'验证时间' }
            ]
        },
        ajaxData:{
            data:{ select:searchData },
            model: 'store/incode'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                arr1.push(item.order_id || '');
                arr1.push(item.store_id || '');
                arr1.push(item.incode || '');
                arr1.push(item.operater || '');
                arr1.push(item.finsh_time);
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $incodeListSearch.on('click', '.js-btn-search', function(){
        getSearchData();
        table.ajax({ select:searchData });
    });

    //获取搜索字段
    function getSearchData(){
        searchData.s_time = $incodeListSearch.find('input[name=s_time]').val();
        searchData.e_time = $incodeListSearch.find('input[name=e_time]').val();
        searchData.store_id = $incodeListSearch.find('select[name=store_id]').val();
        searchData.incode = $incodeListSearch.find('input[name=incode]').val();
    };

    module.exports = {
        init: function(){}
    }
});

