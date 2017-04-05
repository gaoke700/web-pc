define(function (require, exports, module) {
    var Dialog = require('js/common/plug/dialog.js');
    var DialogNewAddress = require('js/modules/dialog/dialog-new-address.js');

    function DialogAddressEditor(opts){
        this.opts = $.extend({
            headerTxt:'选择收货地址',
            chooseAddress: function(){}
        }, opts || {} );

        this.addressList = [];
        this.init();
    };

    DialogAddressEditor.prototype.constructor = DialogAddressEditor;

    DialogAddressEditor.prototype.init = function(){
        this.$dialogAddressEditor = $('<div class="g-dialog-address-editor"></div>');

        this.dialog = new Dialog.Dialog({
            showHeader:true,
            showBtn: false,
            customContent: true,
            headerTxt: this.opts.headerTxt,
            content: this.$dialogAddressEditor.html(this.render()),
            style:{
                position:'bottom',
                borderRadius:.1,
                width: '100%'
            }
        });
        this.ajax();
        this.event();
    };

    DialogAddressEditor.prototype.render = function(){
        var htmls = [];

        htmls.push('<div class="g-dialog-address-editor-info"><ul class="g-dialog-address-editor-info-ul">');
        htmls.push('</ul></div>');
        htmls.push('<div class="g-dialog-address-editor-save js-btn-new-address">新增收货地址</div>');

        return htmls.join('');
    };

    DialogAddressEditor.prototype.renderAddressList = function(){
        var htmls = [];

        $.each(this.addressList, function(i, item){
            if(!item.id){ return false; }
            var addressDetailed = (item.province || '') + (item.city || '') + (item.region || '') + (item.address || '');

            htmls.push('<li data-id="' + item.id + '" class="g-dialog-address-editor-info-li ' + ((item.default && item.default == 'true') ? 'g-dialog-address-editor-info-li-moren' : '') + '">');
            htmls.push('<div class="g-dialog-address-editor-info-d1 js-choose-address">');
            htmls.push('<p class="g-dialog-address-editor-info-d1-p1"><span>' + (item.ship_name || '') + '</span><span>' + (item.ship_mobile || '') + '</span></p>');
            if(item.default && item.default == 'true'){
                htmls.push('<p class="g-dialog-address-editor-info-d1-p2">默认</p>');
            }
            htmls.push('</div>');
            htmls.push('<div class="g-dialog-address-editor-info-d2">');
            htmls.push('<p class="g-dialog-address-editor-info-d2-p1 js-choose-address">' + addressDetailed + '</p>');
            htmls.push('<p class="g-dialog-address-editor-info-d2-p2 js-editor-address"><i class="icons icons-bianji"></i></p>');
            htmls.push('</div>');
            htmls.push('</li>');
        });

        return htmls.join('');
    };

    DialogAddressEditor.prototype.ajax = function(){
        var htmls = '', _this = this;

        base.ajax({
            url: 'openapi.php?act=get_address_list',
            type:'get',
            data: {
                pagesize:200,
                page:1
            },
            dataType: 'json',
            success: function(result){
                result = result || {};
                if(result.res == 'succ'){
                    var data = result.result || {};
                    _this.addressList = data.data || [];
                    htmls = _this.addressList.length > 0 ? _this.renderAddressList() : '暂无地址';
                }
                _this.$dialogAddressEditor.find('.g-dialog-address-editor-info-ul').html(htmls);
            }
        });
    };

    DialogAddressEditor.prototype.event = function(){
        var _this = this;

        //选择地址
        this.$dialogAddressEditor.on('click', '.js-choose-address', function(){
            var id = $(this).parents('.g-dialog-address-editor-info-li').data('id') || '';
            _this.chooseAddress(id);
        });

        //新建地址
        this.$dialogAddressEditor.on('click', '.js-btn-new-address', function(){
            new DialogNewAddress();
        });

        //编辑地址
        this.$dialogAddressEditor.on('click', '.js-editor-address', function(){
            var id = $(this).parents('.g-dialog-address-editor-info-li').data('id') || '';
            var index = base.utils.arrayFindkey(_this.addressList, 'id', id);
            new DialogNewAddress({
                headerTxt:'编辑收货地址',
                data:_this.addressList[index]
            });
        });
    };

    DialogAddressEditor.prototype.chooseAddress = function(id){
        var _this = this;
        if(!id){ return false; }
        var index = base.utils.arrayFindkey(this.addressList, 'id', id);
        //this.opts.chooseAddress(this.addressList[index]);
        base.ajax({
            url: 'openapi.php?act=set_address',
            type:'post',
            data: {id:id},
            dataType: 'json',
            success: function(result){
                result = result || {};
                if(result.res && result.res != 'succ'){
                    DialogSecondary.dialogPrompt1({ content: (result.msg || '提交失败') });
                    return false;
                }

                var previousUrl = result.result && result.result.previousUrl;
                if(previousUrl){
                    window.location.href = previousUrl;
                    _this.dialog.remove();
                }
            }
        });
    };

    module.exports = DialogAddressEditor;
});

