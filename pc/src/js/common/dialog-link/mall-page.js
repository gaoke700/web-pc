define(function (require, exports, module) {
    var $ = MJQ;

    function MallPage(opts){
        this.opts = $.extend({
            type: '',
            url:''
        }, opts||{});
        this.parent = $('<div class="mall-page-wrap"></div>');
        this.data = {};
        this.init();
    };

    MallPage.prototype.constructor = MallPage;

    MallPage.prototype.init = function(){
        var _this = this;

        this.parent.on('click', '.btn-radio', function(){
            _this.changeRadio($(this));
        })
    };

    MallPage.prototype.render = function(){
        var htmls = [], _this = this;

        htmls.push('<dl>');
        htmls.push('<dt>选择商城页面名称：</dt>');
        htmls.push('<dd>');
        htmls.push('<ul class="btn-radio-wrap"></ul>');
        htmls.push('</dd>');
        htmls.push('</dl>');

        this.parent.html(htmls.join(''));
        base.ajax({
            url: 'index.php?ctl=template/module&act=getWebPage',
            success: function(result){
                result = result && result.data && result.data.list || {};
                _this.data = result;
                var list = '';
                $.each(result, function(key, value){
                    if(!result[_this.opts.type]){
                        _this.opts.type = key;
                        _this.opts.url = value.url;
                    }
                    list += '<li data-type="' + key + '" data-link="' + value.url + '" class="' + (_this.opts.type == key ? 'active' : '') + '"><div><span class="c-radio btn-radio ' + (_this.opts.type == key ? 'c-radio-active' : '') + '"><i></i></span><p>' + value.text + '</p></div></li>';
                });
                _this.parent.find('.btn-radio-wrap').html(list);
            }
        });

        return this.parent;
    };

    MallPage.prototype.changeRadio = function(obj){
        var $li = obj.parents('li');
        var type = $li.data('type');
        this.parent.find('li').removeClass('active');
        this.parent.find('.btn-radio').removeClass('c-radio-active');
        $li.addClass('active');
        obj.addClass('c-radio-active');
        this.opts.type = type;
        this.opts.url = this.data[type] && this.data[type].url || '';
    };

    MallPage.prototype.result = function(){
        return this.opts;
    };

    module.exports = MallPage;
});