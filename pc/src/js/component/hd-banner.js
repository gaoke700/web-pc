/**
 * 自定义模版 组件：横幅广告（HdBanner）
 * @module component/HdBanner
 * @author 张志刚
 */
define(function (require, exports, module) {
    var $ = MJQ;
    var UploadImg = require('./plugin/upload-img.js');

    /**
     * @constructor
     * @alias module:component/HdBanner
     */
    function HdBanner(opts){
        opts = opts || {};

        /**
         * @property opts {Object} 默认参数
         * @property opts[].parent {Object} 当前组件需要插入到的节点里面
         * @property opts[].setData {Object} 默认参数
         * @property opts[].setData[].sign {String} 组件的类型:HdBanner
         * @property opts[].setData[].id {Number} 组件的ID
         * @property opts[].setData[].style {Number} 默认参数1, 可选[1,2]
         * @property opts[].setData[].imgInfo {Array} 默认参数
         */
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                style: 1,
                spacing: 5,
                imgInfo: []
            }
        };
        /** @property ele {Object} 当前组件的父级 */
        this.ele = null;
        /** @property isSave {Booleans} 判断当前组件是否保存 */
        this.isSave = true;
        this.init(opts);
    };

    HdBanner.prototype.constructor = HdBanner;

    /** 初始化横幅广告组件 */
    HdBanner.prototype.init = function(opts){
        var _this = this;
        $.extend(true, this.opts, opts);
        this.uploadImg = new UploadImg({
            maxImgLen:1,
            imgArr: this.opts.setData.imgInfo
        });

        this.ele = $('<div class="c-component-hdBanner" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">横幅广告设置</p></div>');
        this.chooseStyleWrap = $('<div class="c-component-hdBanner-style"></div>');
        this.chooseStyleWrap.html(this.renderStyle());
        this.ele.append(this.chooseStyleWrap);
        var spacingStr = '<div style="margin: 0 25px 15px;"><span>间距：</span><input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div>';
        this.ele.append(spacingStr);
        this.ele.append(this.uploadImg.opts.parent);
        this.opts.parent.append(this.ele);


        this.ele.on('input', '.input-spacing', function(){
            $(this).val($(this).val().replace(/[^\d]/g,''));
        });

        this.ele.on('blur', '.input-spacing', function(){
            var val = $(this).val().replace(/[^\d]/g,'') || 5;
            $(this).val(val);
            _this.opts.setData.spacing = val;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        $(this.uploadImg).on('changeData', function(){
            var opts = arguments[1];
            if(opts.imgArr && opts.imgArr.length > 0){
                _this.opts.setData.imgInfo = opts.imgArr;
                _this.isSave = false;
                $(_this).trigger('changeData', [{ data: _this.result() }]);
            }
        });

        this.ele.find('.c-component-hdBanner-style').on('click', 'li', function(){
            _this.chooseStyle($(this));
        });
    };

    /**
     * 渲染横幅广告组件的设置样式
     * @returns {String} 设置样式的html字符串
     */
    HdBanner.prototype.renderStyle = function(){
        var _this = this;
        var htmls = [];

        //横幅广告展示样式
        $.each([1,2], function(i, item){
            var liClassName = (item == _this.opts.setData.style) ? 'active' : '';
            htmls += '<li class="' + liClassName + '" data-style="' + item + '"><img src="user_components/admin/dist/images/component/hd-banner/' + item + '.png" /></li>';
        });

        return ('<p>横幅广告样式选择</p><ul>' + htmls + '</ul>');
    };

    /** 横幅广告组件的样式选择 */
    HdBanner.prototype.chooseStyle = function(obj){
        var styleId = obj.data('style');
        if(this.opts.setData.style == styleId) return false;
        obj.siblings('li').removeClass('active');
        obj.addClass('active');
        this.opts.setData.style = styleId;
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    /**
     * 返回横幅广告组件的选择结果
     * @returns {Object} this.opts.setData
     */
    HdBanner.prototype.result = function(){
        var arr = [];
        $.each(this.uploadImg.result(), function(i, item){
            arr.push(item);
        });
        this.opts.setData.imgInfo = arr;
        return this.opts.setData;
    };

    module.exports = HdBanner;
});