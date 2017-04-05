define(function (require, exports, module) {
    var $ = MJQ;
    require('./jquery-plugin/pagination.js')($);

    function renderImgList(data){
        var htmls = [], data = data||[];

        $.each(data, function(i, item){
            var name = item.name || '未命名';
            var url = item.img || item.url || '';
            var width = item.width || 0;
            var height = item.height || 0;
            if(!url) return false;
            htmls.push('<div class="img-item js-btn-choose" data-id="' + (item.id || '') + '" data-width="' + width + '" data-height="' + height + '" data-url="' + url + '"><div>');
            htmls.push('<img src="' + url + '" />');
            htmls.push('<p class="name">' + name + '</p>');
            htmls.push('<div class="btn-choose"><i class="icons-tick4"></i></div>');
            htmls.push('</div></div>');
        });
        return htmls.join('');
    }

    function ajaxData(opts){
        var pageNum = opts.pageNum || 1;
        var callback = opts.callback || null;
        var obj = opts.obj || null;
        base.ajax({
            url: 'index.php?ctl=template/module&act=material',
            data: {
                pageNo: pageNum||1,
                pageSize: 12
            },
            success: function(result){
                var result = result.data || {};
                var count = result.count || 0;
                obj.find('.img-wrap').html(renderImgList(result.list||[]));
                if(callback){
                    callback(result, count);
                }
            }
        });
    };

    function pagingFn(obj){
        if(!obj) return false;
        var pageNum = 1;

        ajaxData({
            pageNum: pageNum,
            obj: obj,
            callback: function(data, count){
                obj.find('.pagination').Paging({
                    pagesize: 12,
                    count: count,
                    toolbar:true,
                    callback: function(page, size, count){
                        pageNum = page;
                        ajaxData({
                            pageNum: pageNum,
                            obj: obj
                        });
                    }
                });
            }
        });

    };

    function ImgCollection(opts){
        this.parent = $('<div class="c-f-img-collection"></div>');
        this.menu = $('<div class="c-f-img-collection-menu"><ul></ul></div>');
        this.container = $('<div class="c-f-img-collection-container"></div>');
        this.menuData = ['我的图片', '素材库'];
        this.dialog = null;
        this.data = [];
        this.opts = $.extend({
            index:0
        }, opts||{});
        this.init();
    };

    ImgCollection.prototype.constructor = ImgCollection;

    ImgCollection.prototype.init = function(){
        var _this = this;
        this.render();
        this.dialog = new base.Dialog({
            headerTxt:'选取图片',
            customContent: true,
            content:this.parent,
            okCallback: function(){
                if(_this.data.length < 1){
                    _this.dialog.saveThrough = false;
                    base.promptDialog({str:'请选择一张图片'});
                    return false;
                } else {
                    _this.dialog.saveThrough = true;
                    $(_this).trigger('saveEnd', [{data:_this.data}]);
                }
            }
        });

        this.menu.on('click', 'li', function(){
            if($(this).hasClass('active')) return false;
            _this.changeTab($(this).index());
        });

        this.container.on('click', '.js-btn-choose', function(){
            _this.chooseImg($(this));
        });

        this.container.on('click', '.btn-upload-img .input-upload-img', function(){
            if($(this).parent().hasClass('btn-upload-img-upload')) return false;
            $(this).on('change', function(){
                var $imgWrap = $(this).parent().siblings('.img-wrap');
                _this.uploadImg($imgWrap, this, $(this).parent());
            })
        });
    };

    ImgCollection.prototype.render = function(){
        var menuHtmls = [], containerHtmls = [], _this = this;
        $.each(this.menuData, function(i, item){
            menuHtmls.push('<li>' + item + '</li>');
            containerHtmls.push('<div class="c-f-img-collection-item" data-render="1"></div>');
        });
        this.menu.find('ul').html(menuHtmls.join(''));
        this.container.html(containerHtmls.join(''));
        this.parent.append(this.menu);
        this.parent.append(this.container);
        this.changeTab();
    };

    ImgCollection.prototype.changeTab = function(index){
        this.data = [];
        var index = index || this.opts.index;
        var $item = this.container.find('.c-f-img-collection-item');

        this.menu.find('li.active').removeClass('active');
        this.menu.find('li').eq(index).addClass('active');
        $item.hide();
        $item.eq(index).css({'display':'block'});
        if($item.eq(index).data('render') == 1){
            $item.eq(index).data('render', '2');
            $item.eq(index).html(this.renderItem()[index]);
            if(index == 1){
                pagingFn($item.eq(index));
            }
        }
    };

    ImgCollection.prototype.renderItem = function(){
        var arr = [], userImg = [], material = [];
        userImg.push('<div class="btn-upload-img"><input class="input-upload-img" type="file" accept="image/!*"><span>+</span>上传图片</div><div class="img-wrap"></div>');

        material.push('<div class="img-wrap"></div>');
        material.push('<div class="pagination"></div>');
        arr.push(userImg.join(''));
        arr.push(material.join(''));
        return arr;
    };

    ImgCollection.prototype.chooseImg = function(obj){
        var $imgWrap = obj.parents('.img-wrap');
        $imgWrap.find('.img-item-active').removeClass('img-item-active');
        obj.addClass('img-item-active');
        var imgUrl = obj.data('url') || obj.find('img').attr('src')||'';
        var imgId = obj.data('id') || '';
        var imgSize = {
            w: (obj.data('width') || 0),
            h: (obj.data('height') || 0)
        };
        this.data = [];
        this.data.push({
            imgId: imgId,
            imgSource: imgUrl,
            imgSize: imgSize
        });
    };

    ImgCollection.prototype.uploadImg = function($imgWrap, that, parent){
        var _this = this;
        if(typeof that.files == 'undefined') return false;
        var img = that.files[0];
        var imgSize = img.size;
        var imgUrl = base.utils.getUploadUrl(img);
        var imgName = img.name;
        if(Number(imgSize) > 2048000){
            base.promptDialog({str:'上传图片不能大于2M', time:2000});
            return false;
        }
        parent.addClass('btn-upload-img-upload');
        parent.html('上传中');
        base.uploadImg({
            img: img,
            url: 'index.php?ctl=template/module&act=newPic',
            success: function(result){
                parent.removeClass('btn-upload-img-upload');
                parent.html('<input class="input-upload-img" type="file" accept="image/!*"><span>+</span>上传图片');
                result = result || {};
                result.res = result.res || '';
                result.data = result.data || {};
                if(result.res == 'succ'){
                    var imgData = {
                        imgId: result.data.image_id||'',
                        imgSource: result.data.img_source||'',
                        id: result.data.image_id || '',
                        width: result.data.width || 0,
                        height: result.data.height || 0,
                    };
                    var iData = [{
                        name: imgName,
                        url: imgData.imgSource,
                        id: imgData.id,
                        width: imgData.width,
                        height: imgData.height
                    }];
                    $imgWrap.append(renderImgList(iData));
                    //$imgWrap.children().eq(0).attr('data-url', imgData.imgSource);
                    //$imgWrap.children().eq(0).attr('data-id', imgData.imgId);
                    _this.chooseImg(_this.container.children().eq(0).find('.js-btn-choose:last'));
                } else {
                    base.promptDialog({str:result.msg, time:2000});
                }
            },
            error: function(result){
                result = result || {};
                parent.removeClass('btn-upload-img-upload');
                parent.html('<input class="input-upload-img" type="file" accept="image/!*"><span>+</span>上传图片');
                base.promptDialog({str:result.msg||'上传失败'});
            }
        });
    };

    module.exports = ImgCollection;
});
