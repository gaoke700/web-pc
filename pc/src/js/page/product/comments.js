define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var getCommentDetail=require('../../module/dialog/comment-manage');

    var $pageProductComments = $('.page-product-comments');
    var $topBar = $pageProductComments.find('.top-bar');
    var $jsSearchSelect = $topBar.find('.js-search-select');
    var $jsSearchValue = $topBar.find('.js-search-value');
    var $commentsWrap = $pageProductComments.find('.comments-wrap');
    var searchData = {type:'', val:''};

    //创建表格列表
    var tagTable = new Table({
        parent:$commentsWrap,
        tableConfig:{
            headConfig:[
                { text:'商品编号', width:'200px' },
                { text:'商品名称' },
                { text:'评论时间', sort:true, name:'create_time', width:'200px' },
                { text:'评论内容' },
                { text:'前台是否显示', width:'120px'  },
                { text:'评论人', width:'120px'  },
                { text:'操作', width:'80px' }
            ]
        },
        ajaxData:{
            model: 'goods/comments'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                arr1.push(item.bn || '');
                arr1.push('<p class="text1">' + (item.goods_name || '') + '</p>');
                arr1.push(item.create_time || '');
                arr1.push('<p class="text1">' + (item.details || '') + '</p>');
                arr1.push(item.is_disabled || 0);
                arr1.push(item.member_name || '');
                arr1.push('<a class="js-look" data-id="' + (item.id || '') + '" href="javascript:;">查看</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //搜索
    $topBar.on('click', '.js-search-btn', function(){
        searchData.type = $jsSearchSelect.val();
        searchData.val = $jsSearchValue.val();
        tagTable.ajax({ select:searchData });
    });

    //查看
    var isLook=true;
    $commentsWrap.on('click', '.js-look', function(){
        if(isLook){
            isLook=false;
            var id = $(this).data('id');
            new getCommentDetail({commentId:id,closeCallback:function(){
                isLook=true;
            }});
        }
    });

    module.exports = {
        init: function(){}
    }
});

