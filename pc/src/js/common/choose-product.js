define(function (require, exports, module) {
    var $ = MJQ;
    require('./jquery-plugin/pagination.js')($);

    function renderProductList(data){
        var htmls = [], data = data||[];
        $.each(data, function(i, item){
            var bn = item.bn || '';
            var goodsId = item.goods_id || '';
            var name = item.name || '';
            var thumbnailPic = item.thumbnail_pic || '';
            var price = Number(item.price || 0).toFixed(2);
            var store = item.store || 0;
            var catId = item.cat_id || 0;
            var catName = item.cat_name || '';
            var url = item.url || '';

            htmls.push('<div class="c-table-body-item" data-url="' + url + '" data-id="' + goodsId + '">');
            htmls.push('<div class="c-table-list span-1"><input type="checkbox" name="product"></div>');
            htmls.push('<div class="c-table-list span-4">' + bn + '</div>');
            htmls.push('<div class="c-table-list width-auto"><p class="name">' + name + '</p></div>');
            htmls.push('<div class="c-table-list span-2"><img class="img" src="' + thumbnailPic + '"></div>');
            htmls.push('<div class="c-table-list span-3">' + catName + '</div>');
            htmls.push('<div class="c-table-list span-2">' + price + '</div>');
            htmls.push('<div class="c-table-list span-2">' + store + '</div>');
            htmls.push('</div>');
        });
        return htmls.join('');
    }

    function ajaxData(opts){
        var pageNum = opts.pageNum || 1;
        var callback = opts.callback || null;
        var obj = opts.obj || null;

        var data = {
            pageNo:pageNum||1,
            pageSize:7
        };
        data[opts.key||''] = opts.value||'';

        base.ajax({
            url: 'index.php?ctl=template/module&act=getSearchGoods',
            data: data,
            success: function(result){
                var result = result.data || {};
                var count = result.count || 0;
                obj.find('.product-list-wrap').html(renderProductList(result.list||[]));
                obj.find('.check-all').prop("checked",false);
                if(callback){
                    callback(result, count);
                }
            }
        });
    };

    function pagingFn(obj, key, value, callback){
        if(!obj) return false;
        var pageNum = 1;

        ajaxData({
            pageNum: pageNum,
            obj: obj,
            key:key||'',
            value:value||'',
            callback: function(data, count){
                if(callback) callback();
                obj.siblings('.pagination').html('');
                obj.siblings('.pagination').Paging({
                    pagesize: 7,
                    count: count,
                    toolbar:true,
                    callback: function(page, size, count){
                        pageNum = page;
                        ajaxData({
                            pageNum: pageNum,
                            obj: obj,
                            callback: function(){
                                if(callback) callback();
                            }
                        });
                    }
                });
            }
        });
    };

    function ChooseProduct(opts){
        this.parent = $('<div class="c-f-choose-product"></div>');
        this.opts = $.extend({
            data: []
        }, opts||{});
        this.dialog = null;
        this.data = [];
        this.init();
    };

    ChooseProduct.prototype.constructor = ChooseProduct;

    ChooseProduct.prototype.init = function(){
        var _this = this;

        if(!(this.opts.data instanceof Array)){
            this.opts.data = base.jsonToArray(this.opts.data);
        }

        this.render();
        this.productBar = this.parent.find('.c-f-choose-product-bar');
        this.productListWrap = this.parent.find('.c-f-choose-product-list');

        if(this.opts.data.length > 0){
            pagingFn(_this.productListWrap, 'goods_id', this.opts.data);
        } else {
            pagingFn(this.productListWrap);
        };

        this.dialog = new base.Dialog({
            headerTxt:'手动添加商品',
            customContent: true,
            content:this.parent,
            btnOkTxt:'保存',
            okCallback: function(){
                $(_this).trigger('saveEnd', [{data:_this.data}]);
            }
        });

        this.productBar.on('click', '.js-btn-ok', function(){
            if($(this).data('status') != true) return false;

            var $that = $(this);
            $(this).data('status', false);
            var key = _this.productBar.find('.choose-key').data('value');
            var value = _this.productBar.find('.js-input-val').val();
            pagingFn(_this.productListWrap, key, value, function(){
                $that.data('status', true);
            });
        });

        this.productListWrap.on('click', '.product-list-wrap input[name=product]', function(){
            _this.checkItem($(this));
        });

        this.productListWrap.on('click', '.check-all', function(){
            _this.checkAll($(this));
        });
    };

    ChooseProduct.prototype.render = function(){
        var htmls = [];

        htmls.push('<div class="c-f-choose-product-bar">');
        htmls.push('<div class="func">');

        htmls.push('<div class="c-select choose-key" data-value="name" style="width: 130px;">');
        htmls.push('<div class="c-select-title"><p>商品名称</p><span><i></i></span></div>');
        htmls.push('<div class="c-select-option-wrap">');
        htmls.push('<div class="c-select-option" data-value="name">商品名称</div>');
        htmls.push('<div class="c-select-option" data-value="bn">商品编号</div>');
        htmls.push('<div class="c-select-option" data-value="pbn">商品货号</div>');
        htmls.push('</div>');
        htmls.push('</div>');

        htmls.push('<input class="input-val js-input-val" type="text" placeholder="搜索你想找的商品">');
        htmls.push('<span class="btn-ok js-btn-ok" data-status="true">搜索</span>');
        htmls.push('</div>');
        htmls.push('<div class="product-count">商品库<span>' + this.opts.data.length + '</span>件</div>');
        htmls.push('</div>');

        htmls.push('<div class="c-table c-f-choose-product-list">');
        htmls.push('<div class="c-table-head">');
        htmls.push('<div class="c-table-list span-1"><input class="check-all" type="checkbox" name="product"></div>');
        htmls.push('<div class="c-table-list span-4">商品编码</div>');
        htmls.push('<div class="c-table-list width-auto">商品名称</div>');
        htmls.push('<div class="c-table-list span-2">商品图片</div>');
        htmls.push('<div class="c-table-list span-3">商品分类</div>');
        htmls.push('<div class="c-table-list span-2">商品价格</div>');
        htmls.push('<div class="c-table-list span-2">商品库存</div>');
        htmls.push('</div>');
        htmls.push('<div class="c-table-body product-list-wrap"></div>');
        htmls.push('</div>');

        htmls.push('<div class="pagination"></div>');

        this.parent.html(htmls.join(''));
    };

    ChooseProduct.prototype.checkItem = function(obj){
        var $item = obj.parents('.c-table-body-item');
        var id = $item.data('id');
        var index = $.inArray(id, this.data);

        if(obj.is(':checked')){
            if(index < 0){
                this.data.push(id);
            }
        } else {
            this.productListWrap.find('.check-all').prop("checked",false);
            if(index > -1){
                this.data.splice(index, 1);
            }
        }
        this.productBar.find('.product-count span').html(this.data.length);
    };

    ChooseProduct.prototype.checkAll = function(obj){
        var _this = this;
        var $item = this.productListWrap.find('.product-list-wrap input[name=product]');
        if(obj.is(':checked')){
            $item.prop("checked",true);
        } else {
            $item.prop("checked",false);
        }
        $.each($item, function(i, item){
            _this.checkItem($(item));
        })
    };

    module.exports = ChooseProduct;
});
