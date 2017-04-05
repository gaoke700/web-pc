define(function (require, exports, module) {
    var $ = MJQ;

    function ajaxCategory(opts){
        var cid = opts.cid||0;
        base.ajax({
            url: 'index.php?ctl=template/module&act=getSearchCat&depth=3',
            success: function(result){
                if(opts.callback){
                    opts.callback(result.data && result.data.list || []);
                }
            }
        });
    };

    function addClassFn(obj, num){
        var $parent = obj.parent().siblings('.item-' + (num-1));
        $parent.find('.checkbox').addClass('checkbox-active');
        if(num<=0) return false;
        addClassFn($parent, (num-1));
    };

    function ajaxTag(callback){
        base.ajax({
            url: 'index.php?ctl=goods/category&act=getTags',
            data: {all:1},
            success: function(result){
                result = result && result.data && result.data.list || [];
                callback && callback(result);
            }
        });
    };

    function ChooseProductConditions(opts){
        if(opts && opts instanceof Array){
            opts = {};
        }
        this.parent = $('<div class="c-f-choose-product-conditions"></div>');
        this.dialog = null;
        this.opts = $.extend({
            tag:[],
            price: [0, 'infinity'],
            category:[
            //    {
            //        id:1,
            //        child:[
            //            {
            //                id:33,
            //                child:[
            //                    {
            //                        id:333
            //                    }
            //                ]
            //            }
            //        ]
            //    }
            ]
        }, opts||{});
        this.categoryData = [];
        this.init();
    };

    ChooseProductConditions.prototype.constructor = ChooseProductConditions;

    ChooseProductConditions.prototype.init = function(){
        var _this = this;

        if(!(this.opts.tag instanceof Array)){
            this.opts.tag = base.jsonToArray(this.opts.tag);
        }

        if(!(this.opts.price instanceof Array)){
            this.opts.price = base.jsonToArray(this.opts.price);
        }

        if(!(this.opts.category instanceof Array)){
            this.opts.category = base.jsonToArray(this.opts.category);
        }

        $.each(this.opts.tag, function(i, item){
            _this.opts.tag[i] = Number(_this.opts.tag[i]);
        });

        this.render();
        this.dialog = new base.Dialog({
            headerTxt:'按条件选取商品',
            customContent: true,
            content:this.parent,
            okCallback: function(){
                $(_this).trigger('saveEnd', [{data:_this.opts}]);
            }
        });
        this.productCategory = this.parent.find('.product-category');
        this.productPrice = this.parent.find('.product-price');
        this.productTag = this.parent.find('.product-tag');

        //添加商品分类数据
        ajaxCategory({
            callback: function(result){
                _this.categoryData = result;
                _this.productCategory.html(_this.renderCategoryHtml());

                function recursive(data, level){
                    $.each(data, function(i, item){
                        var id = Number(item.id);
                        _this.productCategory.find('.item-1').find($("[data-id=" + id + "]").find('.checkbox').addClass('checkbox-active'));
                        if(item.child){
                            recursive(item.child, (level+1));
                        }
                    });
                }

                recursive(_this.opts.category, 1);
                //
                //$.each(_this.opts.category, function(i, item){
                //    var id = Number(item.id);
                //    _this.productCategory.find('.item-1').find($("[data-id=" + id + "]").find('.checkbox').addClass('checkbox-active'));
                //});
            }
        });

        ajaxTag(function(result){
            var htmls = [];

            $.each(result, function(i, item){
                var id = item.tag_id || '';
                var name = item.tag_name || '';
                if(!id) return false;
                htmls.push('<li data-id="' + id + '"><div><span class="checked ' + (($.inArray(Number(id), _this.opts.tag) > -1) ? 'active' : '') + '"><i class="icons-tick3"></i></span><p>' + name + '</p></div></li>');
            });
            _this.productTag.find('ul').html(htmls.join(''));
        });

        this.productCategory.on('click', '.item .checkbox', function(){
            _this.productCategoryData($(this));
        });

        this.productCategory.on('click', '.item .btn-show-children', function(){
            _this.productCategoryShowChildren($(this));
        });

        this.productPrice.on('blur', 'input', function(){
            var name = $(this).attr('name');

            if(name == 'min'){
                _this.opts.price[0] = $(this).val();
            }
            if(name == 'max'){
                _this.opts.price[1] = $(this).val()||'infinity';
            }
        });

        this.productTag.on('click', '.checked', function(){
            _this.productTagFn($(this));
        })
    };

    ChooseProductConditions.prototype.render = function(){
        var htmls = [];

        htmls.push('<div class="c-f-choose-product-conditions-container">');
        htmls.push('<div class="c-f-choose-product-conditions-container-item">');
        htmls.push('<p class="c-f-choose-product-conditions-title"><i class="icons-product-category"></i><span>商品分类</span></p>');
        htmls.push('<div class="choose-1"><div class="product-category"></div></div>');
        htmls.push('</div>');

        htmls.push('<div class="c-f-choose-product-conditions-container-item">');

        htmls.push('<p class="c-f-choose-product-conditions-title"><i class="icons-price"></i><span>价格</span></p>');
        htmls.push('<div class="choose-2">');
        htmls.push('<div class="product-price">');
        htmls.push('<input type="text" name="min" value="' + (this.opts.price[0] > 0 ? this.opts.price[0] : '') + '" placeholder="最低价格" onkeyup="base.utils.clearNoNum(this)" />');
        htmls.push('<span>至</span>');
        htmls.push('<input type="text" name="max" value="' + (this.opts.price[1] != 'infinity' ? this.opts.price[1] : '') + '" placeholder="最高价格" onkeyup="base.utils.clearNoNum(this)" />');
        htmls.push('<span>元</span>');
        htmls.push('</div>');
        htmls.push('</div>');

        htmls.push('<p class="c-f-choose-product-conditions-title"><i class="icons-tag"></i><span>商品标签</span></p>');
        htmls.push('<div class="choose-2">');
        htmls.push('<div class="product-tag"><ul></ul></div>');
        htmls.push('</div>');

        htmls.push('</div>');
        htmls.push('</div>');

        this.parent.html(htmls.join(''));
    };

    ChooseProductConditions.prototype.renderCategoryHtml = function(){
        var htmls = [], _this = this;

        function recursive(data, level){
            $.each(data, function(i, item){
                var isChild = (item.child && item.child.length > 0) ? true : false;
                htmls.push('<div class="item-' + level + '-wrap">');
                var name = item.text || '', id = item.id || '';
                htmls.push('<div class="item item-' + level + '" data-id="' + id + '" data-level="' + level + '">');
                htmls.push('<span class="checkbox"><i class="icons-tick5"></i></span>');
                htmls.push('<p class="name ' + (isChild ? 'btn-show-children' : '') + '" style="' + (isChild ? '':'cursor: default;') + '">' + name + '</p>');
                if(isChild){
                    htmls.push('<span class="a-down btn-show-children"></span>');
                }
                htmls.push('</div>');
                if(isChild){
                    htmls.push('<div class="item-child-wrap" style="display: none;">');
                    htmls.push(recursive(item.child, (level+1)));
                    htmls.push('</div>');
                }
                htmls.push('</div>');
            });
        }

        recursive(this.categoryData, 1);
        return htmls.join('');
    };

    ChooseProductConditions.prototype.productCategoryShowChildren = function(obj){
        var $item = obj.parent(), $itemChildWrap = $item.siblings('.item-child-wrap');

        if($itemChildWrap.is(":hidden")){
            $itemChildWrap.show();
            $item.find('.a-down').removeClass('a-down').addClass('a-up');
        } else {
            $itemChildWrap.hide();
            $item.find('.a-up').removeClass('a-up').addClass('a-down');
        }
    };

    ChooseProductConditions.prototype.productCategoryData = function(obj){
        var $item = obj.parent(), $itemChildWrap = $item.siblings('.item-child-wrap'), _this = this;
        var id = $item.data('id'), level = $item.data('level');

        function recursiveAddClass(level){
            if(level <= 1) return false;
            obj.parents('.item-' + (level-1) + '-wrap').find('.item-' + (level-1)).find('.checkbox').addClass('checkbox-active');
            recursiveAddClass(level-1)
        }

        if(obj.hasClass('checkbox-active')){
            obj.removeClass('checkbox-active');
            $itemChildWrap.find('.checkbox').removeClass('checkbox-active');


        } else {
            obj.addClass('checkbox-active');
            $itemChildWrap.find('.checkbox').addClass('checkbox-active');
            if(level > 1){
                recursiveAddClass(level);
            }
        }

        this.getCategoryData();
    };

    ChooseProductConditions.prototype.getCategoryData = function(){
        var _this = this;
        _this.opts.category = [];
/*
        function xx1(data){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var id = $(item).data('id');
                    _this.opts.category.push({
                        id:id
                    });
                    xx2($(item).siblings('.item-child-wrap').find('.item-2'), id);
                }
            });
        }

        function xx2(data, id){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var id2 = $(item).data('id');
                    var index = base.utils.arrayFindkey(_this.opts.category, 'id', id);
                    if(!_this.opts.category[index].child){
                        _this.opts.category[index].child = [];
                    }
                    _this.opts.category[index].child.push({
                        id: id2
                    });
                    xx3($(item).siblings('.item-child-wrap').find('.item-3'), id, id2);
                }
            });
        }

        function xx3(data, id, id2){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var id3 = $(item).data('id');
                    var index = base.utils.arrayFindkey(_this.opts.category, 'id', id);
                    var index2 = base.utils.arrayFindkey(_this.opts.category[index].child, 'id', id2);
                    if(!_this.opts.category[index].child[index2].child){
                        _this.opts.category[index].child[index2].child = [];
                    }
                    _this.opts.category[index].child[index2].child.push({
                        id: id3
                    })
                }
            });
        }
*/

/*
        function xx1(data){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var id = $(item).data('id');
                    _this.opts.category.push({
                        id:id
                    });
                    xx2($(item).siblings('.item-child-wrap').find('.item-2'), [id]);
                }
            });
        }

        function xx2(data, arr){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var thisId = $(item).data('id');
                    var index = base.utils.arrayFindkey(_this.opts.category, 'id', arr[0]);
                    var childData = _this.opts.category[index];
                    if(!childData.child){
                        childData.child = [];
                    }
                    childData.child.push({
                        id: thisId
                    });
                    arr.push(thisId);
                    xx3($(item).siblings('.item-child-wrap').find('.item-3'), arr);
                }
            });
        }

        function xx3(data, arr){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var thisId = $(item).data('id');
                    var index = base.utils.arrayFindkey(_this.opts.category, 'id', arr[0]);
                    var childData = _this.opts.category[index];
                    var index2 = base.utils.arrayFindkey(childData.child, 'id', arr[1]);
                    var childData2 = childData.child[index2];
                    if(!childData2.child){
                        childData2.child = [];
                    }
                    childData2.child.push({
                        id: thisId
                    })
                }
            });
        }
*/

        function xx1(data){
            $.each(data, function(i, item){
                var arr = [];
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var thisId = $(item).data('id');
                    _this.opts.category.push({
                        id:thisId
                    });
                    arr.push(thisId);
                    xx2($(item).siblings('.item-child-wrap').find('.item-2'), arr);
                }
            });
        }

        function xx2(data, arr){
            $.each(data, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var thisId = $(item).data('id');
                    var index = [];
                    var childData = [];

                    for(var m=0; m<arr.length; m++){
                        var iIndex = base.utils.arrayFindkey(_this.opts.category, 'id', arr[m]);
                        if(iIndex > -1){
                            index.push(iIndex);
                            childData.push(_this.opts.category[index[m]]);
                        }
                    }

                    if(!childData[index.length-1].child){
                        childData[index.length-1].child = [];
                    }
                    childData[index.length-1].child.push({
                        id: thisId
                    });
                    arr.push(thisId);

                    if($(item).siblings('.item-child-wrap').find('.item-' + (arr.length + 1)).length > 0){
                        xx2($(item).siblings('.item-child-wrap').find('.item-' + (arr.length + 1)), arr);
                    }
                }
            });
        }

        xx1(_this.productCategory.find('.item-1'));
    };

    ChooseProductConditions.prototype.productTagFn = function(obj){
        var $parent = obj.parents('li');
        var id = $parent.data('id');
        var index = $.inArray(String(id), this.opts.tag) > -1 ? $.inArray(String(id), this.opts.tag) : $.inArray(id, this.opts.tag);

        if(obj.hasClass('active')){
            obj.removeClass('active');
            if(index > -1){
                this.opts.tag.splice(index, 1);
            }
        } else {
            obj.addClass('active');
            if(index < 0){
                this.opts.tag.push(id);
            }
        }
    };

    module.exports = ChooseProductConditions;
});
