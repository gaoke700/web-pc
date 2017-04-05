define(function (require, exports, module) {
    var $ = MJQ;
    var tab = [
        { cName:'输入链接', eName:'input-link', fnName:'inputLink' },
        { cName:'商城页面', eName:'mall-page', fnName:'mallPage' },
        { cName:'商品分类', eName:'goods-category', fnName:'goodsCategory' },
        { cName:'商品详情', eName:'goods-info', fnName:'goodsInfo' },
        { cName:'自定义内页', eName:'custom-page', fnName:'customPage' }
        //{ cName:'免邮', eName:'no-mail', fnName:'noMail' },
        //{ cName:'优惠卷', eName:'coupons', fnName:'coupons' },
        //{ cName:'拼团', eName:'group', fnName:'group' },
        //{ cName:'满减/满送', eName:'full', fnName:'full' }
    ];
    var tabFn = {
        inputLink: require('./dialog-link/input-link.js'),
        mallPage: require('./dialog-link/mall-page.js'),
        //coupons: require('./dialog-link/load-list.js'),
        //group: require('./dialog-link/load-list.js'),
        //noMail: require('./dialog-link/load-list.js'),
        //full: require('./dialog-link/load-list.js'),
        goodsInfo: require('./dialog-link/load-list.js'),
        goodsCategory: require('./dialog-link/goods-category.js'),
        customPage: require('./dialog-link/custom-page.js')
    };

    function DialogLink(opts){
        this.opts = $.extend({
            indexName: 'input-link',
            data:{}
        }, opts||{});
        this.tab = tab;
        this.index = 0;
        this.dialog = null;
        this.parent = $('<div class="c-add-link"></div>');
        this.tabFn = {};
        this.init();
    };

    DialogLink.prototype.constructor = DialogLink;

    DialogLink.prototype.init = function(){
        var _this = this;
        this.index = base.utils.arrayFindkey(this.tab, 'eName', this.opts.indexName);
        this.index = this.index > -1 ? this.index : 0;
        this.oldIndex = this.index;

        this.create();
        this.parent.on('click', '.tab li', function(){
            _this.changeTab($(this).index());
        });

        this.parent.on('click', '.btn-wrap .btn-cancel', function(){
            _this.close();
        });

        this.parent.on('click', '.btn-wrap .btn-save', function(){
            _this.save();
        });
    };

    DialogLink.prototype.changeTab = function(index){
        index = index || 0;
        this.index = index;
        this.opts.indexName = this.tab[index].eName;
        var $item = this.parent.find('.content .item');
        var $tab = this.parent.find('.tab li').eq(index);
        var name = this.tab[index].fnName;

        $tab.siblings('.active').removeClass('active');
        $tab.addClass('active');
        $item.hide().eq(index).css({'display':'block'});

        if(!this.tabFn[name]){
            var data = {};
            if(base.jsonToArray(this.opts.data).length > 0){
                if(name == 'goodsInfo'){
                    data.type = name;
                    data.data = this.opts.data;
                } else {
                    data = this.opts.data;
                }
            }
            if(this.tab[this.oldIndex].fnName == name){
                this.tabFn[name] = new tabFn[name](data);
            } else {
                this.tabFn[name] = new tabFn[name]();
            }
            $item.eq(index).html(this.tabFn[name].render());
        }
    };

    DialogLink.prototype.close = function(){
        this.dialog.remove();
    };

    DialogLink.prototype.save = function(){
        this.close();
        var result = this.tabFn[this.tab[this.index].fnName].result() || {};
        this.opts.data = result;
        $(this).trigger('saveEnd', [{data:this.opts}]);
    };

    DialogLink.prototype.create = function(){
        this.parent.append(this.render());
        this.changeTab(this.index);
        this.dialog = new base.Dialog({
            headerTxt: '链接目标',
            content: this.parent,
            showBtn: false,
            customContent: true
        });
    };

    DialogLink.prototype.render = function(){
        var _this = this;
        var tabHead = [], tabContent = [];
        for(var i=0; i<this.tab.length; i++){
            var item = _this.tab[i];
            tabHead.push('<li data-name="' + item.fnName + '">' + item.cName + '</li>');
            tabContent.push('<div class="item ' + item.eName + '" style="display: none"></div>');
        }

        var allHtmls = [];
        allHtmls.push('<div class="tab"><ul>' + tabHead.join('') + '</ul></div>');
        allHtmls.push('<div class="content"><div class="item-wrap">' + tabContent.join('') + '</div></div>');
        allHtmls.push('<div class="btn-wrap"><div class="btn-save">保存</div><div class="btn-cancel">取消</div></div>');
        return allHtmls;
    };

    module.exports = DialogLink;
});