define(function (require, exports, module) {
    var $ = MJQ;
    function arrayFindKey(data, key, value){
        for(var i=0; i<data.length; i++){
            if(data[i][key] == value){
                return i;
            }
        }
    }

    function GoodsCategory(opts){
        this.opts = $.extend({
            url:'',
            arr:[]
        }, opts||{});
        this.parent = $('<div class="goods-category-page-wrap"></div>');
        this.data = [];

        this.defaultData = ['all'];
        this.requestData = [];
        this.listId = null;
        this.init();
    };

    GoodsCategory.prototype.constructor = GoodsCategory;

    GoodsCategory.prototype.init = function(){
        var _this = this;

        if(!(this.opts.arr instanceof Array)){
            this.opts.arr = base.jsonToArray(this.opts.arr);
        }

        if(this.opts.arr.length > 0){
            _this.defaultData = [];
            for(var i=0; i<_this.opts.arr.length; i++){
                _this.defaultData.push(_this.opts.arr[i].id)
            }
        }
    };

    GoodsCategory.prototype.render = function(){
        var htmls = [], _this = this;

        htmls.push('<div class="goods-category-list">');
        $.each(['一', '二', '三'], function(i, item){
            if(_this.opts.arr.length > 0){
                htmls.push('<dl style="display: ' + (i < (_this.opts.arr.length) ? 'block' : 'none') + ';"><dt>' + item + '级分类</dt>');
                htmls.push('<dd class="js-choose" data-value="' + (i+1) +'"><p>' + (i < (_this.opts.arr.length) ? (_this.opts.arr[i].text) : '请选择分类名称') + '</p><span><i class="icons-arrow-up-1"></i></span></dd>');
            } else {
                htmls.push('<dl style="display: ' + (i == 0 ? 'block' : 'none') + ';"><dt>' + item + '级分类</dt>');
                htmls.push('<dd class="js-choose" data-value="' + (i+1) +'"><p>请选择分类名称</p><span><i class="icons-arrow-up-1"></i></span></dd>');
            }
            htmls.push('</dl>');
        });
        htmls.push('</div>');
        htmls.push('<div class="goods-category-value">');
        $.each(['一', '二', '三'], function(i, item){
            htmls.push('<div class="goods-category-value-item goods-category-value-' + (i+1) + '" data-value="' + (i+1) + '"><ul></ul></div>');
        });
        htmls.push('</div>');
        this.parent.html(htmls.join(''));
        this.listWrap = this.parent.find('.goods-category-list');
        this.valueWrap = this.parent.find('.goods-category-value');

        this.listWrap.on('click', '.js-choose', function(){
            if(_this.requestData.length <= 0){
                _this.request();
            } else {
                _this.renderValue();
            }
        });

        this.valueWrap.on('click', '.goods-category-value-item li', function(){
            var value = $(this).parents('.goods-category-value-item').data('value');
            _this.data.length = value;
            _this.data[value-1] = $(this).data('id');
            for(var i=0; i<value-1; i++){
                _this.data[i] = _this.valueWrap.find('.goods-category-value-' + (i+1)).find('.active').data('id');
            }
            _this.valueWrap.find('.goods-category-value-item').hide();
            _this.showListBtn();
        });

        this.valueWrap.on('mouseover', '.goods-category-value-item li', function(){
            if(_this.listId == $(this).data('id')) return false;
            _this.listId = $(this).data('id');
            var value = $(this).parents('.goods-category-value-item').data('value');
            _this.defaultData.length = value + 1;
            _this.defaultData[value-1] = $(this).data('id');
            _this.defaultData[value] = 'all';
            _this.renderValue();
        });
        return this.parent;
    };

    GoodsCategory.prototype.request = function(){
        var _this =this;
        base.ajax({
            url: 'index.php?ctl=template/module&act=getSearchCat',
            data: {depth:3},
            success: function(result){
                var result = result && result.data && result.data.list || [];
                _this.requestData = result;
                _this.renderValue();
            }
        });
    };

    GoodsCategory.prototype.renderValue = function(){
        var _this = this;
        _this.valueWrap.find('.goods-category-value-item').hide();
        $.each(this.defaultData, function(i, item){
            var index = i+1;
            var $value = _this.valueWrap.find('.goods-category-value-' + index);
            if(_this.renderValueItem(index) != ''){
                $value.find('ul').html(_this.renderValueItem(index));
                if(_this.defaultData[index-1] != 'all'){
                    $value.find($("[data-id=" + _this.defaultData[index-1] + "]")).addClass('active');
                }
                $value.show();
            }
        });
    };

    GoodsCategory.prototype.renderValueItem = function(num){
        var htmls = [], _this = this;
        var data = [];

        if(num == 1){
            data = this.requestData;
        } else if(num == 2){
            data = this.requestData[arrayFindKey(this.requestData, 'id', this.defaultData[0])].child;
        } else if(num == 3){
            var xx2 = this.requestData[arrayFindKey(this.requestData, 'id', this.defaultData[0])].child;
            data = xx2[arrayFindKey(xx2, 'id', this.defaultData[1])].child;
        }

        $.each(data, function(i, item){
            htmls.push('<li data-url="' + (item.url || '') + '" data-id="' + (item.id || '') + '">');
            htmls.push('<p>' + (item.text || '') + '</p>');
            if(item.child && item.child.length > 0){
                htmls.push('<i class="icons-arrow-right-1"></i>');
            }
            htmls.push('</li>');
        });
        return htmls.join('');
    };

    GoodsCategory.prototype.showListBtn = function(){
        var _this = this;
        _this.listWrap.find('dl').hide();
        this.dataInfo();
        $.each(this.data, function(i, item){
            _this.listWrap.find('dl').eq(i).find('dd p').html(_this.opts.arr[i].text);
            _this.listWrap.find('dl').eq(i).show();
        });
    };

    GoodsCategory.prototype.dataInfo = function(){
        var data = [], _this = this;

        var allData = {};
        $.each(this.data, function(i, item){
            var itemData = i > 0 ? allData[i-1].child : _this.requestData;
            allData[i] = itemData[arrayFindKey(itemData, 'id', item)];
            data[i] = {};
            data[i].id = allData[i].id;
            data[i].text = allData[i].text;
            data[i].url = allData[i].url;
        });
        this.opts.arr = data;
        this.opts.url = data[data.length-1].url;
    };

    GoodsCategory.prototype.result = function(){
        return this.opts;
    };

    module.exports = GoodsCategory;
});