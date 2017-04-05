/**
 * Created by zhangzhigang on 2016/12/23.
 */
define(function (require, exports, module) {

    function LazyLoadContent(opts) {
        this.opts = $.extend({
            //每页个数
            pageSize: 10,
            //预加载高度
            offsetBottom: 400,
            ajaxUrl: '',
            ajaxType: 'get',
            ajaxDataType: 'json',
            //容器选择器
            container: '',
            params: null,
            render: null,
            overshow: null,
            loadOver: function () {}
        }, opts||{});

        //唯一标志
        this._UUID = LazyLoadContent.getUUID();

        //当前页数
        this.page = 0;

        //ajax开关
        this.onOff = true;

        //是否监听
        this.isListenScroll = false;

        var _this = this;

        this._scrollHandle = function () {
            var isSee = _this.isBottom();
            var isThat = LazyLoadContent.scrollUUID === _this._UUID;
            if (isSee && isThat) {
                _this.loadNextPage();
            }
        };

        this.overshow = this.opts.overshow;
    }

    LazyLoadContent.getUUID = (function () {
        var UUID = 1;
        return function () {
            return UUID++;
        };
    })();

    //正在监听滚动的对象ID
    LazyLoadContent.scrollUUID = 0;

    //初始化
    LazyLoadContent.prototype.init = function () {

    };

    //实例化对象数
    LazyLoadContent.prototype._newCount = 0;

    //加载页面
    LazyLoadContent.prototype.loadPage = function (page, isReFill) {
        var _this = this, opts = _this.opts, params = {}, isSee = false;

        _this.listenScroll();

        //最底部元素可见，开关开启而且还有下拉
        _this.onOff = false;

        if (opts.params && typeof opts.params == 'object') {
            for (var p in opts.params) {
                params[p] = typeof opts.params[p] == 'function' ? opts.params[p]() : opts.params[p];
            }
        }

        var ajaxObj = $.extend({
            page: page || _this.page,
            size: opts.pageSize
        }, params);

        opts.loadStart && opts.loadStart.call(this);

        $.ajax({
            type: opts.ajaxType,
            url: opts.ajaxUrl,
            data: ajaxObj,
            dataType: opts.ajaxDataType,
            success: function(result){
                opts.loadEnd && opts.loadEnd.call(this,result);

                var list = null;

                if (!result) {
                    opts.loadOver.call(_this);
                    _this.onOff = false;
                    return false;
                }

                try{
                    _this.renderDom(result, isReFill);
                }catch(e){
                    //alert(e);
                }
                _this.onOff = true;
            }
        });

        //$.post(opts.ajaxUrl, ajaxObj, function (result) {
        //
        //}, "json");

    };

    //渲染数据
    LazyLoadContent.prototype.renderDom = function (data, isReFill) {
        var opt = this.opts, el, html;
        opt.renderStart && opt.renderStart.call(this);
        if(!opt.render){ return false; }
        html = this.opts.render(data);
        el = $(html);
        isReFill ? $(opt.container).html(html) : $(opt.container).append(el);
        if (typeof opt.renderToDom == 'function') {
            opt.renderToDom(el);
        }
        opt.renderEnd && opt.renderEnd.call(this);
    };

    LazyLoadContent.prototype.stop = function () {
        this.onOff = false;
    };

    LazyLoadContent.prototype.start = function (page, isReFill) {
        this.onOff = true;
        this.page = page ? page : this.page;
        this.loadPage(this.page, isReFill);
    };

    //加载下一页
    LazyLoadContent.prototype.loadNextPage = function () {
        var _this = this;
        if (_this.onOff) {
            //页数加1
            _this.page++;
            _this.loadPage();
        }
    };

    //判断是否到底
    LazyLoadContent.prototype.isBottom = function () {
        var _this = this,
            offsetBottom = _this.opts.offsetBottom;
        var sh = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
            st = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
            h = $(window).height();
        return sh - h - st < offsetBottom;
    };

    //监听滚动事件
    LazyLoadContent.prototype.listenScroll = function () {
        var _this = this;

        LazyLoadContent.scrollUUID = _this._UUID;
        //如果没有监听
        if (!_this.isListenScroll) {
            $(window).bind('scroll', _this._scrollHandle);
            _this.isListenScroll = true;
        }
    };

    //放弃监听
    LazyLoadContent.prototype.clearScroll = function () {
        $(window).unbind('scroll', this._scrollHandle);
        this.isListenScroll = false;
    };

    module.exports = LazyLoadContent;
});