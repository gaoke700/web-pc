window.MJQ = window.MJQ || window.$;
(function(window, $){

    base.Tabs = Tabs;

    function Tabs(opts){
        this.opts = $.extend(true, {
            parent:$('body'),
            tabs:'ui-tabs',
            btns:'ui-tabs-menu-item',
            btnsParent:'ui-tabs-menu',
            btnsParentWrap:'ui-tabs-menu-wrap',
            content: 'ui-tabs-content-item',
            contentParent:'ui-tabs-content',
            event:'click',
            curIndex:0,
            curClassName:'ui-tabs-menu-item-active',
            autoCreate: false,
            autoCreateConfig:{
                menu:[],
                content: [],
                createCallback: function(){}
            }
        }, opts||{});
        this.index = this.opts.curIndex;
        this.isChange = true;
        this.init();
    }

    Tabs.prototype.init = function(){
        var thisOpts = this.opts;
        if(thisOpts.autoCreate){
            thisOpts.parent.append(this.create());
            thisOpts.autoCreateConfig.createCallback();
        }
        this.$tabs = thisOpts.parent.find('.' + thisOpts.tabs);
        this.$tabsBtns = this.$tabs.find('.' + thisOpts.btns);
        this.$tabsContents = this.$tabs.find('.' + thisOpts.content);
        this.change({index:this.opts.curIndex});
        this.event();
    };

    Tabs.prototype.event = function(){
        var _this = this;
        this.$tabsBtns.on(this.opts.event, function(){
            _this.change({ dom:$(this) });
        });
    };

    Tabs.prototype.change = function(opts){
        opts = opts || {};
        var oldIndex = this.index;
        var index = (opts.index === 0 || opts.index) ? opts.index : opts.dom.index();
        this.index = index;
        $(this).trigger('changeBefore', [{ index: index, oldIndex:oldIndex }]);
        if(!this.isChange){
            return false;
        }
        this.isChange = true;
        this.$tabsBtns.removeClass(this.opts.curClassName);
        this.$tabsBtns.eq(index).addClass(this.opts.curClassName);
        this.$tabsContents.hide();
        this.$tabsContents.eq(index).show();
        $(this).trigger('changeAfter', [{ index: index, oldIndex:oldIndex }]);
    };

    Tabs.prototype.create = function(){
        var htmls = [], menuHtml = [], contentHtml = [], thisOpts = this.opts;
        var autoCreateConfig = thisOpts.autoCreateConfig;
        $.each(autoCreateConfig.menu, function(i, item){
            menuHtml.push('<div class="' + thisOpts.btns + '">' + item + '</div>');
            contentHtml.push('<div class="' + thisOpts.content + '">' + autoCreateConfig.content[i] + '</div>');
        });

        var btnsParentHtml = thisOpts.btnsParent ? ('<div class="' + thisOpts.btnsParent + '">' + menuHtml.join('') + '</div>') : menuHtml.join('');

        htmls.push('<div class="' + thisOpts.tabs + '">');

        if(thisOpts.btnsParentWrap){
            htmls.push('<div class="ui-tabs-menu-wrap">' + btnsParentHtml + '</div>');
        } else {
            htmls.push(btnsParentHtml);
        }
        if(thisOpts.contentParent){
            htmls.push('<div class="' + thisOpts.contentParent + '">' + contentHtml.join('') + '</div>');
        } else {
            htmls.push(contentHtml.join(''));
        };
        htmls.push('</div>');
        return htmls.join('');
    };

    Tabs.prototype.changeContent = function(opts){
        var index = (opts.index === 0 || opts.index) ? opts.index : '';
        if(index === '') { return false; }
        this.$tabsContents.eq(index).html(opts.content || '');
        if(opts.callback) opts.callback();
    }

})(window, MJQ);
