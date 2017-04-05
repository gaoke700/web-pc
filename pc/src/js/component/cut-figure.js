/**
 * 自定义模版 组件：海报切图（CutFigure）
 * @module component/CutFigure
 * @author 张志刚
 */
define(function (require, exports, module) {
    var $ = MJQ;
    var ImgCollection = require('../common/img-collection.js');
    var DialogLink = require('../common/dialog-link.js');

    /**
     * @constructor
     * @alias module:component/CutFigure
     */
    function CutFigure(opts){
        opts = opts || {};
/*
            {
                sign: '',
                id: '',
                spacing: 5,
                imgInfo: {
                    imgSource: 'http://m.fy.shopex.loc.cn:9053/material/分类1.png',
                    imgSize: { h:110, w:110 },
                    imgLink:[
                        {
                            data: { type : "1", url: "http://123124" },
                            indexName:"input-link"
                        },
                        {
                            data: { type : "1", url: "http://123124" },
                            indexName:"input-link"
                        }
                    ],
                    imgPosition:[
                        {
                            width:100,
                            height:80,
                            position:[50,60]
                        },
                        {
                            width:100,
                            height:80,
                            position:[50,60]
                        }
                    ]
                }
            };
*/

        /**
         * @property opts {Object} 默认参数
         * @property opts[].parent {Object} 当前组件需要插入到的节点里面
         * @property opts[].setData {Object} 默认参数
         * @property opts[].setData[].sign {String} 组件的类型:HdBanner
         * @property opts[].setData[].id {Number} 组件的ID
         * @property opts[].setData[].imgInfo {Json} 组件图片数据
         * @property opts[].setData[].imgInfo[].imgSource {String} 图片的src
         * @property opts[].setData[].imgInfo[].imgSize {Json} 图片的宽高
         * @property opts[].setData[].imgInfo[].imgSize[].w {Number} 图片的宽
         * @property opts[].setData[].imgInfo[].imgSize[].h {Number} 图片的高
         * @property opts[].setData[].imgInfo[].imgLink {Array} 切片的链接
         * @property opts[].setData[].imgInfo[].imgLink[].indexName {String} 链接的类型名称
         * @property opts[].setData[].imgInfo[].imgLink[].data[].type {Number} 链接的类型
         * @property opts[].setData[].imgInfo[].imgLink[].data[].url {String} 链接的地址
         * @property opts[].setData[].imgInfo[].imgPosition {Array} 切片的宽高和定位
         * @property opts[].setData[].imgInfo[].imgPosition[].width {Number} 切片的宽
         * @property opts[].setData[].imgInfo[].imgPosition[].height {Number} 切片的高
         * @property opts[].setData[].imgInfo[].imgPosition[].position {Array} 切片的定位,第一项是left,第二项是top
         */
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                spacing: 5,
                imgInfo: {}
            }
        };
        this.linkLength = 0;
        this.zIndex = 20;
        /** @property parent {Object} 当前组件的父级 */
        this.parent = null;
        /** @property isSave {Booleans} 判断当前组件是否保存 */
        this.isSave = true;
        this.init(opts);
    };

    CutFigure.prototype.constructor = CutFigure;

    /** 初始化组件 */
    CutFigure.prototype.init = function(opts){
        var _this = this;
        $.extend(true, this.opts, opts);
        if(this.opts.setData.imgInfo.imgLink){
            this.opts.setData.imgInfo.imgLink = base.jsonToArray(this.opts.setData.imgInfo.imgLink);
            this.linkLength = this.opts.setData.imgInfo.imgLink.length;
        }
        this.opts.setData.imgInfo.imgLink = this.opts.setData.imgInfo.imgLink || [];
        this.opts.setData.imgInfo.imgPosition = this.opts.setData.imgInfo.imgPosition || [];

        this.parent = $('<div class="c-component-cutFigure" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">海报切图设置</p></div>');
        this.cutFigure = $('<div class="cutFigure"></div>');
        var spacingStr = '<div style="margin: 0 25px 15px;"><span>下间距：</span><input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div>';
        this.parent.append(spacingStr);
        this.parent.append(this.cutFigure.html(this.renderStyle()));
        this.opts.parent.append(this.parent);

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

        this.parent.on('click', '.js-cutFigure-img-upload', function(){
            _this.upload();
        });

        this.parent.on('click', '.cutFigure-link-list, cutFigure-img-show-splice-list', function(){
            _this.changeLinkActive($(this).index());
        });

        this.parent.on('click', '.js-add-link', function(){
            _this.addLinkList();
        });

        this.parent.on('click', '.js-btn-remove-link', function(){
            _this.removeLinkList($(this));
        });

        this.parent.on('click', '.js-btn-add-link', function(){
            _this.addLink($(this));
        });

        this.parent.on('mousedown', '.js-img-slice-move', function(e){
            _this.imgSliceMove($(this), e);
            _this.changeLinkActive($(this).parent().index());
        });

        this.parent.on('mousedown', '.js-img-slice-scale', function(e){
            _this.imgSliceScale($(this), e);
            _this.changeLinkActive($(this).parent().index());
        });
    };

    /**
     * 渲染组件的设置样式
     * @returns {String} 设置样式的html字符串
     */
    CutFigure.prototype.renderStyle = function(){
        var htmls = [];
        htmls.push('<div class="cutFigure-img">');
        if(this.opts.setData.imgInfo.imgSource){
            htmls.push(this.cutFigureImgShow());
        } else {
            htmls.push('<div class="cutFigure-img-upload js-cutFigure-img-upload"><div><i class="icons-upload-img"></i><p>建议宽度 750px高度不限<br>注：宽度超过750px的图片将自适应显示</p></div></div>');
        }
        htmls.push('</div>');
        htmls.push('<div class="cutFigure-link">');
        htmls.push('<p class="cutFigure-link-title">热区设置</p>');
        htmls.push('<div class="cutFigure-link-list-wrap">');
        if(this.linkLength > 0){
            $.each(this.opts.setData.imgInfo.imgLink, function(i, item){
                htmls.push('<div class="cutFigure-link-list">');
                htmls.push('<p class="text js-btn-add-link">' + (item.data && item.data.url || '请输入合法链接') + '</p>');
                htmls.push('<i class="icons-link2 js-btn-add-link"></i>');
                htmls.push('<i class="icons-close js-btn-remove-link"></i>');
                htmls.push('</div>');
            });
        }
        htmls.push('</div>');
        htmls.push('<div class="add-link js-add-link">+&nbsp;添加热区链接</div>');
        htmls.push('</div>');

        return htmls.join('');
    };

    /**
     * 渲染上传完图片的那块切图
     * @returns {String} 设置样式的html字符串
     */
    CutFigure.prototype.cutFigureImgShow = function(){
        var htmls = [], _this = this;
        var imgInfo = this.opts.setData.imgInfo;
        if(imgInfo.imgPosition && base.utils.isJson(imgInfo.imgPosition)){
            imgInfo.imgPosition = base.jsonToArray(imgInfo.imgPosition);
        }
        htmls.push('<div class="cutFigure-img-show">');
        htmls.push('<div class="cutFigure-img-show-splice">');
        if(imgInfo.imgPosition.length > 0){
            $.each(imgInfo.imgPosition, function(i, item){
                _this.zIndex++;
                var w = item.width || 70;
                var h = item.height || 70;
                var l = item.position && item.position[0] || 10;
                var t = item.position && item.position[1] || 10;
                htmls.push('<div class="cutFigure-img-show-splice-list" style="z-index: ' + _this.zIndex + '; left: ' + l + 'px; top: ' + t + 'px;"><div class="div-scale js-img-slice-scale"></div><div class="div-move js-img-slice-move" style="width: ' + w + 'px; height: ' + h + 'px;"></div></div>');
            });
        }
        htmls.push('</div>');
        htmls.push('<img style="width: ' + (imgInfo.imgSize.w/2) + 'px; height: auto;" src="' + imgInfo.imgSource + '" />');
        htmls.push('</div>');

        return htmls.join('');
    };

    /**
     * 上传图片
     */
    CutFigure.prototype.upload = function(){
        var _this = this;
        _this.ImgCollection = new ImgCollection();
        $(_this.ImgCollection).on('saveEnd', function(){
            var imgData = arguments[1].data[0];
            if(!imgData.imgSource){ return false; }
            _this.opts.setData.imgInfo.imgSource = imgData.imgSource || '';
            _this.opts.setData.imgInfo.imgId = imgData.imgId || '';
            //_this.opts.setData.imgInfo.imgSize = imgData.imgSize || {w:0,h:0};
            _this.opts.setData.imgInfo.imgSize = {w:0,h:0};
            if(imgData.imgSize && imgData.imgSize.w && imgData.imgSize.h){
                var w = imgData.imgSize.w;
                var h = imgData.imgSize.h;
                if(w > 750){
                    _this.opts.setData.imgInfo.imgSize.w = 750;
                    _this.opts.setData.imgInfo.imgSize.h = h*750/w;
                } else {
                    _this.opts.setData.imgInfo.imgSize.w = w;
                    _this.opts.setData.imgInfo.imgSize.h = h;
                }
            }
            _this.parent.find('.cutFigure-img').html(_this.cutFigureImgShow());

            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    /**
     * 添加链接列表项
     */
    CutFigure.prototype.addLinkList = function(){
        if(!this.opts.setData.imgInfo.imgSource){
            base.promptDialog({str:'请先上传图片'});
            return false;
        }

        this.parent.find('.cutFigure-link-list-wrap').append('<div class="cutFigure-link-list"><p class="text js-btn-add-link">请输入合法链接</p><i class="icons-link2 js-btn-add-link"></i><i class="icons-close js-btn-remove-link"></i></div>');
        this.linkLength++;
        this.zIndex++;
        this.parent.find('.cutFigure-img .cutFigure-img-show-splice').append('<div class="cutFigure-img-show-splice-list" style="z-index: ' + this.zIndex + '; left: 10px; top: 10px;"><div class="div-scale js-img-slice-scale"></div><div class="div-move js-img-slice-move" style="width: 70px; height: 70px;"></div></div>');
        this.opts.setData.imgInfo.imgLink.push({indexName:''});
        this.opts.setData.imgInfo.imgPosition.push({ width:70, height:70, position:[10,10] });
    };

    /**
     * 删除链接列表项
     */
    CutFigure.prototype.removeLinkList = function(obj){
        var _this = this;
        var $parent = obj.parent('.cutFigure-link-list');
        var index = $parent.index();
        new base.Dialog({
            headerTxt:'提示信息',
            content:'删除后将无法恢复，是否继续删除？',
            okCallback: function(){
                $parent.remove();
                _this.parent.find('.cutFigure-img-show-splice .cutFigure-img-show-splice-list').eq(index).remove();
                var imgInfo = _this.opts.setData.imgInfo;
                if(imgInfo.imgLink[index]){
                    imgInfo.imgLink.splice(index, 1);
                }
                if(imgInfo.imgPosition[index]){
                    imgInfo.imgPosition.splice(index, 1);
                }
                _this.isSave = false;
                $(_this).trigger('changeData', [{ data: _this.result() }]);
            }
        });
    };

    /**
     * 添加具体链接
     */
    CutFigure.prototype.addLink = function(obj){
        var _this = this;
        var $parent = obj.parent('.cutFigure-link-list');
        var index = $parent.index();
        if(this.opts.setData.imgInfo.imgLink[index]){
            this.dialogLink = new DialogLink(this.opts.setData.imgInfo.imgLink[index]);
        } else {
            this.dialogLink = new DialogLink();
        }

        $(this.dialogLink).on('saveEnd', function(){
            var link = arguments[1].data;
            _this.opts.setData.imgInfo.imgLink[index] = link;
            $parent.find('.text').html(link.data && link.data.url || '');
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    /**
     * 切片移动
     */
    CutFigure.prototype.imgSliceMove = function(obj, e){
        var _this = this;
        var $cutFigureImgShow = obj.parents('.cutFigure-img-show');
        obj = obj.parent();
        var objDis = {
            x: $(obj).offset().left,
            y: $(obj).offset().top
        };
        var limits = {
            l: $cutFigureImgShow.offset().left,
            t: $cutFigureImgShow.offset().top,
            r: $cutFigureImgShow.outerWidth() - obj.outerWidth(),
            b: $cutFigureImgShow.outerHeight() - obj.outerHeight()
        };

        var dis = {
            x: (e.clientX - objDis.x),
            y: (e.clientY - objDis.y)
        };

        $(document).on('mousemove', function(e){
            var moveDis = {
                x: (e.clientX - dis.x - limits.l),
                y: (e.clientY - dis.y - limits.t)
            };

            moveDis.x = moveDis.x < 0 ? 0 : moveDis.x;
            moveDis.x = moveDis.x < limits.r ? moveDis.x : limits.r;
            moveDis.y = moveDis.y < 0 ? 0 : moveDis.y;
            moveDis.y = moveDis.y < limits.b ? moveDis.y : limits.b;
            obj.css({left:moveDis.x, top:moveDis.y});
        });

        $(document).on('mouseup', function(){
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            if(typeof userSelect === "string"){
                return document.documentElement.style[userSelect] = "text";
            }
            document.unselectable  = "off";
            document.onselectstart = null;
            var index = obj.index();
            var imgPosition = _this.opts.setData.imgInfo.imgPosition || [];
            if(imgPosition[index]){
                imgPosition[index].position = [obj.position().left, obj.position().top];
            }

            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        if(typeof userSelect === "string"){
            return document.documentElement.style[userSelect] = "none";
        }
        document.unselectable  = "on";
        document.onselectstart = function(){
            return false;
        };

        return false;
    };

    /**
     * 切片放大缩小
     */
    CutFigure.prototype.imgSliceScale = function(obj, e){
        var _this = this;
        var $cutFigureImgShow = obj.parents('.cutFigure-img-show');
        obj = obj.parent();
        var $divMove = obj.find('.div-move');
        var divCss = {
            width: $divMove.width(),
            height: $divMove.height()
        };
        var newCss = {
            width: divCss.width,
            height: divCss.height
        };
        var dis = { x: e.clientX, y: e.clientY };

        $(document).on('mousemove', function(e){
            var moveDis = {
                x: (e.clientX - dis.x + divCss.width),
                y: (e.clientY - dis.y + divCss.height)
            };
            var limits = {
                w: $cutFigureImgShow.width() - obj.position().left - 4,
                h: $cutFigureImgShow.height() - obj.position().top - 4
            };


            moveDis.x = moveDis.x < 50 ? 50 : moveDis.x;
            moveDis.y = moveDis.y < 50 ? 50 : moveDis.y;
            moveDis.x = moveDis.x < limits.w ? moveDis.x : limits.w;
            moveDis.y = moveDis.y < limits.h ? moveDis.y : limits.h;
            newCss.width = moveDis.x;
            newCss.height = moveDis.y;
            $divMove.css({width:moveDis.x, height:moveDis.y});
        });

        $(document).on('mouseup', function(){
            $(document).unbind('mousemove');
            $(document).unbind('mouseup');
            if(typeof userSelect === "string"){
                return document.documentElement.style[userSelect] = "text";
            }
            document.unselectable  = "off";
            document.onselectstart = null;
            var index = obj.index();
            var imgPosition = _this.opts.setData.imgInfo.imgPosition || [];
            if(imgPosition[index]){
                imgPosition[index].width = newCss.width;
                imgPosition[index].height = newCss.height;
            }
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });

        if(typeof userSelect === "string"){
            return document.documentElement.style[userSelect] = "none";
        }
        document.unselectable  = "on";
        document.onselectstart = function(){
            return false;
        };

        return false;
    };

    /**
     * 当前切片和链接增加active状态
     */
    CutFigure.prototype.changeLinkActive = function(index){
        var className = 'cutFigure-img-show-splice-list-active';
        var className2 = 'cutFigure-link-list-active';
        this.parent.find('.cutFigure-img-show-splice .' + className).removeClass(className);
        this.parent.find('.cutFigure-img-show-splice .cutFigure-img-show-splice-list').eq(index).addClass(className);
        this.parent.find('.cutFigure-link-list-wrap .' + className2).removeClass(className2);
        this.parent.find('.cutFigure-link-list-wrap .cutFigure-link-list').eq(index).addClass(className2);
    };

    /**
     * 返回组件的选择结果
     * @returns {Object} this.opts.setData
     */
    CutFigure.prototype.result = function(){
        return this.opts.setData;
    };

    module.exports = CutFigure;
});