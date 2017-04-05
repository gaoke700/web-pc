define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var ProductCategory = require('../../module/dialog/product-category.js');
    var productCategoryData = [];

    var $pageProductIndex = $('.page-product-index');
    var $productSeniorSearch = $pageProductIndex.find('.product-senior-search');
    var $orderListWrap = $pageProductIndex.find('.order-list-wrap');
    var $smallBar = $pageProductIndex.find('.small-bar');
    var ajaxModel = 'goods/products';
    var productData = [];

    var searchData = {
        bn:'',  //商品编号
        p_bn:'',    //货号
        name:'',    //商品名称
        marketable:true,  //上下架状态  true,false
        tag:[],     //标签ID
        category:[]  //分类
    };

    tagCheck();

    base.bus.setSidebar3Num({model:ajaxModel});

    //创建表格列表
    var table = new Table({
        parent:$orderListWrap,
        tableConfig:{
            checkbox: true,
            headConfig:[
                {
                    text:'排序',
                    width:'100px',
                    change: true,
                    changeType: 'number',
                    changeMaxWidth:'50px',
                    changeFn: function(data){
                        changeDOrder(data || {});
                    }
                },
                { text:'商品图片', width:'90px' },
                { text:'商品名称' },
                { text:'价格' },
                { text:'库存' },
                { text:'来源' },
                { text:'上架时间' },
                //{ text:'状态' },
                { text:'参与会员折扣', width:'110px' },
                { text:'操作' }
            ]
        },
        ajaxData:{
            data:{
                select:searchData,
                view:pageProductIndex.view
            },
            model: ajaxModel
        },
        renderItemFn: function(data){
            var arr = [];
            productData = data;

            $.each(data, function(i, item){
                var arr1 = [];
                var salesStatus = item.sales_status || '';
                var columnText = '<div class="good-name"><p>商品编号' + (item.bn || '') + '</p><p class="ellipsis">' + (item.name || '') + '</p></div>';
                var goodsId = item.goods_id || '';
                var delStr = '';
                arr1.push(item.d_order || '');
                arr1.push('<div class="pt5 pb5"><img class="img" src="' + (item.goods_image_default || '') + '" /></div>');
                arr1.push(columnText);
                arr1.push(item.price || 0);
                arr1.push(item.store || 0);
                arr1.push(item.source || '');
                arr1.push(item.uptime || '');
                //arr1.push(salesStatus == '在售' ? ('<span class="ui-color4">' + salesStatus + '</span>') : salesStatus);
                arr1.push(item.allow_discount || '');
                if(pageProductIndex.view == 2){
                    delStr += '<a class="js-del ml10" data-id="' + goodsId + '" href="javascript:;">删除</a>';
                }
                arr1.push('<a href="index.php?ctl=goods/product&act=edit&p[0]=' + goodsId + '&pop=true">编辑</a><a data-url="' + (item.pUrl || '') + '" data-qr="' + (item.qr || '') + '" class="ml10 js-btn-preview" href="javascript:;">预览</a>' + delStr);
                arr.push(arr1);
            });
            return arr;
        },
        renderItemCallback: function(){
            $.each($orderListWrap.find('.js-btn-preview'), function(i, item){
                var html = '';
                html += '<div class="order-list-preview">';
                html += '<img src="' + ($(item).data('qr')||'') + '" />';
                html += '<div class="text"><p>扫一扫，手机预览</p><a class="ui-btn ui-btn-c-1" href="' + ($(item).data('url')||'javascript:;') + '" target="_blank">PC预览</a></div>';
                html += '</div>';
                new base.Popover({
                    obj: $(item),
                    parent:$pageProductIndex,
                    content: html,
                    arrowPos: 'up',
                    placement:3,
                    event: 'hover'
                });
            });
        }
    });

    //搜索
    $pageProductIndex.on('click', '.js-btn-search-product', function(){
        getSearchData();
        table.ajax({ select:searchData });
    });

    //删除
    $pageProductIndex.on('click', '.js-del', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false;}
        new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                base.ajax({
                    url:'openapi.php?act=delete',
                    type:'post',
                    data: { id:id, model:ajaxModel },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            base.bus.setSidebar3Num({model:ajaxModel});
                            new base.promptDialog({str:(data.msg || '操作成功'), time:2000});
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '操作失败'), time:2000});
                        }
                    }
                });
            }
        })
    });

    //选择分类
    $pageProductIndex.on('click', '.js-btn-choose-category', function(){
        var _this = $(this);
        var productCategory = new ProductCategory();
        $(productCategory).on('saveEnd', function(){
            productCategoryData = arguments[1].data.category;
            var html = '';
            xx(productCategoryData);
            function xx(data){
                $.each(data, function(i, item){
                    xx2(item);
                });
            };
            function xx2(data){
                if(data.child){
                    xx(data.child);
                } else {
                    html += '<label class="ui-checkbox ui-senior-search-label" style="cursor: default;"><input name="category" type="checkbox" checked value="all" disabled><i></i>' + data.text + '</label>';
                }
            }
            _this.next('div').html(html);
        });
    });

    //批量操作
    $smallBar.on('click', '.js-btn-batch-change', function(){
        var arr = getCheckData();
        if(arr.length <= 0){
            new base.Dialog({ content: '请先从列表中打勾选择需要操作的记录！', type: 'alert' });
            return false;
        }

        var btnType = $(this).data('type') || '';
        //category:分类, status:上下架, sort:排序, tag:标签, discount:参与会员折扣

        batchDialog({
            type: btnType,
            num: ((arr.length ==1 && arr[0] == 'all') ? table.data.count : arr.length),
            goods_ids:arr
        });
    });

    //批量处理弹窗的html
    var batchDialogHtml = {
        status: function(callback){
            var htmls = [];
            htmls.push('<p class="f12">警告：本操作可强制使所选商品上下架，请谨慎操作。</p>');
            htmls.push('<div style="padding: 20px; padding-bottom: 0;"><label class="ui-radio"><input type="radio" name="marketable" value="1" checked><i></i>上架</label></div>');
            htmls.push('<div style="padding: 20px;"><label class="ui-radio"><input type="radio" name="marketable" value="0"><i></i>下架</label></div>');
            if(callback) callback(htmls.join(''));
        },
        sort: function(callback){
            var htmls = [];
            htmls.push('<p class="f12">小技巧：批量修改排序可让所选商品排序整体前移、后移。序号越小越靠前</p>');
            htmls.push('<div style="padding: 20px; padding-bottom: 0;"><span class="pr20 f12">统一修改排序</span><input class="ui-input" type="number" name="dorder" value=""></div>');
            if(callback) callback(htmls.join(''));
        },
        discount: function(callback){
            var htmls = [];
            htmls.push('<p class="f12">警告：本操作可强制使所选商品参与会员折扣，请谨慎操作。</p>');
            htmls.push('<div style="padding: 20px; padding-bottom: 0;"><label class="ui-radio"><input type="radio" name="setdiscount" value="1" checked><i></i>参与</label></div>');
            htmls.push('<div style="padding: 20px;"><label class="ui-radio"><input type="radio" name="setdiscount" value="0"><i></i>不参与</label></div>');
            if(callback) callback(htmls.join(''));
        },
        tag: function(callback){
            base.ajax({
                url:'openapi.php?act=goodsTagCatList',
                type:'post',
                data:{
                    model:ajaxModel,
                    data: { type: 'tag' }
                },
                success: function(result){
                    result = result || {};
                    if(result.res == 'succ'){
                        var labelHtml = '';
                        $.each((result.result || []), function(i, item){
                            labelHtml += '<label class="ui-checkbox" style="display: inline-block; margin-right: 10px;"><input type="checkbox" name="settag" value="' + (item.tag_id || '') + '"><i></i>' + (item.tag_name || '') + '</label>';
                        });

                        var htmls = [];
                        htmls.push('<div class="f12" style="padding: 20px; display: -webkit-box;">');
                        htmls.push('<div style="width: 100px; text-align: right;">商品标签：</div>');
                        htmls.push('<div style="-webkit-box-flex: 1; height: 230px; overflow-y: auto; display: -webkit-box;">');
                        htmls.push(labelHtml);
                        htmls.push('</div>');
                        htmls.push('</div>');
                        if(callback) callback(htmls.join(''));
                    }
                }
            });
        }
    };

    //批量处理弹窗的操作
    function batchDialog(opts){
        opts.num = opts.num || 0;
        opts.type = opts.type || '';
        opts.goods_ids = opts.goods_ids || '';
        var $productDialog = $('<div class="product-dialog" style="width: 700px; height: 300px; padding: 20px; line-height: 25px;"></div>');

        var arrJson = {
            discount: {
                headerTxt:'批量参与会员折扣',
                updateAct:'setdiscount',
                val:function(){
                    return $productDialog.find('input[name=setdiscount]:checked').val();
                }
            },
            sort: {
                headerTxt:'批量修改商品排序',
                updateAct:'dorder',
                val:function(){
                    return $productDialog.find('input[name=dorder]').val();
                }
            },
            status: {
                headerTxt:'商品上下架',
                updateAct:'marketable',
                val:function(){
                    return $productDialog.find('input[name=marketable]:checked').val();
                }
            },
            tag: {
                headerTxt:'批量修改商品标签',
                updateAct:'settag',
                val:function(){
                    var arr = [];
                    $productDialog.find('input[name=settag]:checked').each(function(){
                        arr.push($(this).val());
                    });
                    return arr;
                }
            },
            category: {
                headerTxt:'商品分类',
                updateAct:'setcat',
                val:function(){
                    return '';
                }
            }
        };

        if(opts.type == 'category'){
            var changeCategory = new ProductCategory({
                headerTxt:'修改商品分类'
            });
            $(changeCategory).on('saveEnd', function(){
                productCategoryData = arguments[1].data.category;
                postChangeData(productCategoryData);
            });
        } else {
            batchDialogHtml[opts.type](function(callbackHtml){
                $productDialog.html('<p>正在编辑<span class="pl5 pr5" style="font-weight: bold;">' + opts.num  + '</span>条数据</p>' + callbackHtml);
                var dialog = new base.Dialog({
                    headerTxt:(arrJson[opts.type].headerTxt || '批量处理'),
                    btnOkTxt:'保存',
                    content:$productDialog,
                    customContent: true,
                    okCallback: function(){
                        dialog.saveThrough = false;
                        postChangeData(arrJson[opts.type].val(), function(){
                            dialog.remove();
                        });
                    }
                });
            });
        }

        function postChangeData(val, callback){
            base.ajax({
                url:'openapi.php?act=nextSaveBatchEdit',
                type:'post',
                data:{
                    model:ajaxModel,
                    data: {
                        updateAct: arrJson[opts.type].updateAct,
                        val:val,
                        goods_ids: opts.goods_ids,
                        select:searchData
                    }
                },
                success: function(result){
                    result = result || {};
                    if(result.res == 'succ'){
                        base.promptDialog({str:(result.msg || '批处理成功'), time:2000});
                        table.ajax({refresh: true});
                        if(opts.type == 'status'){
                            base.bus.setSidebar3Num({model:ajaxModel});
                        }
                        if(callback) callback();
                    } else {
                        base.promptDialog({str:(result.msg || '批处理发生错误'), time:2000})
                    }
                }
            })
        }
    };

    //获取多选的数据
    function getCheckData(){
        var checkArr = table.UiTable.checkboxData;

        if(checkArr.length <=0 ){ return []};

        var checkData = [];
        if(checkArr.length == 1 && checkArr[0] == 'all'){
            checkData = checkArr;
        } else {
            $.each(checkArr, function(i, item){
                checkData.push(productData[item].goods_id);
            });
        }

        return checkData;
    }

    //获取搜索字段
    function getSearchData(){
        var tagVal = [];
        $.each($productSeniorSearch.find('input[name=tag]'), function(i, item){
            if($(item).is(':checked')){
                tagVal.push($(item).val());
            }
        });

        searchData.bn = $productSeniorSearch.find('input[name=bn]').val();
        searchData.p_bn = $productSeniorSearch.find('input[name=p_bn]').val();
        searchData.name = $productSeniorSearch.find('input[name=name]').val();
        searchData.marketable = $productSeniorSearch.find('input[name=marketable]:checked').val();
        searchData.tag = tagVal;
        searchData.category = productCategoryData;
    };

    //搜索标签全选
    function tagCheck(){
        $productSeniorSearch.on('click', 'input[name=tag]', function(){
            if($(this).val() == 'all'){
                if($(this).is(':checked')){
                    $productSeniorSearch.find('input[name=tag]').prop('checked', true);
                } else {
                    $productSeniorSearch.find('input[name=tag]').prop('checked', false);
                }
            } else {
                if($(this).is(':checked')){
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                    $productSeniorSearch.find('input[name=tag]').eq(0).prop('checked', false);
                }
            }
        });
    }

    //修改单个商品排序
    function changeDOrder(result){
        base.ajax({
            url:'openapi.php?act=update',
            type:'post',
            data:{
                model:ajaxModel,
                id: (result.data.id || ''),
                data:{
                    d_order: (result.newStr || '')
                }
            },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    result.succ(true);
                }
            }
        })
    }


    module.exports = {
        init: function(){}
    }
});

