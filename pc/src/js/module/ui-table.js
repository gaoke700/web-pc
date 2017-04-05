define(function (require, exports, module) {
/*
    var optss = {
        parent:$('body'),
        headConfig:[
            {
                text:'标签名称',
                change: true,
                changeFn: function(data){
                    console.log(data);
                }
            }
        ],
        bodyHtml: []
    };
*/

    function Table(opts){
        this.opts = $.extend(true, {
            parent:$('body'),
            headConfig:[],
            bodyHtml: [],
            checkbox: false,
            radio: false,
            isShowHeader:true,//默认显示header
            radioFn: function(){},
            renderItemCallback: function(){}
        }, opts||{});
        this.data = [];
        this.allData = {
            count:0
        };
        this.isCheckAll = false;
        this.checkboxData = [];
        this.init();
    };

    Table.prototype.constructor = Table;

    Table.prototype.init = function(){
        this.table = $('<div class="ui-table"></div>');
        this.table.html(this.render());
        this.opts.parent.append(this.table);
        this.renderBody('', this.opts.renderItemCallback);
        this.event();
    };

    Table.prototype.render = function(){
        var htmls = [], headHtmls = [], _this = this;
        $.each(this.opts.headConfig, function(i, item){
            var text = item.text || '';
            var sortHtml = item.sort ? '<i class="ui-table-icon1 iconss iconss-jiantouxia" style="margin-left: 3px;"></i>' : '';
            var textHtml = '';
            if(item.sort){
                textHtml = '<span class="js-btn-sort" style="cursor: pointer;" data-sort="desc" data-name="' + item.name + '">' + text + sortHtml + '</span>';
            } else {
                textHtml = text + sortHtml;
            }

            if(item.width){
                headHtmls.push('<div class="ui-table-list" style="width: ' + (item.width) + ';">' + textHtml + '</div>');
            } else {
                headHtmls.push('<div class="ui-table-list width-auto">' + textHtml + '</div>');
            }
        });

        if(this.opts.isShowHeader){
            htmls.push('<div class="ui-table-head">');
            //判断是否checkbox
            if(_this.opts.checkbox){
                htmls.push('<div class="ui-table-list" style="width: 54px; background: #dddddd;">&nbsp;<label class="ui-checkbox"><input class="ui-table-checkbox-all" type="checkbox" name="ui-table-checkbox"><i></i>&nbsp;</label></div>');
            }

            //判断是否radio
            if(_this.opts.radio){
                htmls.push('<div class="ui-table-list" style="width: 54px;"></div>');
            }

            htmls.push(headHtmls.join(''));
            htmls.push('</div>');
        }
        htmls.push('<div class="ui-table-body"></div>');
        return htmls.join('');
    };

    Table.prototype.renderBody = function(data, callback){
        data = data || this.opts.bodyHtml;
        if(base.utils.isJson(data)){
            if(data.error){
                this.table.find('.ui-table-body').html('<p class="tc pt30 pb30">' + data.error + '</p>');
                if(callback) callback();
                return false;
            }
        }
        if(data.length <= 0){
            this.table.find('.ui-table-body').html('<p class="tc pt30 pb30">无数据</p>');
        } else {
            var htmls = [], _this = this;
            $.each(data, function(i, item){
                htmls.push('<div class="ui-table-body-item" data-index="' + i + '">');
                var headConfig = _this.opts.headConfig;

                //判断是否checkbox
                if(_this.opts.checkbox){
                    htmls.push('<div class="ui-table-list" style="width: 54px">&nbsp;<label class="ui-checkbox"><input type="checkbox" name="ui-table-checkbox" /><i></i>&nbsp;</label></div>');
                }

                //判断是否radio
                if(_this.opts.radio){
                    htmls.push('<div class="ui-table-list" style="width: 54px">&nbsp;<label class="ui-radio"><input type="radio" name="ui-table-radio" /><i></i>&nbsp;</label></div>');
                }

                $.each(item, function(v, item2){
                    var itemHtml = item2 || '';
                    if(!headConfig[v]){ return false; }

                    //判断列是否可编辑
                    if(headConfig[v].change){
                        itemHtml = '<div class="ui-table-small-change-text" style="display: inline">' + itemHtml + '</div>' + '&nbsp;&nbsp;<a class="ui-table-btn-small-change js-table-btn-small-change" href="javascript:;">修改</a>'
                    }

                    //处理列宽度
                    if(headConfig[v].width){
                        htmls.push('<div class="ui-table-list" data-index="' + v + '" style="width: ' + headConfig[v].width + ';">' + itemHtml + '</div>');
                    } else {
                        htmls.push('<div class="ui-table-list width-auto" data-index="' + v + '">' + itemHtml + '</div>');
                    }
                });
                htmls.push('</div>');
            });
            this.table.find('.ui-table-body').html(htmls.join(''));
        }
        if(callback) callback();
    };

    Table.prototype.load = function(opt){
        opt = opt || {};
        this.table.find('.ui-table-body').html('<div class="pt100 pb100"><div class="g-loading"><div></div><div></div><div></div><div></div><div></div></div></div>');
        if(opt.callback){
            opt.callback();
        }
    };

    Table.prototype.getCheckboxData = function(){
        var arr = [];
        $.each(this.table.find('input[name=ui-table-checkbox]').not(":eq(0)"), function(i, item){
            if($(item).is(':checked')){
                var index = $(item).parents('.ui-table-body-item').data('index');
                arr.push(index);
            }
        });
        this.checkboxData = arr;
    };

    Table.prototype.event = function(){
        var _this = this;

        //快捷修改
        this.table.on('click', '.js-table-btn-small-change', function(e){
            var parent = $(this).parents('.ui-table-body-item');
            var parent2 = $(this).parents('.ui-table-list');
            var oldHtml = parent2.html();
            var textHtml=parent2.find('.ui-table-small-change-text').html().trim();
            var text = parent2.find('.ui-table-small-change-text').text().trim();
            var index = parent.data('index');
            var columnIndex = parent2.data('index');
            var headConfig = _this.opts.headConfig;
            var inputType = (headConfig[columnIndex] && headConfig[columnIndex].changeType) ? headConfig[columnIndex].changeType : 'text';
            parent2.html('<input maxlength="' + (headConfig[columnIndex].changeLen || '') + '" class="ui-input w100" style="max-width: ' + (headConfig[columnIndex].changeMaxWidth ? headConfig[columnIndex].changeMaxWidth : 'auto') + ';" type="' + inputType + '" value="' + text + '" />&nbsp;&nbsp;<a class="js-table-btn-small-save" href="javascript:;">保存</a>');
            //parent2.find('input').focus();

            //快捷修改保存
            parent2.off('click', '.js-table-btn-small-save');
            parent2.on('click', '.js-table-btn-small-save', function(e){
                var value = parent2.find('input').val();
                _this.opts.headConfig[columnIndex].changeFn({
                    index:index,
                    columnIndex: columnIndex,
                    data: _this.data[index],
                    newStr: value,
                    succ: function(data){
                        if(!data){ return false;}
                        textHtml = textHtml.replace(text, value);
                        oldHtml = oldHtml.replace(text, value);
                        parent2.html('<div class="ui-table-small-change-text" style="display: inline">' + textHtml + '</div>' + '&nbsp;&nbsp;<a class="ui-table-btn-small-change js-table-btn-small-change" href="javascript:;">修改</a>');
                    }
                });
                e.stopPropagation();
            });
            parent2.off('click', 'input');
            parent2.on('click', 'input', function(e){
                e.stopPropagation();
            });

            $(document).one("click", function(){
                //oldHTML没有进行更新,有BUG,点击空白的地方后原本修改的也被干掉了,除非保存整体刷新重新渲染,或者更新oldHTML
                parent2.html(oldHtml);
            });
            e.stopPropagation();

        });

        //单选
        this.table.on('change', 'input[name=ui-table-radio]', function(){
            var parent = $(this).parents('.ui-table-body-item');
            var index = parent.data('index');
            if(_this.opts.radioFn){
                _this.opts.radioFn({index:index});
            }
        });

        //多选
        this.table.on('click', 'input[name=ui-table-checkbox]', function(){
            if($(this).hasClass('ui-table-checkbox-all')){
                if($(this).is(':checked')){
                    _this.checkAll();
                } else {
                    _this.checkAll({checkAll: false});
                }
                _this.getCheckboxData();
            } else {
                if($(this).is(':checked')){
                    $(this).prop('checked', true);
                } else {
                    $(this).prop('checked', false);
                    _this.table.find('.ui-table-checkbox-all[name=ui-table-checkbox]').prop('checked', false);
                }
                _this.getCheckboxData();
                _this.isCheckAll = false;
                _this.table.find('.ui-table-checktip').remove();
            }
        });
        //全选
        this.table.on('click', '.js-check-all', function(){
            if(_this.isCheckAll){
                _this.showCheckTip();
                _this.isCheckAll = false;
                _this.getCheckboxData();
            } else {
                _this.showCheckTip(true);
                _this.isCheckAll = true;
                _this.checkboxData = ['all'];
            }
        });
    };

    Table.prototype.checkAll = function(opts){
        var _this = this;
        opts = $.extend(true, {
            checkAll: true
        }, opts || {});
        if(opts.checkAll){
            _this.showCheckTip();
            //_this.isCheckAll = true;
            _this.table.find('input[name=ui-table-checkbox]').prop('checked', true);
        } else {
            this.table.find('.ui-table-checktip').remove();
            _this.table.find('input[name=ui-table-checkbox]').prop('checked', false);
            _this.checkboxData = [];
        }
    };

    Table.prototype.showCheckTip = function(isTrue){
        this.table.find('.ui-table-checktip').remove();
        var html = '此页中的所有<span class="fb pl5 pr5">' + (this.data.length) + '</span>条记录都已选中。<a class="js-check-all" href="javascript:;">点此选中当前列表中的所有' + this.allData.count + '条记录</a>。';
        if(isTrue){
            html = '已选中当前列表所有<span class="fb pl5 pr5">' + this.allData.count + '</span>条记录，<a class="js-check-all" href="javascript:;">取消选中</a>';
        }
        this.table.find('.ui-table-head').after('<div class="ui-table-checktip tc" style="background: #f5f5f5; border-bottom: 1px solid #e5e5e5; padding: 5px 0;">' + html + '</div>');
    };

    module.exports = Table;
});
