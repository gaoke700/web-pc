define(function (require, exports, module) {
    var $ = MJQ;
    var ChooseProductConditions = require('../common/choose-product-conditions.js');
    var ChooseProduct = require('../common/choose-product.js');
    var Move = require('./plugin/move.js');

    function ProductList(opts){
        opts = opts || {};
        this.opts = {
            parent: $('body'),
            setData: {
                sign: '',
                id: '',
                layout: 1,
                imgStyle: 1,
                goodsNum: 1,
                showListName: 1,
                spacing: 5,
                goodsChoose: [
                    //{ type:1, data:[1,2,3,4], name:'1' },
                    //{ type:1, data:[1,2,3,4], name:'1' },
                    //{ type:1, data:[1,2,3,4], name:'1' },
                    //{ type:2, data:[1,2,3,4], name:'' }
                ],
                goodsAttr: {
                    showGoodsName: 'true',
                    showPrice: 'true',
//                  showCollection: 'true',
                    showBuyBtn: 'true',
                    showBuyNum: 'true'
                },
                goodsSort: 1
            }
        };
        this.parent = null;
        this.isDataTrue = true;
        this.isSave = true;
        this.defaultSetData = {};
        this.init(opts);
    };

    ProductList.prototype.constructor = ProductList;

    ProductList.prototype.init = function(opts){
        $.extend(true, this.opts, opts);
        $.extend(true, this.defaultSetData, this.opts.setData);
        if(!(this.opts.setData.goodsChoose instanceof Array)){
            this.opts.setData.goodsChoose = base.jsonToArray(this.opts.setData.goodsChoose);
        }
        var _this = this;
        this.parent = $('<div class="c-component-productList" data-sign="' + this.opts.setData.sign + '" data-id="' + this.opts.setData.id + '"><p class="set-text">商品列表设置</p></div>');
        this.uploadParent = $('<div class="c-component-upload-img"><div class="upload-item-wrap"></div></div>');
        this.render();
        this.opts.parent.append(this.parent);
        this.showBtnAddGoods();

        if(this.opts.setData.goodsChoose.length <= 0){
            this.addGoodsInfo();
        }
        this.newDrag(this.parent.find('.c-component-upload-img-item'));
        this.parent.on('click', '.radio-list-wrap .radio-round, .radio-value', function(){
            _this.radioFn($(this));
        });

        this.parent.on('click', '.pl-c-attr li span, p', function(){
            _this.goodsAttrCheck($(this));
        });

        this.parent.on('click', '.pl-c-sort .title', function(e){
            _this.goodsSort($(this), e);
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

        this.parent.on('click', '.pl-add-goods-wrap .btn-pl-list', function(){
            _this.addGoodsInfo();
        });

        this.uploadParent.on('click', '.c-component-upload-img-item .remove-style', function(){
            var $that = $(this);
            new base.Dialog({
                headerTxt:'提示信息',
                content:'是否确定删除该列表',
                okCallback: function(){
                    var $parent = $that.parents('.c-component-upload-img-item');
                    var iIndex = $parent.index();
                    $parent.remove();
                    _this.opts.setData.goodsChoose.splice(iIndex, 1);
                    _this.isSave = false;
                    _this.showBtnAddGoods();
                    $(_this).trigger('changeData', [{ data: _this.result() }]);
                }
            });
        });

        this.parent.on('input', '.c-component-upload-img-item input[name=listName]', function(e){
            var $parent = $(this).parent();
            var $tipTxtLen = $parent.find('.tip-txt-len');
            var value = $(this).val();
            var maxLen = 6;
            var valueLen = Math.ceil(base.utils.strlen(value)/2);
            var iIndex = $parent.parents('.upload-item-wrap').find('.c-component-upload-img-item').index($parent.parents('.c-component-upload-img-item'));
            $parent.find('.t-error').remove();
            if(valueLen <= 0){
                $parent.append('<p class="t-error"><span>x</span>导航名称不能为空，请修改～</p>');
                $(this).css({'border':'1px solid #e75c45'});
            } else if((base.utils.arrayFindkey(_this.opts.setData.goodsChoose, 'name', value) > -1) && iIndex != base.utils.arrayFindkey(_this.opts.setData.goodsChoose, 'name', value)){
                $parent.append('<p class="t-error"><span>x</span>列表名称已存在，请修改～</p>');
                $(this).css({'border':'1px solid #e75c45'});
            } else {
                $(this).css({'border':'1px solid #dddddd'});
                $parent.find('.t-error').remove();
            }
            var textLen = Math.ceil(base.utils.strlen($(this).val())/2);
            $tipTxtLen.html( (textLen > maxLen ? maxLen : textLen) + '/' + maxLen);
        });
        this.parent.on('blur', '.c-component-upload-img-item input[name=listName]', function(){
            var $parent = $(this).parent();
            var $item = $parent.parents('.c-component-upload-img-item');
            var value = $(this).val();
            if($item.hasClass('default')){ return false;};
            var newVal = '';
            for(var i=0; i<value.length; i++){
                if(Math.ceil(base.utils.strlen(newVal)/2) < 6){
                    newVal += value.charAt(i);
                }
            }
            $(this).val(newVal);
            var iIndex = $item.parent().find('.c-component-upload-img-item').index($item);
            _this.opts.setData.goodsChoose[iIndex].name = $(this).val();
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
        });
    };

    ProductList.prototype.render = function(){
        var htmls = [], _this = this;
        var defaultOpt = {
            layout: {
                name: '默认显示布局：',
                data: ['<i class="icons-product-1"></i><span>列表式</span>', '<i class="icons-product-2"></i><span>橱窗式</span>', '<i class="icons-product-4"></i><span>海报式</span>']
            },
            imgStyle: {
                name: '图片展示样式：',
                data: ['<i class="icons-product-4"></i><span>正方形</span>', '<i class="icons-product-3"></i><span>长方形</span>']
            },
            goodsNum: {
                name: '显示商品个数：',
                data: [6, 12, 18]
            },
            showListName: {
                name: '是否显示列表名称：',
                data: ['显示', '隐藏']
            },
            goodsAttr: {
                name: '显示商品属性：',
                data: [
                    { type: 'showGoodsName', text:'显示商品名称' },
                    { type: 'showPrice', text:'显示价格' },
//                  { type: 'showCollection', text:'显示收藏' },
                    { type: 'showBuyBtn', text:'显示购买按钮' },
                    { type: 'showBuyNum', text:'显示想买数' }
                ]
            },
            goodsSort: {
                name: '商品排序设置：',
                data: ['销量从高到低', '销量从低到高', '价格从高到低', '价格从低到高', '库存从高到低', '库存从低到高', '更新时间由近至远', '更新时间由远至近']
            }
        };
        var defaultHtml = {};

        $.each(defaultOpt, function(i, item){
            var name = i, data = item;
            defaultHtml[name] = [];
            defaultHtml[name].push('<div class="c-component-productList-hd" style="-webkit-box-align: start; ' + (name == 'goodsAttr' ? 'border-top:1px dashed #f7efe2; padding-bottom: 10px;' : '') + '">');
            defaultHtml[name].push('<p class="pl-name"><span class="s1">*</span><span>' + data.name + '</span></p>');
            defaultHtml[name].push('<div class="pl-content">');

            if(name == 'goodsAttr'){
                defaultHtml[name].push('<div class="pl-c-attr"><ul>');
                $.each(data.data, function(n, m){
                    defaultHtml[name].push('<li data-type="' + m.type + '" class="' + (_this.opts.setData[name][m.type] == 'true' ? 'active' : '') + '"><div><span><i class="icons-tick3"></i></span><p>' + m.text + '</p></div></li>');
                });
                defaultHtml[name].push('</ul></div>');
            } else if(name == 'goodsSort'){
                defaultHtml[name].push('<div class="pl-c-sort c-component-choose-time" data-value="' + _this.opts.setData[name] + '"><div class="title"><p>' + data.data[_this.opts.setData[name]-1] + '</p><span><i></i></span></div><div class="option-wrap">');
                $.each(data.data, function(n, m){
                    defaultHtml[name].push('<div class="option ' + (_this.opts.setData[name] == (n+1) ? 'active' : '') + '" data-value="' + (n+1) + '">' + m + '</div>');
                });
                defaultHtml[name].push('</div></div>');
            } else {
                defaultHtml[name].push('<div class="radio-list-wrap">');
                $.each(data.data, function(n, m){
                    defaultHtml[name].push('<div style="height: 38px;" class="radio-list-item ' + ((n+1) == _this.opts.setData[name] ? 'active' : '') + '" data-name="' + name + '" data-value="' + (n+1) + '">');
                    defaultHtml[name].push('<i class="radio-round"><em></em></i><p class="radio-value">' + m + '</p></div>');
                });
                defaultHtml[name].push('</div>');
            }

            defaultHtml[name].push('</div>');
            defaultHtml[name].push('</div>');
        });

        htmls.push('<div class="c-component-productList-wrap">');
        htmls.push('<p class="p-l-t1">列表排版样式设置</p>');
        htmls.push('<div class="c-component-productList-1">');
        htmls.push(defaultHtml.layout.join(''));
        htmls.push(defaultHtml.imgStyle.join(''));
        htmls.push(defaultHtml.goodsNum.join(''));
        htmls.push('</div>');
        htmls.push('<p class="p-l-t1">列表详情设置</p>');
        htmls.push('<div class="c-component-productList-1">');
        htmls.push(defaultHtml.showListName.join(''));
        htmls.push('<div class="pl-add-goods-wrap">');
        htmls.push('<div class="btn-pl-list"><span>+</span>新建列表</div>');
        htmls.push('</div>');
        htmls.push(defaultHtml.goodsAttr.join(''));
        htmls.push(defaultHtml.goodsSort.join(''));
        htmls.push('<div class="c-component-productList-hd" style="-webkit-box-align: start; margin-top: 10px;"><p class="pl-name"><span class="s1">*</span><span>间距：</span></p><div class="pl-content"><input class="input-spacing" style="width: 50px;" type="text" value="' + this.opts.setData.spacing + '" /><span style="padding-left: 5px;">px</span></div></div>');
        htmls.push('</div>');
        htmls.push('</div>');
        this.parent.append(htmls.join(''));
        this.renderAddPlList();
        this.parent.find('.pl-add-goods-wrap').prepend(this.uploadParent);
    };

    ProductList.prototype.renderAddPlList = function(data){
        var data = data || this.opts.setData.goodsChoose;
        var htmls = [], _this = this;

        $.each(data, function(i, item){
            item.name = item.name || '';
            item.type = item.type || 1;
            var goodsChooseHtml = [], iIndex = i;
            $.each(['按条件选取', '手动添加'], function(n, m){
                goodsChooseHtml.push('<div class="radio-list-item ' + (item.type == (n+1) ? 'active' : '') + '" data-name="plType" data-value="' + (n+1) + '"><i class="radio-round"><em></em></i><p class="radio-value">' + m + '</p></div>');
            });

            htmls.push('<div class="c-component-upload-img-item cursor">');
            htmls.push('<div>');
            htmls.push('<div class="move-style active" style="height: 120px;"><i class="icons-double-arrow"></i></div>');
            htmls.push('<div class="remove-style active"><i class="icons-close2"></i></div>');
            htmls.push('<div class="pl-editor-wrap">');
            htmls.push('<div>');
            htmls.push('<div class="pl-editor-item ' + (_this.opts.setData.showListName == 1 ? '' : 'pl-editor-item-active') + '">');
            htmls.push('<p class="pl-name"><span class="s1">*</span><span>列表名称：</span></p>');
            htmls.push('<div class="pl-content">');
            htmls.push('<div class="pl-editor-item-name">');
            htmls.push('<input type="text" name="listName" value="' + item.name + '" placeholder="请输入专属的列表名称">');
            htmls.push('<p class="tip-txt-len">' + Math.ceil(base.utils.strlen(item.name)/2) + '/6</p>');
            //htmls.push('<p class="t-error"><span>x</span>导航名称已超过6个字符，请修改～</p>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('<div class="pl-editor-item">');
            htmls.push('<p class="pl-name"><span class="s1">*</span><span>选取商品：</span></p>');
            htmls.push('<div class="pl-content">');
            htmls.push('<div class="radio-list-wrap">');
            htmls.push(goodsChooseHtml.join(''));
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('</div>');
        });

        this.uploadParent.find('.upload-item-wrap').append(htmls.join(''));
    };

    ProductList.prototype.radioFn = function(obj){
        var $parent = obj.parent(), _this = this;
        var name = $parent.data('name');
        $parent.siblings($("[data-name=" + name + "]")).removeClass('active');
        $parent.addClass('active');

        var iIndex = $parent.parents('.upload-item-wrap').find('.c-component-upload-img-item').index($parent.parents('.c-component-upload-img-item'));
        if(name == 'plType'){
            this.opts.setData.goodsChoose[iIndex].type = $parent.data('value');
        } else {
            this.opts.setData[name] = $parent.data('value');
        }
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);

        if($parent.data('name') == 'plType'){
            this.opts.setData.goodsChoose[iIndex].data = this.opts.setData.goodsChoose[iIndex].data || {};
            if($parent.data('value') == 1){
                this.opts.setData.goodsChoose[iIndex].data[1] = this.opts.setData.goodsChoose[iIndex].data[1] || {};
                this.ChooseProductConditions = new ChooseProductConditions(this.opts.setData.goodsChoose[iIndex].data[1]);
                $(this.ChooseProductConditions).on('saveEnd', function(){
                    _this.opts.setData.goodsChoose[iIndex].data[1] = arguments[1].data || {};
                    $(_this).trigger('changeData', [{ data: _this.result() }]);
                })
            } else {
                this.opts.setData.goodsChoose[iIndex].data[2] = this.opts.setData.goodsChoose[iIndex].data[2] || [];
                this.ChooseProduct = new ChooseProduct({data:this.opts.setData.goodsChoose[iIndex].data[2]});
                $(this.ChooseProduct).on('saveEnd', function(){
                    _this.opts.setData.goodsChoose[iIndex].data[2] = arguments[1].data || {};
                    $(_this).trigger('changeData', [{ data: _this.result() }]);
                })
            }
        }

        if(name == 'showListName'){
            if($parent.data('value') == 1){
                $.each(this.uploadParent.find('.c-component-upload-img-item'), function(i, item){
                    $(item).find('.pl-editor-item').eq(0).removeClass('pl-editor-item-active');
                });
            } else {
                $.each(this.uploadParent.find('.c-component-upload-img-item'), function(i, item){
                    $(item).find('.pl-editor-item').eq(0).addClass('pl-editor-item-active');
                });
            }
        }
    };

    ProductList.prototype.goodsAttrCheck = function(obj){
        var $parent = obj.parents('li');
        if($parent.hasClass('active')){
            $parent.removeClass('active');
            this.opts.setData.goodsAttr[$parent.data('type')] = false;
        } else {
            $parent.addClass('active');
            this.opts.setData.goodsAttr[$parent.data('type')] = true;
        }
        this.isSave = false;
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    ProductList.prototype.goodsSort = function(obj, e){
        var _this = this;
        var $parent = obj.parent('.pl-c-sort');
        var $optionWrap = $parent.find('.option-wrap');

        if($optionWrap.is(":hidden")){
            $optionWrap.show();
            $optionWrap.css({'top': -$optionWrap.outerHeight()});
        }

        $optionWrap.on('click', '.option', function(e){
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            var value = $(this).data('value');
            $parent.data('value', value);
            $parent.find('.title p').html($(this).html());
            $optionWrap.hide();
            _this.opts.setData.goodsSort = value;
            _this.isSave = false;
            $(_this).trigger('changeData', [{ data: _this.result() }]);
            e.stopPropagation();
        });

        $(document).one("click", function(){
            $optionWrap.hide();
        });
        e.stopPropagation();
    };

    ProductList.prototype.showBtnAddGoods = function(){
        if(this.opts.setData.goodsChoose.length >= 4){
            this.parent.find('.pl-add-goods-wrap .btn-pl-list').hide();
        } else {
            this.parent.find('.pl-add-goods-wrap .btn-pl-list').show();
        }
    };

    ProductList.prototype.addGoodsInfo = function(){

        if(this.opts.setData.goodsChoose.length>=4){
            return false;
        }
        var data = {
            type:1,
            data:{
                1:{},
                2:[]
            },
            name:''
        };
        this.renderAddPlList([data]);
        var $item = this.uploadParent.find('.upload-item-wrap .c-component-upload-img-item');
        if($item.eq($item.length-1).length>0){
            console.log(1)
            this.newDrag($item.eq($item.length-1));
        }

        this.opts.setData.goodsChoose.push(data);
        this.isSave = false;
        this.showBtnAddGoods();
        $(this).trigger('changeData', [{ data: this.result() }]);
    };

    //添加拖拽
    ProductList.prototype.newDrag = function(obj){
        var _this = this;
        this.move = new Move(obj);
        $(this.move).on('mouseUpEndd', function(){
            var newArr = [];
            for(var i=0; i<_this.opts.setData.goodsChoose.length; i++){
                newArr.push(_this.opts.setData.goodsChoose[i]);
            }
            var index = arguments[1].index;
            var oldIndex = index[0];
            var newIndex = index[1];
            if(oldIndex == newIndex) return false;
            var oldKey = newArr[oldIndex];
            newArr.splice(oldIndex, 1);
            newArr.splice(newIndex, 0, oldKey);
            _this.opts.setData.goodsChoose = newArr;
        });
    };

    ProductList.prototype.result = function(){
        var errorLen = this.parent.find('.c-component-upload-img-item input[name=listName]').parent().find('.t-error').length;
        if(errorLen > 0){
            this.isDataTrue = false;
            return this.defaultSetData;
        } else {
            this.isDataTrue = true;
            return this.opts.setData;
        }
    };

    module.exports = ProductList;
});