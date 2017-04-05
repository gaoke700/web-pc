define(function (require, exports, module) {
    var $ = MJQ;
    var Move = require('./move.js');
    var DialogLink = require('../../common/dialog-link.js');
    var ImgCollection = require('../../common/img-collection.js');

    function UploadImg(opts){
        this.opts = {
            parent: null,
            imgSize:{
                w:750,
                h:460
            },
            maxImgLen:3,
            len:1,
            imgArr:[]
        };

        this.init(opts);
    };

    UploadImg.prototype.constructor = UploadImg;

    UploadImg.prototype.init = function(opts){
        var _this = this;
        $.extend(true, this.opts, opts);

        if(!(this.opts.imgArr instanceof Array)){
            this.opts.imgArr = base.jsonToArray(this.opts.imgArr);
        }

        this.opts.len = this.opts.imgArr.length;
        //this.opts.len++;
        this.opts.parent = $('<div class="c-component-upload-img"><div class="upload-item-wrap"></div></div>');
        var itemHtml = this.render(this.opts.imgArr);
        if(this.opts.maxImgLen > 1 && this.opts.len > 0 && this.opts.len < 8){
            itemHtml += this.render();
        }
        this.opts.parent.find('.upload-item-wrap').append(itemHtml);
        if(this.opts.maxImgLen > 1){
            this.opts.parent.append('<p class="upload-max">还可以添加<span>' + ( this.opts.maxImgLen - this.opts.len ) + '</span>张轮播广告</p>');
        }
        this.showRemove();

        if(this.opts.len > 1){
            this.newDrag(this.opts.parent.find('.c-component-upload-img-item').not('.default'));
        }

        this.opts.parent.on('click', '.js-upload-img', function(){
            _this.upload($(this));
        });

        this.opts.parent.on('click', '.btn-add-link', function(){
            _this.addLink($(this));
        });

        this.opts.parent.on('click', '.remove-style', function(){
            var $that = $(this);
            new base.Dialog({
                headerTxt:'提示信息',
                content:'是否确定删除该图片',
                okCallback: function(){
                    _this.removeItem($that);
                }
            });
        });
    };

    //上传图片
    UploadImg.prototype.upload = function(obj){
        var _this = this;
        var $item = obj.parents('.c-component-upload-img-item');
        var $imgWrap = $item.find('.img-wrap');
        var index = $item.parent().find('.c-component-upload-img-item').index($item);

        _this.ImgCollection = new ImgCollection();
        $(_this.ImgCollection).on('saveEnd', function(){
            var imgData = arguments[1].data[0];
            var imgSource = imgData.imgSource || '';

            $imgWrap.html('<img src="' + imgSource + '" >');
            $imgWrap.addClass('img-wrap-active');

            _this.opts.imgArr[index] = imgData;
            $(_this).trigger('changeData', [{imgArr:_this.opts.imgArr}]);

            if($item.hasClass('default')){
                _this.opts.len++;
                _this.newDrag($item);
                _this.opts.parent.find('.upload-max span').html(_this.opts.maxImgLen - _this.opts.len);
            }
            $item.removeClass('default');
            _this.showRemove();
            if(!($item.find('.btn-add-link').hasClass('active'))){
                $item.find('.btn-add-link-wrap .tip').html('请选择链接目标');
            }
            if((_this.opts.len < _this.opts.maxImgLen) && (_this.opts.parent.find('.upload-item-wrap').children('.default').length < 1)){
                _this.opts.parent.find('.upload-item-wrap').append(_this.render());
            }
        });
    };

    //添加链接
    UploadImg.prototype.addLink = function(obj){
        var _this = this;
        var $item = obj.parents('.c-component-upload-img-item');
        var index = $item.parent().find('.c-component-upload-img-item').index($item);

        if(!this.opts.imgArr[index] || !this.opts.imgArr[index].imgSource){
            obj.siblings('.tip').html('请先上传图片');
            return false;
        }

        this.dialogLink = new DialogLink(this.opts.imgArr[index] && this.opts.imgArr[index].imgLink || {});
        $(this.dialogLink).on('saveEnd', function(){
            var link = arguments[1].data;
            obj.html('<span>' + (link.data.url ? link.data.url : '无链接') + '</span><i class="icons-link2"></i>');
            obj.addClass('active');
            obj.siblings('.tip').hide();
            _this.opts.imgArr[index].imgLink = link;
            $(_this).trigger('changeData', [{imgArr:_this.opts.imgArr}]);
        });
    };

    UploadImg.prototype.render = function(arr){
        var _this = this;
        if(!arr || arr.length<=0){
            arr = [{}];
        }

        var htmls = [];
        $.each(arr, function(i, item){
            var imgSource = item.imgSource || '';
            var imgHtml = '';

            if(imgSource){
                imgHtml += '<img src="' + imgSource + '" >';
            } else {
                imgHtml += '<div>';
                imgHtml += '<i class="icons-upload-img add"></i>';
                imgHtml += '<p class="p1">建议尺寸 ' + _this.opts.imgSize.w + 'px*' + _this.opts.imgSize.h + 'px<br>注：图片的比例将自适应显示</p>';
                imgHtml += '</div>';
            }

            htmls.push('<div class="c-component-upload-img-item ' + (imgSource ? ' ' : 'default') + '">');
            htmls.push('<div>');
            htmls.push('<div class="move-style"><i class="icons-double-arrow"></i></div>');
            htmls.push('<div class="remove-style"><i class="icons-close2"></i></div>');
            htmls.push('<div class="editor-wrap">');
            htmls.push('<div class="img-wrap js-upload-img ' + (imgSource ? 'img-wrap-active' : '') + '">');
            htmls.push(imgHtml);
            htmls.push('</div>');
            htmls.push('<div class="btn-add-link-wrap">');
            if(item.imgLink && item.imgLink.data){
                htmls.push('<div class="btn-add-link active"><span>' + (item.imgLink.data.url ? item.imgLink.data.url : '无链接') + '</span><i class="icons-link2"></i></div>');
            } else {
                htmls.push('<div class="btn-add-link"><i class="icons-link"></i><span>链接目标</span></div>');
            }
            htmls.push('<p class="tip"></p></div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
        });

        return htmls.join('');
    };

    //添加拖拽
    UploadImg.prototype.newDrag = function(obj){
        var _this = this;
        this.move = new Move(obj);
        $(this.move).on('mouseUpEndd', function(){
            var index = arguments[1].index;
            var oldIndex = index[0];
            var newIndex = index[1];
            if(oldIndex == newIndex) return false;
            var oldKey = _this.opts.imgArr[oldIndex];
            _this.opts.imgArr.splice(oldIndex, 1);
            _this.opts.imgArr.splice(newIndex, 0, oldKey);
            $(_this).trigger('changeData', [{imgArr:_this.opts.imgArr}]);
        });
    };

    //显示删除和移动按钮的样式
    UploadImg.prototype.showRemove = function(){
        var $item = this.opts.parent.find('.c-component-upload-img-item').not('.default');
        if(this.opts.maxImgLen <= 1) return false;
        if(this.opts.len > 1){
            $item.find('.remove-style').addClass('active');
            $item.find('.move-style').addClass('active');
            $item.addClass('cursor');
        } else {
            $item.find('.remove-style').removeClass('active');
            $item.removeClass('cursor');
            $item.find('.move-style').removeClass('active');
        };
    };

    //删除项
    UploadImg.prototype.removeItem = function(obj){
        var $item = obj.parents('.c-component-upload-img-item');
        var iIndex = $item.parent('.upload-item-wrap').find('.c-component-upload-img-item').index($item);
        $item.remove();
        this.opts.imgArr.splice(iIndex, 1);
        this.opts.len--;
        this.opts.parent.find('.upload-max span').html(this.opts.maxImgLen - this.opts.len);
        if((this.opts.len <= this.opts.maxImgLen) && (this.opts.parent.find('.upload-item-wrap').children('.default').length < 1)){
            this.opts.parent.find('.upload-item-wrap').append(this.render());
            this.opts.parent.find('.upload-max span').html(this.opts.maxImgLen - this.opts.len);
        }
    };

    UploadImg.prototype.result = function(){
        return this.opts.imgArr;
    };
    module.exports = UploadImg;
});