define(function (require, exports, module) {
    //离开页面出提示
    //window.addEventListener("beforeunload", function(e) {
    //    var confirmationMessage = "\o/";
    //    (e || window.event).returnValue = confirmationMessage; // Gecko and Trident
    //    return confirmationMessage; // Gecko and WebKit
    //});

    require('../common/jquery-plugin/pagination2.js')($);
    var UiTable = require('../module/ui-table.js');
    var Table = require('../module/table.js');
    var Laydate = require('../plugin/laydate/laydate.js');
    var UiRadioSlide= require('../module/ui-radio-slide');

    var $pageUiDemo = $('.page-ui-demo');

    //分页
    var paginationArr = ['left', 'center', 'right'];
    $.each($pageUiDemo.find('.pagination'), function(i, item){
        $(item).Paging2({
            pagesize: 10,
            count: 200,
            alignment:paginationArr[i],
            current: 5,
            toolbar:true,
            callback: function(page, size, count){
            }
        })
    });

    var table1 = new UiTable({
        parent:$('.table-demo1'),
        headConfig:[
            { width:'100px', text:'商品编码111' },
            { text:'商品名称' },
            { width:'100px', text:'商品图片' },
            { width:'100px', text:'商品分类' },
            { width:'200px', text:'商品价格' }
        ],
        bodyHtml: [
            ['编码1', '<p>名称</p>', '<p>图片</p>', '<p>分类</p>', '<p>价格</p>'],
            ['编码2', '<p>名称</p>', '<p>图片</p>', '<p>分类</p>', '<p>价格</p>'],
            ['编码3', '<p>名称</p>', '<p>图片</p>', '<p>分类</p>', '<p>价格</p>'],
            ['编码4', '<p>名称</p>', '<p>图片</p>', '<p>分类</p>', '<p>价格</p>']
        ]
    });

    new Table({
        parent:$pageUiDemo.find('.table-demo2'),
        tableConfig:{
            checkbox: true,
            headConfig:[
                { width:'200px', text:'商品编码111' },
                { text:'商品名称' },
                { width:'300px', text:'商品图片' },
                { width:'100px', text:'商品分类' },
                { width:'200px', text:'商品价格' }
            ]
        },
        ajaxData:{  model: 'goods/products' },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                arr1.push(1);
                arr1.push(2);
                arr1.push(3);
                arr1.push(4);
                arr1.push(5);
                arr.push(arr1);
            });

            return arr;
        }
    });

    new base.Popover({
        obj:$('.popover-item'),
        content:'right',
        arrowPos:'right',
        event:'hover'
    });
    new base.Popover({
        obj:$('.popover-item2'),
        content:'down',
        arrowPos:'down',
        event:'click'
    });
    new base.Popover({
        obj:$('.popover-item3'),
        content:'up',
        arrowPos:'up',
        event:'click'
    });
    new base.Popover({
        obj:$('.popover-item4'),
        content:'left',
        arrowPos:'left',
        event:'click'
    });


    Laydate({
        elem: '#startTime1',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });
    Laydate({
        elem: '#endTime1',
        event: 'focus',
        format: 'YYYY-MM-DD',
        istime: true,
        //min: Laydate.now(),
        festival: true
    });

    //单选开关
    (function(){
        var uiRadioSlide=new UiRadioSlide({
            checkTxt:{ on:'开', off:'关' },
            status:'on',//默认开启还是关闭(默认关闭)  'off'  'on'
            isHand: false,
            clickCallback:function(obj){//点击时的回调
            }
        });
        $('#ui-radio-switch-type4').append(uiRadioSlide.parent);
    })();

    //手动创建的tabs
    var Tabs1 = new base.Tabs({
        curIndex:0,
        parent: $('.tabs-demo1')
    });
    Tabs1.changeContent({
        index:2,
        content:'这是动态修改的内容',
        callback: function(){
            console.log('动态修改内容完成');
        }
    });
    $(Tabs1).on('changeBefore', function(){
        if(arguments[1].index == 3){
            Tabs1.change({index:1});
            Tabs1.isChange = false;
        } else {
            Tabs1.isChange = true;
        }
    });

    //自动创建的tabs
    new base.Tabs({
        parent: $('.tabs-demo2'),
        curIndex:1,
        autoCreate: true,
        autoCreateConfig:{
            menu:['自动创建的按钮一', '自动创建的按钮二', '自动创建的按钮三'],
            content: ['内容一', '内容二', '内容三'],
            createCallback: function(){
                console.log('创建好了')
            }
        }
    });

    module.exports = {
        init: function(){}
    };
});

