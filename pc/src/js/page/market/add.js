define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $page = $('.page-market-add');
    var $bottomBar = $page.find('.bottom-bar');
    var $goodsCat = $page.find('.goods-cat');
    var $goodInfoList = $page.find('.good-info-list');
    var goodCategoryCheckData = [];
    var productData = [];
    var postUrl = '';

    var Tabs1 = new base.Tabs({
        curIndex:0,
        parent: $page
    });

    goodCategory();
    goodsList();
    function goodCategory(){
        var listData = [];
        if(listData.length > 0){
            selectHtml();
        } else {
            base.ajax({
                url: 'index.php?ctl=template/module&act=getSearchCat',
                data: {depth:3},
                success: function(result){
                    var result = result && result.data && result.data.list || [];
                    listData = result;
                    selectHtml();
                }
            });
        }

        function selectHtml(index, data){
            index = index || 1;
            data = data || listData;
            var htmls = '';
            $.each(data, function(i, item){
                htmls += '<option data-url="' + (item.url || '') + '" value="' + (item.id || '') + '">' + (item.text || '') + '</option>';
            });
            $goodsCat.find('select[name=goodsCat' + index + ']').html('<option>请选择</option>' + htmls);
        };

        $goodsCat.on('change', 'select', function(){
            var index = $goodsCat.find('select').index($(this));
            var id = $(this).val() || '';
            postUrl = $(this).find("option:selected").data('url') || '';
            goodCategoryCheckData[index] = id;
            var childData =[];
            if(index == 0){
                childData = xx1();
            } else if(index ==1){
                childData = xx2();
            } else if(index ==2){
                childData = xx3();
            }

            if(childData.length <= 0){
                $goodsCat.children('div:gt(' + Number(index) + ')').hide();
                return false;
            }
            $goodsCat.children('div').eq(Number(index)+1).show();
            selectHtml((Number(index)+2), childData);
        });


        function xx1(){
            var dataIndex = base.utils.arrayFindkey(listData, 'id', goodCategoryCheckData[0]);
            if(dataIndex <= -1){ return false; }
            return listData[dataIndex].child || [];
        }

        function xx2(){
            var data = xx1();
            var dataIndex = base.utils.arrayFindkey(data, 'id', goodCategoryCheckData[1]);
            if(dataIndex <= -1){ return false; }
            return data[dataIndex].child || [];
        }

        function xx3(){
            var data = xx2();
            var dataIndex = base.utils.arrayFindkey(data, 'id', goodCategoryCheckData[2]);
            if(dataIndex <= -1){ return false; }
            return data[dataIndex].child || [];
        }
    }

    function goodsList(){
        var searchData = { type:'', val:'' };
        var table = new Table({
            parent:$goodInfoList.find('.list-wrap'),
            tableConfig:{
                radio: true,
                radioFn: function(data){
                    postUrl = productData[data.index].url || '';
                },
                headConfig:[
                    { text:'商品编码', width:'120px' },
                    { text:'商品名称' },
                    { text:'商品图片', width:'120px' },
                    { text:'商品分类' },
                    { text:'商品价格', width:'120px' },
                    { text:'商品库存', width:'120px' }
                ]
            },
            ajaxData:{
                data:{ select:searchData },
                pageSize:5,
                model: 'goods/products'
            },
            renderItemFn: function(data){
                var arr = [];
                productData = data;

                $.each(data, function(i, item){
                    var arr1 = [];
                    var catName = item.cat_name || '';
                    arr1.push(item.bn || '');
                    arr1.push(item.name || '');
                    arr1.push('<div class="pt5 pb5"><img style="display:block; width: 70px; height: 70px; border-radius: 5px;" src="' + (item.goods_image_default || '') + '" /></div>');
                    arr1.push('<p class="ui-ellipsis-1" title="' + catName + '">' + catName + '</p>');
                    arr1.push(Number(item.price || 0).toFixed(2));
                    arr1.push(item.store || 0);
                    arr.push(arr1);
                });
                return arr;
            }
        });

        //搜索
        $goodInfoList.on('click', '.js-search-btn', function(){
            searchData.type = $goodInfoList.find('select[name=type]').val();
            searchData.val = $goodInfoList.find('input[name=val]').val();
            table.ajax({ select:searchData });
        });
    };

    //保存
    $bottomBar.on('click', '.js-btn-save', function(){
        var index = Tabs1.index, url = '';

        if(index == 0){
            postUrl = $page.find('select[name=wPageSel]').val();
        }
        if(postUrl == ''){ return false;}
        base.ajax({
            url:'openapi.php?act=saveMarketData',
            type:'post',
            data:{ market_id:pageMarketAdd.marketId, url:postUrl },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '成功'), time:2000, callback: function(){
                        window.location.href = 'index.php?ctl=market/promotiontype&act=marketList&p[0]=' + pageMarketAdd.marketId;
                    }});
                } else {
                    new base.promptDialog({str:(data.msg || '失败'), time:2000});
                }
            }
        })
    });

    module.exports = {
        init: function(){}
    }
});

