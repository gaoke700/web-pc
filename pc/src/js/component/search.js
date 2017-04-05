define(function (require, exports, module) {
    var $ = MJQ;
    var searchData = [
        { style:1 },
        { style:2 },
        { style:3 },
        { style:4 },
        { style:5 }
    ];

    function Search(opt){
        if(!opt.setData && !opt.setData.id) return false;
        this.data = searchData;
        this.setData = {
            sign: 'Search',
            id:'',
            spacing: 5,
            style:1
        };
        $.extend(this.setData, opt.setData);
        this.parent = opt.parent || $('body');
        this.isSave = true;
        this.ele = null;

        this.init();
    };

    Search.prototype.constructor = Search;

    Search.prototype.init = function(){
        var _this = this;
        _this.ele = $('<div class="c-component-search" data-sign="' + this.setData.sign + '" data-id="' + this.setData.id + '"></div>');
        this.append();

        this.ele.on('input', '.input-spacing', function(){
            $(this).val($(this).val().replace(/[^\d]/g,''));
        });

        this.ele.on('blur', '.input-spacing', function(){
            var val = $(this).val().replace(/[^\d]/g,'') || 5;
            $(this).val(val);
            _this.setData.spacing = val;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        this.ele.on('click', '.c-component-search-item', function(){
            _this.choose($(this));
        })
    };

    Search.prototype.append = function(){
        this.ele.html(this.renderHtml());
        this.parent.append(this.ele);
    };

    Search.prototype.renderHtml = function(){
        var _this = this;
        var htmls = [];
        htmls.push('<p class="set-text">搜索组件样式选择</p><div class="c-component-search-info">');
        htmls.push('<div style="margin: 0 25px 15px;"><span>间距：</span><input class="input-spacing" style="width: 50px;" type="text" value="' + this.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div>');

        $.each(_this.data, function(index,item){
            var activeClass = (_this.setData.style == (index+1)) ? 'c-component-search-item c-component-search-item-active' : 'c-component-search-item';
            htmls.push('<div class="' + activeClass + '" data-style="' + (index+1) + '">');
            htmls.push('<div class="btn-radio"><i class="icons-tick4"></i></div>');
            htmls.push('<img src="user_components/admin/dist/images/component/search/' + item.style + '.png" />');
            htmls.push('</div>');
        });
        htmls.push('</div>');
        return htmls.join('');
    };

    Search.prototype.choose = function(obj){
        if(this.setData.style == obj.data('style')) return false;
        this.ele.find('.c-component-search-item').removeClass('c-component-search-item-active');
        obj.addClass('c-component-search-item-active');
        this.setData.style = obj.data('style');
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    Search.prototype.result = function(){
        return this.setData;
    };

    module.exports = Search;
});