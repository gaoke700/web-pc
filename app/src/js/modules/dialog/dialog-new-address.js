define(function (require, exports, module) {
    var Dialog = require('js/common/plug/dialog.js');
    var LArea = require('js/common/plug/LArea.js');

    function DialogNewAddress(opts){
        this.opts = $.extend({
            headerTxt:'新建收货地址',
            data:{
                id:'',
                ship_name:'',
                ship_mobile: '',
                province: '',
                city: '',
                region: '',
                address: '',
                default: 'false'
            }
        }, opts || {} );

        this.addressList = [];
        this.init();
    };

    DialogNewAddress.prototype.constructor = DialogNewAddress;

    DialogNewAddress.prototype.init = function(){
        this.$dialogNewAddress = $('<div class="g-dialog-new-address"></div>');

        this.dialog = new Dialog.Dialog({
            showHeader:true,
            showBtn: false,
            customContent: true,
            headerTxt: this.opts.headerTxt,
            content: this.$dialogNewAddress.html(this.render()),
            style:{
                position:'bottom',
                borderRadius:.1,
                width: '100%'
            }
        });
        this.event();
    };

    DialogNewAddress.prototype.render = function(){
        var htmls = [], data = this.opts.data;
        var homeAddressText = (data.province ? (data.province + '，' + data.city + '，' + data.region) : '');

        htmls.push('<div class="g-dialog-new-address-editor">');
        htmls.push('<div class="g-dialog-new-address-editor-list">');
        htmls.push('<p class="g-dialog-new-address-editor-list-name ship_name-name">姓名</p>');
        htmls.push('<div class="g-dialog-new-address-editor-list-content"><input class="mandatory" name="ship_name" type="text" value="' + data.ship_name + '" /></div>');
        htmls.push('</div>');
        htmls.push('<div class="g-dialog-new-address-editor-list">');
        htmls.push('<p class="g-dialog-new-address-editor-list-name ship_mobile-name">手机号</p>');
        htmls.push('<div class="g-dialog-new-address-editor-list-content"><input class="mandatory" name="ship_mobile" type="text" value="' + data.ship_mobile + '" /></div>');
        htmls.push('</div>');
        htmls.push('<div class="g-dialog-new-address-editor-list">');
        htmls.push('<p class="g-dialog-new-address-editor-list-name szd-name">所在地</p>');
        htmls.push('<div class="g-dialog-new-address-editor-list-content js-choose-address"><input class="mandatory" readonly="" id="home-address-text" name="szd" type="text" value="' + homeAddressText + '" /></div>');
        htmls.push('<input id="home-address" name="home-address" type="hidden" />');
        htmls.push('<p class="g-dialog-new-address-editor-list-next js-choose-address"><i class="icons icons-gengduo"></i></p>');
        htmls.push('</div>');
        htmls.push('<div class="g-dialog-new-address-editor-list">');
        htmls.push('<p class="g-dialog-new-address-editor-list-name address-name">详细地址</p>');
        htmls.push('<div class="g-dialog-new-address-editor-list-content"><input class="mandatory" name="address" type="text" value="' + data.address + '" /></div>');
        htmls.push('</div>');
        htmls.push('<div class="g-dialog-new-address-editor-list">');
        htmls.push('<div class="g-dialog-new-address-editor-list-set-moren js-set-moren ' + (data.default == 'true' ? 'g-dialog-new-address-editor-list-set-moren-active' : '') + '">');
        htmls.push('<span class="icons icons-gou"></span><p>设为默认地址</p><input name="default" type="hidden" value="' + data.default + '" />');
        htmls.push('</div>');
        htmls.push('</div>');
        htmls.push('</div>');
        htmls.push('<div class="g-dialog-new-address-btn-save js-btn-post">保存并使用</div>');

        return htmls.join('');
    };

    DialogNewAddress.prototype.event = function(){
        var _this = this;

        //选择省市区
        require.async("/static/js/areData.js", function(){
            var area = new LArea();
            area.init({
                'trigger': '#home-address-text',
                'valueTo': '#home-address',
                'keys': { id: 'value', name: 'text' },
                'type': 2,
                'data': [provs_data, citys_data, dists_data]
            });
            //area.value=[2,13,3];
        });

        //保存地址
        this.$dialogNewAddress.on('click', '.js-btn-post', function(){
            _this.validation();
        });

        //设为默认
        this.$dialogNewAddress.on('click', '.js-set-moren', function(){
            _this.setMoren($(this));
        });
    };

    DialogNewAddress.prototype.validation = function(){
        var _this = this, error = 0;
        this.$dialogNewAddress.find('.mandatory').each(function(i, item){
            if(item.value == ''){
                Dialog.dialogPrompt1({
                    content: ($('.' + item.name + '-name').html() + '不能为空')
                });
                error++;
                return false;
            } else {
                _this.opts.data[item.name] = item.value;
            }
        });
        if(error <= 0){
            var homeAddress = $('#home-address-text').val().split('，');
            _this.opts.data.province = homeAddress[0];
            _this.opts.data.city = homeAddress[1];
            _this.opts.data.region = homeAddress[2];
            _this.opts.data.default = this.$dialogNewAddress.find('input[name=default]').val();
            _this.post();
        }
    };

    DialogNewAddress.prototype.post = function(){
        base.ajax({
            url: 'openapi.php?act=add_address',
            type:'post',
            data: this.opts.data,
            dataType: 'json',
            success: function(result){
                result = result || {};
                if(result.res && result.res != 'succ'){
                    Dialog.dialogPrompt1({ content: (result.msg || '提交失败') });
                    return false;
                }
                var previousUrl = result.result && result.result.previousUrl;
                if(previousUrl){ window.location.href = previousUrl;}
            }
        });
    };

    DialogNewAddress.prototype.setMoren = function(obj){
        var className = 'g-dialog-new-address-editor-list-set-moren-active';
        var $default = obj.find('input[name=default]');
        if(obj.hasClass(className)){
            $default.val('false');
            obj.removeClass('g-dialog-new-address-editor-list-set-moren-active');
        } else {
            $default.val('true');
            obj.addClass('g-dialog-new-address-editor-list-set-moren-active');
        }
    };

    module.exports = DialogNewAddress;
});

