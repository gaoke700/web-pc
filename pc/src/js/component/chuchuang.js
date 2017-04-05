/**
 * 自定义模版 组件：橱窗（ChuChuang）
 * @module component/ChuChuang
 * @author 张志刚
 */
define(function (require, exports, module) {
    var $ = MJQ;
    var Move = require('./plugin/move.js');
    var ImgCollection = require('../common/img-collection.js');
    var DialogLink = require('../common/dialog-link.js');

    function changeUploadStyle(url, adviceSize, imgSize){
        var errorTxt = '', succTxt = '', htmls = '', isSucc = true;
        var adviceSize = adviceSize;
        var imgSize = imgSize;
        if(adviceSize.h == 'auto'){
            errorTxt = '宽' + adviceSize.w + 'px 高度不限';
            succTxt = '宽度为：' + adviceSize.w + 'px';
        } else {
            errorTxt = adviceSize.w + '*' + adviceSize.h + 'px';
            succTxt = '尺寸' + adviceSize.w + '*' + adviceSize.h + 'px';
        };
        var errorHtml = '<img src="' + url + '" ><div class="t-error"><div><p class="txt">为了保证您的图片品质，建议您的图片尺寸调整为' + errorTxt + '</p><p class="txt2"><span class="js-error-yes">知道了</span><span class="js-upload-img"><i class="icons-editor7"></i></span></p></div></div>';
        var succHtml = '<img src="' + url + '" ><p class="p2"><i class="icons-editor6"></i><span>建议' + succTxt + '</span></p><p class="t-succ">真棒！这张图片可以使用</p>';

        if(imgSize.w == adviceSize.w){
            if(adviceSize.h == 'auto'){
                if(adviceSize.h == imgSize.h){
                    htmls = succHtml;
                    isSucc = true;
                } else {
                    htmls = errorHtml;
                    isSucc = false;
                }
            } else {
                htmls = succHtml;
                isSucc = true;
            }
        } else {
            htmls = errorHtml;
            isSucc = false;
        }

        return {
            htmls:htmls,
            succ:isSucc
        };
    };

    /**
     * @constructor
     * @alias module:component/ChuChuang
     */
    function ChuChuang(opts){
        opts = opts || {};
        /**
         * @property opts {Object} 默认参数
         * @property opts[].parent {Object} 当前组件需要插入到的节点里面
         * @property opts[].setData {Object} 默认参数
         * @property opts[].setData[].sign {String} 组件的类型:ChuChuang
         * @property opts[].setData[].id {Number} 组件的ID
         * @property opts[].setData[].style {Number} 默认参数1, 可选[1,2,3,4,5,6,7,8,9]
         * @property opts[].setData[].imgLen {Array} 默认参数1
         * @property opts[].setData[].imgInfo {Array} 默认参数
         */
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                style: 1,
                imgLen: 1,
                spacing: 5,
                imgInfo: []
            }
        };
        /** @property parent {Object} 当前组件的父级 */
        this.parent = null;
        /** @property isSave {Booleans} 判断当前组件是否保存 */
        this.isSave = true;
        /** @property defaultOpt {Array} 当前组件图片的长宽规则 */
        this.defaultOpt = [
            [ {w:750, h:'auto'} ],

            [ {w:375, h:'auto'}, {w:375, h:'auto'} ],

            [ {w:250, h:'auto'}, {w:250, h:'auto'}, {w:250, h:'auto'} ],
            [ {w:375, h:160}, {w:375, h:160}, {w:375, h:320} ],
            [ {w:750, h:160}, {w:375, h:160}, {w:375, h:160} ],

            [ {w:375, h:160}, {w:188, h:160}, {w:188, h:160}, {w:375, h:320} ],
            [ {w:188, h:'auto'}, {w:188, h:'auto'}, {w:188, h:'auto'}, {w:188, h:'auto'} ],
            [ {w:375, h:106}, {w:375, h:106}, {w:750, h:106}, {w:375, h:212} ],
            [ {w:375, h:160}, {w:375, h:160}, {w:375, h:160}, {w:375, h:160} ]
        ];

        this.init(opts);
    };

    ChuChuang.prototype.constructor = ChuChuang;

    /** 初始化组件 */
    ChuChuang.prototype.init = function(opts){
        $.extend(true, this.opts, opts);
        if(!(this.opts.setData.imgInfo instanceof Array)){
            this.opts.setData.imgInfo = base.jsonToArray(this.opts.setData.imgInfo);
        }
        var _this = this;
        this.parent = $('<div class="c-component-chuchuang" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">橱窗设置</p></div>');
        this.styleParent = $('<div class="c-component-chuchuang-style"></div>');
        this.uploadParent = $('<div class="c-component-upload-img"></div>');
        this.parent.append(this.styleParent.html(this.renderStyle()));
        var spacingStr = '<div style="margin: 0 25px 15px;"><span>间距：</span><input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div>';
        this.parent.append(spacingStr);
        this.renderUpload();
        this.parent.append(this.uploadParent);
        this.opts.parent.append(this.parent);

        this.parent.on('click', '.c-component-chuchuang-style .cc-item', function(){
            _this.changeStyle($(this));
        });

        this.parent.on('input', '.input-spacing', function(){
            $(this).val($(this).val().replace(/[^\d]/g,''));
        });

        this.parent.on('blur', '.input-spacing', function(){
            var val = $(this).val().replace(/[^\d]/g,'') || 5;
            $(this).val(val);
            _this.opts.setData.spacing = val;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        this.uploadParent.on('click', '.js-error-yes', function(){
            $(this).parents('.img-wrap').addClass('js-upload-img');
            $(this).parents('.t-error').remove();
        });

        this.uploadParent.on('click', '.js-upload-img', function(e){
            _this.upload($(this), e);
        });

        this.uploadParent.on('click', '.btn-add-link', function(){
            _this.addLink($(this));
        });

    };

    /**
     * 渲染橱窗组件的设置样式
     * @returns {String} 设置样式的html字符串
     */
    ChuChuang.prototype.renderStyle = function(){
        var htmls = [], itemHtml = [], _this = this;

        $.each([1,2,3,4], function(i){
            itemHtml[i] = [];
            itemHtml[i].push('<div class="cc-item-wrap" data-len="' + (i+1) + '">');
        });

        $.each(this.defaultOpt, function(i, item){
            var index = i+1;
            var iItem = itemHtml[item.length-1];
            iItem.push('<div class="cc-item ' + (_this.opts.setData.style == index ? 'cc-item-active' : '') + '" data-style="' + index + '"><div><img src="user_components/admin/dist/images/component/chuchuang/' + index + '.png"></div></div>');
        });

        $.each([1,2,3,4], function(i){
            itemHtml[i].push('</div>');
        });

        htmls.push('<p>橱窗样式选择</p>');
        htmls.push('<div class="chuchuang-wrap">');
        $.each(itemHtml, function(i, item){
            itemHtml[i] = item.join('');
        });
        htmls.push(itemHtml.join(' '));
        htmls.push('</div>');

        return htmls.join('');
    };

    /** 渲染上传完成的图片节点并添加了拖拽效果 */
    ChuChuang.prototype.renderUpload = function(){
        var htmls = [], _this = this;
        var imgInfo = this.defaultOpt[this.opts.setData.style-1];
        for(var i=0; i<this.opts.setData.imgLen; i++){
            var iIndex = i;
            var imgData = _this.opts.setData.imgInfo[iIndex] || {};
            var sizeStr = '';
            if(imgInfo[i].h == 'auto'){
                sizeStr = '宽度 ' + imgInfo[i].w + 'px';
            } else {
                sizeStr = '尺寸 ' + imgInfo[i].w + '*' + imgInfo[i].h + 'px';
            }
            htmls.push('<div class="c-component-upload-img-item cursor">');
            htmls.push('<div>');
            htmls.push('<div class="move-style active"><i class="icons-double-arrow"></i></div>');
            htmls.push('<div class="editor-wrap">');

            if(imgData.imgSource){
                htmls.push('<div class="img-wrap js-upload-img img-wrap-active">');
                htmls.push('<img src="' + imgData.imgSource + '" >');
            } else {
                htmls.push('<div class="img-wrap js-upload-img">');
                htmls.push('<div><i class="icons-upload-img add"></i><p class="p1">建议' + sizeStr + '<br>注：图片的比例将自适应显示</p></div>');
            }
            htmls.push('</div>');
            htmls.push('<div class="btn-add-link-wrap">');

            if(imgData.imgLink && imgData.imgLink.data){
                htmls.push('<div class="btn-add-link active"><span>' + (imgData.imgLink.data.url ? imgData.imgLink.data.url : '无链接') + '</span><i class="icons-link2"></i></div>');
            } else {
                htmls.push('<div class="btn-add-link"><i class="icons-link"></i><span>链接目标</span></div>');
            }
            htmls.push('<p class="tip"></p>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
        }
        htmls = '<div class="upload-item-wrap">' + htmls.join('') + '</div>';

        this.uploadParent.html(htmls);
        this.newDrag(this.uploadParent.find('.c-component-upload-img-item'));
    };

    /**
     * 选择橱窗样式
     * @param {object} obj 切换选择的元素
     */
    ChuChuang.prototype.changeStyle = function(obj){
        var $parent = obj.parents('.chuchuang-wrap');
        $parent.find('.cc-item-active').removeClass('cc-item-active');
        obj.addClass('cc-item-active');
        this.opts.setData.style = obj.data('style');
        this.opts.setData.imgLen = obj.parent().data('len');
        this.isSave = false;
        this.renderUpload();
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    /**
     * 给传入的元素添加拖拽效果
     * @param {object} obj 需要拖拽的元素
     */
    ChuChuang.prototype.newDrag = function(obj){
        var _this = this;
        this.move = new Move(obj);
        $(this.move).on('mouseUpEndd', function(){
            var newArr = [];
            for(var i=0; i<_this.opts.setData.imgInfo.length; i++){
                newArr.push(_this.opts.setData.imgInfo[i]);
            }
            var index = arguments[1].index;
            var oldIndex = index[0];
            var newIndex = index[1];
            if(oldIndex == newIndex) return false;
            var oldKey = newArr[oldIndex];
            newArr.splice(oldIndex, 1);
            newArr.splice(newIndex, 0, oldKey);
            _this.opts.setData.imgInfo = newArr;
        });
    };

    /**
     * 图片上传
     * @param {object} obj 需要上传图片的元素
     */
    ChuChuang.prototype.upload = function(obj, e){
        var _this = this;
        var $item = obj.parents('.c-component-upload-img-item');
        var $imgWrap = $item.find('.img-wrap');
        var index = $item.parent('.upload-item-wrap').find('.c-component-upload-img-item').index($item);

        _this.ImgCollection = new ImgCollection();
        $(_this.ImgCollection).on('saveEnd', function(){
            var imgData = arguments[1].data[0];
            var imgSource = imgData.imgSource || '';
            var imgId = imgData.imgId || '';

            $imgWrap.addClass('img-wrap-active');
            $imgWrap.html('<img src="' + imgSource + '">');
            _this.opts.setData.imgInfo[index] = _this.opts.setData.imgInfo[index] || {};
            _this.opts.setData.imgInfo[index].imgId = imgId;
            _this.opts.setData.imgInfo[index].imgSource = imgSource;
            _this.opts.setData.imgInfo[index].imgSize = imgData.imgSize || {
                    w:0,
                    h:0
                };
            if(!($item.find('.btn-add-link').hasClass('active'))){
                $item.find('.btn-add-link-wrap .tip').html('请选择链接目标');
            }
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    /**
     * 添加链接
     * @param {object} obj 需要添加链接的元素
     */
    ChuChuang.prototype.addLink = function(obj){
        var _this = this;
        var $item = obj.parents('.c-component-upload-img-item');
        var index = $item.parent().find('.c-component-upload-img-item').index($item);
        if(!this.opts.setData.imgInfo[index]){
            obj.siblings('.tip').html('请先上传图片');
            return false;
        }

        this.dialogLink = new DialogLink(this.opts.setData.imgInfo[index].imgLink);
        $(this.dialogLink).on('saveEnd', function(){
            var link = arguments[1].data;
            obj.html('<span>' + (link.data.url ? link.data.url : '无链接') + '</span><i class="icons-link2"></i>');
            obj.addClass('active');
            obj.siblings('.tip').hide();
            _this.opts.setData.imgInfo[index].imgLink = link;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    /**
     * 返回橱窗组件的选择结果
     * @returns {Object} this.opts.setData
     */
    ChuChuang.prototype.result = function(){
        return this.opts.setData;
    };

    module.exports = ChuChuang;
});