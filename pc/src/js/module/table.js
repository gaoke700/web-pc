define(function (require, exports, module) {
    var UiTable = require('./ui-table.js');
    require('../common/jquery-plugin/pagination2.js')($);

    function Table(opts){
        this.opts = $.extend(true, {
            parent:$('body'),
            tableConfig:{},
            url:'openapi.php?act=getList',
            ajaxData:{
                pageSize:10,
                pageNo:1,
                data:{}
                //orderType: 'modify asc'
            },
            renderItemFn: function(){},
            renderItemCallback: function(){}
        }, opts||{});
        this.data = {};
        this.showPaging = false;
        this.init();
        this.ajaxData = null;
    }

    Table.prototype.constructor = Table;

    Table.prototype.init = function(){
        var opt = this.opts.tableConfig;
        opt.parent = this.opts.parent;
        this.UiTable = new UiTable(opt);
        this.pagingDom = $('<div class="pagination" style="padding-top: 10px;"></div>');
        this.opts.parent.append(this.pagingDom);
        this.ajax();
        this.event();
    };

    Table.prototype.ajax = function(opts){
        opts = opts || {};
        if(opts.select){
            this.opts.ajaxData.data.select = opts.select;
            this.opts.ajaxData.pageNo = 1;
            this.showPaging = false;
        }
        var _this = this;
        _this.UiTable.checkAll({checkAll:false});
        _this.UiTable.load({
            callback: function(){
                base.ajax({
                    url:_this.opts.url,
                    data:_this.opts.ajaxData,
                    type:'post',
                    success: function(result){
                        result = result || {};
                        if(result.res == 'succ'){
                            var data = result.result || {};
                            _this.data = data;
                            data.list = data.list || [];
                            _this.UiTable.data = data.list;
                            _this.UiTable.allData = _this.data;
                            _this.renderItem(data.list);
                            if(data.list.length > 0){
                                if(!_this.showPaging || opts.refresh){
                                    _this.pagingDom.html('');
                                    _this.paging();
                                }
                            } else {
                                _this.pagingDom.html('');
                            }
                        } else {
                            _this.UiTable.renderBody({error:'接口出错'});
                        }
                    }
                });
            }
        });
    };

    Table.prototype.paging = function(){
        var _this = this;
        this.showPaging = true;
        this.pagingDom.Paging2({
            pagesize: this.opts.ajaxData.pageSize,
            count: this.data.count || 0,
            current: this.opts.ajaxData.pageNo,
            toolbar:true,
            callback: function(page, size, count){
                _this.opts.ajaxData.pageNo = page;
                _this.ajax();
            }
        })
    };

    Table.prototype.renderItem = function(data){
        var _this = this;
        var arr = this.opts.renderItemFn(data);
        this.UiTable.renderBody(arr, function(){
            if(_this.opts.renderItemCallback) _this.opts.renderItemCallback();
        });
    };

    Table.prototype.event = function(){
        var _this = this;
        this.UiTable.table.on('click', '.js-btn-sort', function(){
            var name = $(this).data('name');
            var sort = $(this).data('sort');
            if(sort == 'desc'){
                sort = 'asc';
                $(this).find('.ui-table-icon1').removeClass('iconss-jiantouxia');
                $(this).find('.ui-table-icon1').addClass('iconss-jiantoushang');
            } else {
                sort = 'desc';
                $(this).find('.ui-table-icon1').removeClass('iconss-jiantoushang');
                $(this).find('.ui-table-icon1').addClass('iconss-jiantouxia');
            }
            $(this).data('sort', sort);
            _this.opts.ajaxData.pageNo = 1;
            _this.opts.ajaxData.orderType = name + ' ' + sort;
            _this.ajax({refresh: true});
        });
    };

    module.exports = Table;
});
