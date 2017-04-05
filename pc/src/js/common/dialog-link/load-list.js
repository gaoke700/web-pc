define(function (require, exports, module) {
    var $ = MJQ;

    var defaultOpt = {};
    defaultOpt.coupons = {
        ajaxUrl: 'index.php?ctl=template/module&act=getSearchCoupon',
        text:'搜索你想找的优惠券',
        renderTableHead: function(){
            var htmls = [];
            htmls.push('<div class="c-table-list span-1"></div>');
            htmls.push('<div class="c-table-list span-3">优惠劵名称</div>');
            htmls.push('<div class="c-table-list span-2">面值</div>');
            htmls.push('<div class="c-table-list width-auto">使用条件</div>');
            htmls.push('<div class="c-table-list span-3">领取条件</div>');
            htmls.push('<div class="c-table-list span-4">有效期</div>');
            htmls.push('<div class="c-table-list span-3">优惠劵总数</div>');
            return htmls.join('');
        },
        renderList: function(data) {
            var htmls = [], data = data || [];
            $.each(data, function (i, item) {
                htmls.push('<div class="c-table-body-item" data-url="' + (item.url || '') + '" data-id="' + (item.coupon_id || '') + '">');
                htmls.push('<div class="c-table-list span-1"><input type="radio" name="coupons"></div>');
                htmls.push('<div class="c-table-list span-3">' + (item.coupon_title || '') + '</div>');
                htmls.push('<div class="c-table-list span-2">¥' + (Number(item.price || 0).toFixed(2)) + '</div>');
                htmls.push('<div class="c-table-list width-auto">' + (item.min_payment_amount_desc || '') + '</div>');
                htmls.push('<div class="c-table-list span-3">' + (item.ip_send_num_desc || '') + '</div>');
                htmls.push('<div class="c-table-list span-4">' + (item.begin_time || new Date()) + '至<br />' + ((item.end_time || new Date())) + '</div>');
                htmls.push('<div class="c-table-list span-3">' + (item.total_num || 0) + '张</div>');
                htmls.push('</div>');
            });
            return htmls.join('');
        }
    };
    defaultOpt.noMail = {
        ajaxUrl: 'index.php?ctl=template/module&act=getGoods',
        renderTableHead: function(){
            var htmls = [];
            htmls.push('<div class="c-table-list span-1"></div>');
            htmls.push('<div class="c-table-list span-4">商品编码</div>');
            htmls.push('<div class="c-table-list width-auto">商品名称</div>');
            htmls.push('<div class="c-table-list span-2">商品图片</div>');
            htmls.push('<div class="c-table-list span-3">商品分类</div>');
            htmls.push('<div class="c-table-list span-2">商品价格</div>');
            htmls.push('<div class="c-table-list span-2">商品库存</div>');
            return htmls.join('');
        },
        renderList: function(data) {
            var htmls = [], data = data || [];
            $.each(data, function (i, item) {
                var bn = item.bn || '';
                var goodsId = item.goods_id || '';
                var name = item.name || '';
                var thumbnailPic = item.thumbnail_pic || '';
                var price = Number(item.price || 0).toFixed(2);
                var store = item.store || 0;
                var catId = item.cat_id || 0;
                var catName = item.cat_name || '';
                var url = item.url || '';

                htmls.push('<div class="c-table-body-item" data-url="' + url + '" data-id="' + goodsId + '">');
                htmls.push('<div class="c-table-list span-1"><input type="radio" name="goodsInfo"></div>');
                htmls.push('<div class="c-table-list span-4">' + bn + '</div>');
                htmls.push('<div class="c-table-list width-auto"><p class="name">' + name + '</p></div>');
                htmls.push('<div class="c-table-list span-2"><img style="width: 35px; height: 35px;" src="' + thumbnailPic + '"></div>');
                htmls.push('<div class="c-table-list span-3">' + catName + '</div>');
                htmls.push('<div class="c-table-list span-2">' + price + '</div>');
                htmls.push('<div class="c-table-list span-2">' + store + '</div>');
                htmls.push('</div>');
            });
            return htmls.join('');
        }
    };
    defaultOpt.group = {
        ajaxUrl: 'index.php?ctl=template/module&act=getSearchGroups',
        text:'搜索你想找的拼团',
        renderTableHead: function(){
            var htmls = [];
            htmls.push('<div class="c-table-list span-1"></div>');
            htmls.push('<div class="c-table-list span-4">拼团名称</div>');
            htmls.push('<div class="c-table-list width-auto">拼团商品</div>');
            htmls.push('<div class="c-table-list span-4">有效期</div>');
            htmls.push('<div class="c-table-list span-4">拼团价格</div>');
            return htmls.join('');
        },
        renderList: function(data) {
            var htmls = [], data = data || [];
            $.each(data, function (i, item) {
                htmls.push('<div class="c-table-body-item" data-url="' + (item.url || '') + '" data-id="' + (item.goods_id || '') + '">');
                htmls.push('<div class="c-table-list span-1"><input type="radio" name="group"></div>');
                htmls.push('<div class="c-table-list span-4">' + (item.act_name || '') + '</div>');
                htmls.push('<div class="c-table-list width-auto">' + (item.goods_name || '') + '</div>');
                htmls.push('<div class="c-table-list span-4">' + (item.begin_time || new Date()) + '至<br />' + ((item.end_time || new Date())) + '</div>');
                htmls.push('<div class="c-table-list span-4"><p class="tuan-num"><span class="s1">' + (item.person_num||0) + '人团</span><span class="s2">¥' + (Number(item.act_price || 0).toFixed(2)) + '</span></p></div>');
                htmls.push('</div>');
            });
            return htmls.join('');
        }
    };
    defaultOpt.full = {
        ajaxUrl: 'index.php?ctl=template/module&act=getSearchMj',
        text:'',
        renderTableHead: function(){
            var htmls = [];
            htmls.push('<div class="c-table-list span-1"></div>');
            htmls.push('<div class="c-table-list span-4">活动名称</div>');
            htmls.push('<div class="c-table-list span-4">有效期</div>');
            htmls.push('<div class="c-table-list span-4">优惠方式</div>');
            htmls.push('<div class="c-table-list width-auto">优惠条件</div>');
            return htmls.join('');
        },
        renderList: function(data) {
            var htmls = [], data = data || [];
            $.each(data, function (i, item) {
                htmls.push('<div class="c-table-body-item" data-url="' + (item.url || '') + '" data-id="' + (item.mj_id || '') + '">');
                htmls.push('<div class="c-table-list span-1"><input type="radio" name="full"></div>');
                htmls.push('<div class="c-table-list span-4">' + (item.mj_name || '') + '</div>');
                htmls.push('<div class="c-table-list span-4">' + (item.start_time || new Date()) + '至<br />' + ((item.end_time || new Date())) + '</div>');
                htmls.push('<div class="c-table-list span-4">' + (item.rules_type || '') + '</div>');
                htmls.push('<div class="c-table-list width-auto">' + (item.desc || '') + '</div>');
                htmls.push('</div>');
            });
            return htmls.join('');
        }
    };
    defaultOpt.goodsInfo = {
        ajaxUrl: 'index.php?ctl=template/module&act=getSearchGoods',
        text:'搜索你想找的商品',
        renderTableHead: function(){
            var htmls = [];
            htmls.push('<div class="c-table-list span-1"></div>');
            htmls.push('<div class="c-table-list span-4">商品编码</div>');
            htmls.push('<div class="c-table-list width-auto">商品名称</div>');
            htmls.push('<div class="c-table-list span-2">商品图片</div>');
            htmls.push('<div class="c-table-list span-3">商品分类</div>');
            htmls.push('<div class="c-table-list span-2">商品价格</div>');
            htmls.push('<div class="c-table-list span-2">商品库存</div>');
            return htmls.join('');
        },
        renderList: function(data) {
            var htmls = [], data = data || [];
            $.each(data, function (i, item) {
                var bn = item.bn || '';
                var goodsId = item.goods_id || '';
                var name = item.name || '';
                var thumbnailPic = item.thumbnail_pic || '';
                var price = Number(item.price || 0).toFixed(2);
                var store = item.store || 0;
                var catId = item.cat_id || 0;
                var catName = item.cat_name || '';
                var url = item.url || '';

                htmls.push('<div class="c-table-body-item" data-url="' + url + '" data-id="' + goodsId + '">');
                htmls.push('<div class="c-table-list span-1"><input type="radio" name="goodsInfo"></div>');
                htmls.push('<div class="c-table-list span-4">' + bn + '</div>');
                htmls.push('<div class="c-table-list width-auto"><p class="name">' + name + '</p></div>');
                htmls.push('<div class="c-table-list span-2"><img style="width: 35px; height: 35px;" src="' + thumbnailPic + '"></div>');
                htmls.push('<div class="c-table-list span-3">' + catName + '</div>');
                htmls.push('<div class="c-table-list span-2">' + price + '</div>');
                htmls.push('<div class="c-table-list span-2">' + store + '</div>');
                htmls.push('</div>');
            });
            return htmls.join('');
        }
    };

    function LoadList(opts){
        this.parent = $('<div class="c-f-choose-product-conditions"></div>');
        this.data = {};
        this.requestData = [];
        this.pageNum = 1;
        this.pageSize = 10;
        this.opts = $.extend({
            type:'goodsInfo',
            data: {
                url:'',
                id:''
            }
        }, opts||{});

        this.init();
    };

    LoadList.prototype.constructor = LoadList;

    LoadList.prototype.init = function(){
        var _this = this;
    };

    LoadList.prototype.render = function(){
        var htmls = [], _this = this;

        if(this.opts.type != 'noMail'){
            htmls.push('<div class="c-f-choose-product-bar">');
            htmls.push('<div class="func">');
            if(this.opts.type == 'goodsInfo'){
                htmls.push('<div class="c-select choose-key" data-value="name" style="width: 130px;">');
                htmls.push('<div class="c-select-title"><p>商品名称</p><span><i></i></span></div>');
                htmls.push('<div class="c-select-option-wrap">');
                htmls.push('<div class="c-select-option" data-value="name">商品名称</div>');
                htmls.push('<div class="c-select-option" data-value="bn">商品编号</div>');
                htmls.push('<div class="c-select-option" data-value="pbn">商品货号</div>');
                htmls.push('</div>');
                htmls.push('</div>');
            }
            htmls.push('<input class="input-val js-input-val" type="text" placeholder="' + defaultOpt[this.opts.type].text + '">');
            htmls.push('<span class="btn-ok js-btn-ok" data-status="true">搜索</span>');
            htmls.push('</div>');
            htmls.push('</div>');
        }

        htmls.push('<div class="c-table c-f-choose-list">');
        htmls.push('<div class="c-table-head">');
        htmls.push(defaultOpt[this.opts.type].renderTableHead());
        htmls.push('</div>');
        htmls.push('<div class="c-table-body product-list-wrap" style="height:' + (this.opts.type == 'noMail' ? '314' : '270') + 'px; overflow-y: auto; overflow-x: hidden;"></div>');
        htmls.push('</div>');

        htmls.push('<div class="pagination" style="padding-top: 10px;"></div>');

        this.parent.html(htmls.join(''));

        this.productBar = this.parent.find('.c-f-choose-product-bar');
        this.productListWrap = this.parent.find('.c-f-choose-list');
        //if(!this.opts.data.id){
        //    //_this.productListWrap.find('.product-list-wrap').html(defaultOpt[_this.opts.type].renderList([]));
        //    _this.productListWrap.find('.product-list-wrap').html('sadfasdf');
        //} else {
        //}
        if(this.opts.type == 'goodsInfo'){
            this.requestData[0] = 'goods_id';
            this.requestData[1] = this.opts.data.id;
        }

        this.paging();

        this.productListWrap.on('click', 'input[type=radio]', function(){
            _this.change($(this));
        });

        this.productBar.on('click', '.js-btn-ok', function(){
            if(_this.opts.type == 'goodsInfo'){
                _this.requestData[0] = _this.productBar.find('.choose-key').data('value');
            } else if(_this.opts.type == 'full'){
                _this.requestData[0] = 'mj_name';
            } else if(_this.opts.type == 'group'){
                _this.requestData[0] = 'act_name';
            } else if(_this.opts.type == 'coupons'){
                _this.requestData[0] = 'coupon_title';
            }

            _this.requestData[1] = _this.productBar.find('.input-val').val();
            _this.paging();
        });
        return this.parent;
    };

    LoadList.prototype.paging = function(){
        var _this = this;
        this.request({
            callback: function(data, count){
                _this.productListWrap.siblings('.pagination').html('');
                _this.productListWrap.siblings('.pagination').Paging({
                    pagesize: _this.pageSize,
                    count: count,
                    toolbar:true,
                    callback: function(page, size, count){
                        _this.pageNum = page;
                        _this.request();
                    }
                });
            }
        });
    };

    LoadList.prototype.request = function(opts){
        opts = opts || {};
        var _this = this;
        var callback = opts.callback || null;

        var data = {
            pageNo: this.pageNum,
            pageSize: this.pageSize
        };
        if(this.opts.type == 'noMail'){
            data.free_postage = 1;
        } else {
            data[this.requestData[0]] = this.requestData[1];
        }
        base.ajax({
            url: defaultOpt[this.opts.type].ajaxUrl,
            data: data,
            success: function(result){
                var result = result.data || {};
                var count = result.count || 0;
                _this.productListWrap.find('.product-list-wrap').html(defaultOpt[_this.opts.type].renderList(result.list||[]));
                if(callback){
                    callback(result, count);
                }
            }
        });
    };

    LoadList.prototype.change = function(obj){
        var $parent = obj.parents('.c-table-body-item');
        this.data.url = $parent.data('url');
        this.data.id = $parent.data('id');
    };
    LoadList.prototype.result = function(){
        return this.data;
    };

    module.exports = LoadList;
});
