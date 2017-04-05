define(function (require, exports, module) {
    var $ = MJQ;
    var Move = require('./plugin/move.js');
    var ImgCollection = require('../common/img-collection.js');
    var DialogLink = require('../common/dialog-link.js');

    function NavImg(opts){
        opts = opts || {};
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                style: 1,
                imgLen: 5,
                spacing: 5,
                imgInfo: [
                    {
                        imgId:'',
                        imgSource:'http://qmfx-s84664.s3.fy.shopex.cn/gpic/20161108/73ef0d21aa83b692d9ee97703fb9f284.png',
                        name:'分类',
                        imgSize: { w: 110, h: 110 },
                        type:1
                    },
                    {
                        imgId:'',
                        imgSource:'http://qmfx-s84664.s3.fy.shopex.cn/gpic/20161108/a36625bbfc14e03b4f49b7245c8e51fd.png',
                        name:'搜索',
                        imgSize: { w: 110, h: 110 },
                        type:4
                    },
                    {
                        imgId:'',
                        imgSource:'http://qmfx-s84664.s3.fy.shopex.cn/gpic/20161108/4c73abe54508d451759f979c877170b5.png',
                        name:'收藏',
                        imgSize: { w: 110, h: 110 },
                        type:2
                    },
                    {
                        imgId:'',
                        imgSource:'http://qmfx-s84664.s3.fy.shopex.cn/gpic/20161108/dd049e26cdba40b66bc47aa6b8c814ed.png',
                        name:'关注',
                        imgSize: { w: 110, h: 110 },
                        type:3
                    },
                    {
                        imgId:'',
                        imgSource:'http://qmfx-s84664.s3.fy.shopex.cn/gpic/20161108/6ea88c87ac362db1fd2001a0d29ae173.png',
                        name:'简介',
                        imgSize: { w: 110, h: 110 },
                        type:5
                    }
                ]
            }
        };
        this.parent = null;
        this.isSave = true;
        this.isDataTrue = true;
        this.defautlData = {
            imgId:'',
            imgSource:'',
            imgLink:'',
            name:'',
            type:''
        };
        this.defaultSetData = {};
        this.init(opts);
    };

    NavImg.prototype.constructor = NavImg;

    NavImg.prototype.init = function(opts){
        $.extend(true, this.opts, opts);
        $.extend(true, this.defaultSetData, this.opts.setData);
        if(!(this.opts.setData.imgInfo instanceof Array)){
            this.opts.setData.imgInfo = base.jsonToArray(this.opts.setData.imgInfo);
        }
        this.opts.setData.imgLen = this.opts.setData.imgInfo.length;
        var _this = this;
        this.parent = $('<div class="c-component-navImg" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">快捷入口设置</p></div>');
        this.styleParent = $('<div class="c-component-navImg-style"></div>');
        this.parent.append(this.styleParent.html(this.renderStyle()));
        this.uploadParent = $('<div class="c-component-upload-img"><div class="upload-item-wrap"></div></div>');
        this.renderUpload();
        this.parent.append(this.uploadParent);
        this.opts.parent.append(this.parent);


        this.parent.on('click', '.radio-list-wrap .radio-round, .radio-value', function(){
            _this.radioFn($(this));
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

    };

    NavImg.prototype.renderStyle = function(){
        var htmls = [], radioHtml=[], _this = this;

        $.each(['正方形', '圆形'], function(i, item){
            radioHtml.push('<div class="radio-list-item ' + ((i+1) == _this.opts.setData.style ? 'active' : '') + '" data-name="style" data-value="' + (i+1) + '">');
            radioHtml.push('<i class="radio-round"><em></em></i>');
            radioHtml.push('<p class="radio-value">' + item + '</p>');
            radioHtml.push('</div>');
        });

        htmls.push('<div class="c-component-navImg-hd">');
        htmls.push('<p class="pl-name"><span>*</span>样式选择：</p>');
        htmls.push('<div class="pl-content">');
        htmls.push('<div class="radio-list-wrap">' + radioHtml.join('') + '</div>');
        htmls.push('</div>');
        htmls.push('</div>');
        htmls.push('<div class="c-component-navImg-hd">');
        htmls.push('<p class="pl-name"><span>*</span>间距：</p>');
        htmls.push('<div class="pl-content">');
        htmls.push('<input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span>');
        htmls.push('</div>');
        htmls.push('</div>');

        return htmls.join('');
    };

    NavImg.prototype.radioFn = function(obj){
        var $parent = obj.parent();
        if($parent.hasClass('active')) return;
        var name = $parent.data('name');
        $parent.siblings($("[data-name=" + name + "]")).removeClass('active');
        $parent.addClass('active');
        this.opts.setData[name] = $parent.data('value');
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    NavImg.prototype.renderUpload = function(){
        var _this = this;

        this.renderUploadItem();
        if(this.opts.setData.imgLen < 5){
            this.renderUploadItem([{}]);
        }
        this.newDrag(this.uploadParent.find('.c-component-upload-img-item'));

        this.uploadParent.on('click', '.c-component-upload-img-item .remove-style', function(){
            var $that = $(this);
            new base.Dialog({
                headerTxt:'提示信息',
                content:'是否确定删除该图片',
                okCallback: function(){
                    _this.removeItem($that);
                }
            });
        });

        this.uploadParent.on('click', '.c-component-upload-img-item .js-upload-img', function(){
            _this.upload($(this), this);
        });

        this.parent.on('click', '.c-component-upload-img-item .title', function(e){
            _this.selectTarget($(this), e);
        });

        this.parent.on('click', '.c-component-upload-img-item .btn-add-link', function(){
            _this.addLink($(this));
        });

        this.parent.on('input', '.c-component-upload-img-item input[name=name]', function(e){
            var $parent = $(this).parent();
            var $item = $parent.parents('.c-component-upload-img-item');
            var $tipTxtLen = $parent.find('.tip-txt-len');
            var value = $(this).val();
            var maxLen = 4;
            var valueLen = Math.ceil(base.utils.strlen(value)/2);
            var iIndex = $item.parent().find('.c-component-upload-img-item').index($item);
            $parent.find('.t-error').remove();

            var nameArr = [];
            $.each(_this.opts.setData.imgInfo, function(i, item){
                var iIndex = $parent.parents('.upload-item-wrap').find('.c-component-upload-img-item').index($parent.parents('.c-component-upload-img-item'));
                if(i != iIndex){
                    nameArr.push(item.name);
                }
            });
            if(valueLen <= 0){
                $parent.append('<p class="t-error"><span>x</span>导航名称不能为空，请修改～</p>');
                $(this).css({'border':'1px solid #e75c45'});
            } else if($.inArray(value, nameArr) > -1 && iIndex != $.inArray(value, nameArr)){
                $parent.append('<p class="t-error"><span>x</span>导航名称已存在，请修改～</p>');
                $(this).css({'border':'1px solid #e75c45'});
            } else {
                $(this).css({'border':'1px solid #dddddd'});
                $parent.find('.t-error').remove();
            }
            var textLen = Math.ceil(base.utils.strlen($(this).val())/2);
            $tipTxtLen.html( (textLen > maxLen ? maxLen : textLen) + '/' + maxLen);
        });

        this.parent.on('blur', '.c-component-upload-img-item input[name=name]', function(){
            var $parent = $(this).parent();
            var $item = $parent.parents('.c-component-upload-img-item');
            var value = $(this).val();
            if($item.hasClass('default')){ return false;};
            var newVal = '';
            for(var i=0; i<value.length; i++){
                if(Math.ceil(base.utils.strlen(newVal)/2) < 4){
                    newVal += value.charAt(i);
                }
            }
            $(this).val(newVal);
            var iIndex = $item.parent().find('.c-component-upload-img-item').index($item);
            _this.opts.setData.imgInfo[iIndex].name = $(this).val();
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    NavImg.prototype.renderUploadItem = function(data){
        var uploadData = data || this.opts.setData.imgInfo;
        var htmls = [];
        var typeText = ['分类', '收藏', '关注', '搜索', '简介', '购物车', '创建链接'];
        $.each(uploadData, function(i, item){
            item.type = item.type || 7;
            item.name = item.name || '';

            var selectHtml = [];
            selectHtml.push('<div class="c-component-choose-time" data-value="' + item.type + '">');
            selectHtml.push('<div class="title"><p>' + typeText[item.type-1] +'</p><span><i></i></span></div>');
            selectHtml.push('<div class="option-wrap">');
            $.each(typeText, function(n, m){
                selectHtml.push('<div class="option ' + ((n+1) == item.type ? 'active' : '') + '" data-value="' + (n+1) + '">' + m + '</div>');
            });
            selectHtml.push('</div>');
            selectHtml.push('</div>');

            htmls.push('<div class="c-component-upload-img-item ' + (item.imgSource ? 'cursor' : 'default') +  '">');
            htmls.push('<div>');
            htmls.push('<div class="move-style ' + (item.imgSource ? 'active' : '') + '"><i class="icons-double-arrow"></i></div>');
            htmls.push('<div class="remove-style ' + (item.imgSource ? 'active' : '') + '"><i class="icons-close2"></i></div>');
            htmls.push('<div class="editor-wrap">');

            htmls.push('<div class="img-wrap js-upload-img img-wrap-tetragonal ' + (item.imgSource ? 'img-wrap-active' : '') + '">');
            if(item.imgSource){
                htmls.push('<img src="' + item.imgSource + '">');
            } else {
                htmls.push('<div><i class="icons-upload-img add"></i><p class="p1">建议尺寸 160*160px</p></div>');
            }
            htmls.push('</div>');

            htmls.push('<div class="nav-img-info-wrap">');
            htmls.push('<div class="nav-img-info-item">');
            htmls.push('<p class="i-txt1"><span>*</span>导航名称：</p>');
            htmls.push('<div class="t-content">');
            htmls.push('<input type="text" name="name" value="' + item.name + '" />');
            htmls.push('<p class="tip-txt-len">' + Math.ceil(base.utils.strlen(item.name)/2) + '/4</p>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('<div class="nav-img-info-item">');
            htmls.push('<p class="i-txt1"><span>*</span>目&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;标：</p>');
            htmls.push('<div class="t-content">' + selectHtml.join('') + '</div>');

            htmls.push('<div class="btn-add-link-wrap" style="margin-left: 10px; display: ' + (item.type == 7 ? 'block' : 'none') + '">');
            if(item.imgLink && item.imgLink.data){
                htmls.push('<div class="btn-add-link active"><span>' + (item.imgLink.data.url ? item.imgLink.data.url : '无链接') + '</span><i class="icons-link2"></i></div>');
            } else {
                htmls.push('<div class="btn-add-link"><i class="icons-link"></i><span>链接目标</span></div>');
            }
            htmls.push('</div>');


            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
        });

        this.uploadParent.find('.upload-item-wrap').append(htmls.join(''));
    };

    //删除项
    NavImg.prototype.removeItem = function(obj){
        var $item = obj.parents('.c-component-upload-img-item');
        var iIndex = $item.parent().find('.c-component-upload-img-item').index($item);
        if($item.siblings('.default').length<=0){
            this.renderUploadItem([{}]);
        }
        this.opts.setData.imgInfo.splice(iIndex, 1);
        this.opts.setData.imgLen--;
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);
        $item.remove();
    };

    //上传图片
    NavImg.prototype.upload = function(obj){
        var _this = this;
        var $item = obj.parents('.c-component-upload-img-item');
        var $imgWrap = $item.find('.img-wrap');
        var index = $item.parent().find('.c-component-upload-img-item').index($item);

        _this.ImgCollection = new ImgCollection();
        $(_this.ImgCollection).on('saveEnd', function(){
            var imgData = arguments[1].data[0];
            var imgSource = imgData.imgSource || '';
            var imgId = imgData.imgId || '';

            if($item.hasClass('default')){
                _this.opts.setData.imgLen++;
                $item.removeClass('default').addClass('cursor');
            }
            $item.find('.move-style, .remove-style').addClass('active');
            $imgWrap.addClass('img-wrap-active');
            $imgWrap.html('<img src="' + imgSource + '" >');

            _this.opts.setData.imgInfo[index] = _this.opts.setData.imgInfo[index] || {};
            _this.opts.setData.imgInfo[index].imgId = imgId;
            _this.opts.setData.imgInfo[index].imgSource = imgSource;
            // _this.opts.setData.imgInfo[index].imgLink = _this.defautlData.imgLink;
            _this.opts.setData.imgInfo[index].imgSize = imgData.imgSize || { w:0, h:0 };
            //_this.opts.setData.imgInfo[index].type = _this.defautlData.type;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
            if(_this.opts.setData.imgLen < 5){
                _this.renderUploadItem([{}]);
            }
        });
    };

    //选择目标
    NavImg.prototype.selectTarget = function(obj, e){
        var _this = this;
        var $parent = obj.parent('.c-component-choose-time');
        var $optionWrap = $parent.find('.option-wrap');
        var $item = obj.parents('.c-component-upload-img-item');
        var iIndex = $item.parent().find('.c-component-upload-img-item').index($item);

        if($optionWrap.is(":hidden")){
            $optionWrap.show();
            $optionWrap.css({'top': -$optionWrap.outerHeight()});
        }

        $optionWrap.on('click', '.option', function(e){
            $optionWrap.off('click', '.option');
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            var value = $(this).data('value');
            $parent.data('value', value);
            $parent.find('.title p').html($(this).html());
            $optionWrap.hide();

            // var iIndex = $parent.parents('.c-component-upload-img-item').index();
            if(_this.opts.setData.imgInfo[iIndex]){
                _this.opts.setData.imgInfo[iIndex].type = value;
                //_this.opts.setData.imgInfo[iIndex].name = $(this).html();
            } else {
                _this.defautlData.type = value;
                //_this.defautlData.name = $(this).html();
            }
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
            if(value == 7){
                $(this).parents('.t-content').siblings('.btn-add-link-wrap').show();
            } else {
                $(this).parents('.t-content').siblings('.btn-add-link-wrap').hide();
            }
            e.stopPropagation();
        });

        $(document).one("click", function(){
            $optionWrap.hide();
        });
        e.stopPropagation();
    };

    //添加链接
    NavImg.prototype.addLink = function(obj){
        var _this = this;
        var $item = obj.parents('.c-component-upload-img-item');
        var index = $item.parent().find('.c-component-upload-img-item').index($item);
        // var index = obj.parents('.c-component-upload-img-item').index();
        if(!this.opts.setData.imgInfo[index]){
            base.promptDialog({str:'请先上传图片', time:2000});
            return false;
        }
        if(base.utils.isJson(this.opts.setData.imgInfo[index].imgLink)){
            this.dialogLink = new DialogLink(this.opts.setData.imgInfo[index].imgLink);
        } else {
            this.dialogLink = new DialogLink();
        }

        $(this.dialogLink).on('saveEnd', function(){
            var link = arguments[1].data;
            obj.html('<span>' + (link.data.url ? link.data.url : '无链接') + '</span><i class="icons-link2"></i>');
            obj.addClass('active');
            _this.opts.setData.imgInfo[index].imgLink = link;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    //添加拖拽
    NavImg.prototype.newDrag = function(obj){
        var _this = this;
        this.move = new Move(obj);
        $(this.move).on('mouseUpEndd', function(){
            var index = arguments[1].index;
            var oldIndex = index[0];
            var newIndex = index[1];
            if(oldIndex == newIndex) return false;
            var oldKey = _this.opts.setData.imgInfo[oldIndex];
            _this.opts.setData.imgInfo.splice(oldIndex, 1);
            _this.opts.setData.imgInfo.splice(newIndex, 0, oldKey);
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    NavImg.prototype.result = function(){
        var errorLen = this.parent.find('.c-component-upload-img-item input[name]').parent().find('.t-error').length;
        if(errorLen > 0){
            this.isDataTrue = false;
            return this.defaultSetData;
        } else {
            this.isDataTrue = true;
            return this.opts.setData;
        }
    };

    module.exports = NavImg;

});