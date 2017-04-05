define(function (require, exports, module) {
    var $ = MJQ;

    function InputLink(opts){
        this.opts = $.extend({
            type:1,
            url:''
        }, opts||{});
        this.parent = $('<div class="input-link-wrap"></div>');
        this.defaultData = [1,2];
        this.init();
    };

    InputLink.prototype.constructor = InputLink;

    InputLink.prototype.init = function(){
        var _this = this;
        this.parent.on('click', '.btn-remove', function(){
            _this.delInputVal($(this));
        });
        this.parent.on('click', '.btn-radio', function(){
            _this.changeRadio($(this));
        })
    };

    InputLink.prototype.render = function(){
        var _this = this;
        var htmls = [];
        htmls.push('<dl>');
        htmls.push('<dt>链接地址：</dt>');
        htmls.push('<dd class="btn-radio-wrap">');

        $.each(this.defaultData, function(i, item){
            htmls.push('<div class="choose">');
            htmls.push('<span class="c-radio btn-radio ' + (_this.opts.type == item ? 'c-radio-active' : '') + '"><i></i></span>');
            if(item == 1){
                htmls.push('<p>http://</p>');
                htmls.push('<div class="input-wrap">');
                if(_this.opts.url){
                    htmls.push('<input type="text" value="' + (_this.opts.url.replace(/http:\/\//, "")) + '" />');
                } else {
                    htmls.push('<input type="text" value="" />');
                }
                htmls.push('<i class="icons-close btn-remove"></i>');
                htmls.push('</div>');
            } else {
                htmls.push('<p>无链接</p>');
            }
            htmls.push('</div>');
        });

        htmls.push('</dd>');
        htmls.push('</dl>');

        this.parent.html(htmls.join(''));
        return this.parent;
    };

    InputLink.prototype.delInputVal = function(obj){
        this.opts.value = '';
        obj.siblings('input').val('').focus();
    };

    InputLink.prototype.changeRadio = function(obj){
        this.parent.find('.btn-radio').removeClass('c-radio-active');
        obj.addClass('c-radio-active');
        this.opts.type = this.defaultData[obj.parents('.choose').index()];
    };

    InputLink.prototype.result = function(){
        var $radioActive = this.parent.find('.c-radio-active');
        var $parent = $radioActive.parents('.choose');
        if($parent.find('input').length > 0){
            this.opts.url = 'http://' + this.parent.find('input').val();
        } else {
            this.opts.url = '';
        }
        return this.opts;
    };

    module.exports = InputLink;
});