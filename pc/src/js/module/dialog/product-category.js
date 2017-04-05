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

    function ChooseProductCategory(opts){
        if(opts && opts instanceof Array){
            opts = {};
        }
        this.parent = $('<div class="c-f-choose-product-conditions"></div>');
        this.dialog = null;
        this.opts = $.extend({
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

    ChooseProductCategory.prototype.constructor = ChooseProductCategory;

    ChooseProductCategory.prototype.init = function(){
        var _this = this;
        if(!(this.opts.category instanceof Array)){
            this.opts.category = base.jsonToArray(this.opts.category);
        }

        this.render();
        this.dialog = new base.Dialog({
            headerTxt:(this.opts.headerTxt || '选择商品分类'),
            customContent: true,
            content:this.parent,
            okCallback: function(){
                $(_this).trigger('saveEnd', [{data:_this.opts}]);
            }
        });
        this.productCategory = this.parent.find('.product-category');

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
            }
        });

        this.productCategory.on('click', '.item .checkbox', function(){
            _this.productCategoryData($(this));
        });

        this.productCategory.on('click', '.item .btn-show-children', function(){
            _this.productCategoryShowChildren($(this));
        });
    };

    ChooseProductCategory.prototype.render = function(){
        var htmls = [];

        htmls.push('<div class="c-f-choose-product-conditions-container">');
        htmls.push('<div class="c-f-choose-product-conditions-container-item">');
        htmls.push('<div class="choose-1"><div class="product-category"></div></div>');
        htmls.push('</div>');
        htmls.push('</div>');

        this.parent.html(htmls.join(''));
    };

    ChooseProductCategory.prototype.renderCategoryHtml = function(){
        var htmls = [], _this = this;

        function recursive(data, level){
            $.each(data, function(i, item){
                var isChild = (item.child && item.child.length > 0) ? true : false;
                htmls.push('<div class="item-' + level + '-wrap">');
                var name = item.text || '', id = item.id || '';
                htmls.push('<div class="item item-' + level + '" data-text="' + name + '" data-id="' + id + '" data-level="' + level + '" style="font-size: 12px; height: 35px; line-height: 35px; overflow: hidden;">');
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

    ChooseProductCategory.prototype.productCategoryShowChildren = function(obj){
        var $item = obj.parent(), $itemChildWrap = $item.siblings('.item-child-wrap');

        if($itemChildWrap.is(":hidden")){
            $itemChildWrap.show();
            $item.find('.a-down').removeClass('a-down').addClass('a-up');
        } else {
            $itemChildWrap.hide();
            $item.find('.a-up').removeClass('a-up').addClass('a-down');
        }
    };

    ChooseProductCategory.prototype.productCategoryData = function(obj){
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

    ChooseProductCategory.prototype.getCategoryData = function(){
        var _this = this;
        _this.opts.category = [];

        function xx1(dom){
            var arr = [];
            $.each(dom, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var data = {
                        id:$(item).data('id'),
                        text:$(item).data('text')
                    };
                    var childData = xx2($(item).next('.item-child-wrap').find('.item-2'));
                    if(childData.length > 0){
                        data.child = childData;
                    }
                    arr.push(data);
                }
            });
            return arr;
        }

        function xx2(dom){
            var arr = [];
            $.each(dom, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var data = {
                        id:$(item).data('id'),
                        text:$(item).data('text')
                    };
                    var childData = xx3($(item).next('.item-child-wrap').find('.item-3'));
                    if(childData.length > 0){
                        data.child = childData;
                    }
                    arr.push(data);
                }
            });
            return arr;
        }

        function xx3(dom){
            var arr = [];
            $.each(dom, function(i, item){
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var thisId = $(item).data('id');
                    var text = $(item).data('text');
                    arr.push({ id:thisId, text:text });
                }
            });
            return arr;
        };

        _this.opts.category = xx1(_this.productCategory.find('.item-1'));

/*
        function xx1(data){
            $.each(data, function(i, item){
                var arr = [];
                if($(item).find('.checkbox').hasClass('checkbox-active')){
                    var thisId = $(item).data('id');
                    var text = $(item).data('text');
                    _this.opts.category.push({
                        id:thisId,
                        text:text
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
                    var text = $(item).data('text');
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
                        id: thisId,
                        text:text
                    });
                    arr.push(thisId);

                    if($(item).siblings('.item-child-wrap').find('.item-' + (arr.length + 1)).length > 0){
                        xx2($(item).siblings('.item-child-wrap').find('.item-' + (arr.length + 1)), arr);
                    }
                }
            });
        }

        xx1(_this.productCategory.find('.item-1'));
*/
    };

    module.exports = ChooseProductCategory;
});
