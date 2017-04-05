define(function (require, exports, module) {
    var UiTable = require('../../module/ui-table.js');
    var UiRadioSlide = require('../../module/ui-radio-slide.js');

    var $page = $('.page-setting-pay');
    var $payListWrap = $page.find('.pay-list-wrap');

    function render(){
        base.ajax({
            url:'openapi.php?act=getPaymentCfg',
            type:'post',
            success: function(data){
                data = data || {};
                var result = data.result || {};
                if(data.res == 'succ'){
                    renderTable(result.paymentcfg || {});
                }
            }
        });
    }
    render();

    function cardDialog(){
        var htmls = [];

        htmls.push('<div class="w500 p20 f12 tl">');
        htmls.push('<div class="ui-border-b pb5">');
        htmls.push('<div class="ui-block pb10"><p class="w60 tr">商品名称：</p><p>刘德华</p></div>');
        htmls.push('<div class="ui-block pb10"><p class="w60 tr">商品编号：</p><p>身份证</p></div>');
        htmls.push('<div class="ui-block pb10"><p class="w60 tr">规格：</p><p>中国工商银行</p></div>');
        htmls.push('<div class="ui-block pb10"><p class="w60 tr">售价：</p><p>6222************5678</p></div>');
        htmls.push('</div>');
        htmls.push('<p class="pt10 pb10">温馨提示：</p>');
        htmls.push('<div class="ui-color2">');
        htmls.push('<p class="pb5">1、云起绑卡用户无法在云起微商城重复绑定，如果您是云起微商城用户，请至云起微商城的后台绑卡。</p>');
        htmls.push('<p class="pb5">2、绑卡成功后，您的提现资金将统一打到该银行卡。</p>');
        htmls.push('<p class="pb5">3、如需取消绑卡，请提交以下资料至客服邮箱：tgservice@shopex.cn</p>');
        htmls.push('<p class="pl20">（1）邮件标题：取消银行卡绑定</p>');
        htmls.push('<p class="pl20 pb5">（2）邮件内容：注册手机号，现绑定的银行卡账号信息（姓名、身份证号、银行名称、所属支行、银行卡号、在银行预留的手机号）</p>');
        htmls.push('<p class="pb5">4、取消绑定时间为1个工作日，如需更换新银行卡，只需要在本页面自行绑定即可。</p>');
        htmls.push('<p class="pb5">5、更换的新银行卡开户姓名必须与之前相同，不支持不同姓名绑卡。</p>');
        htmls.push('<p class="pb5">6、重要提醒：同一个身份只能拥有一个天工账户。例如：云起微商城用户如果有多个店铺，则需要不同人员的身份证。如果要将某店铺的绑定身份更换到其它店铺，则需要发送“销户”邮件。处理时间为3个工作日。</p>');
        htmls.push('</div>');
        htmls.push('</div>');

        return htmls.join('');
    }

    function renderTable(data){
        $payListWrap.html('');
        var arr = [];
        $.each(data, function(i, item){
            var arr1 = [];
            var actions = item.actions || {};
            var isOpen = String(item.is_open || 0);
            var payType = item.pay_type || '';
            var payName = item.pay_name || '';
            if(payType == 3){
                payName += '<span class="tip" style="background: #f3916b; color: #fff; padding: 1px 2px; margin-left: 5px;">说明</span>';
            }
            arr1.push('<div class="table-use" data-paytype="' + payType + '" data-status="' + isOpen + '"></div>');
            arr1.push(payName);
            arr1.push(item.pay_account || '');
            arr1.push(item.pay_type_name || '');
            arr1.push('<a class="' + (payType == 3 ? 'js-show-dialog' : '') + '" href="' + (actions.url || '') + '">' + (actions.text || '编辑') + '</a>');
            arr.push(arr1);
        });

        var table = new UiTable({
            parent:$payListWrap,
            headConfig:[
                { text:'开启状态' },
                { text:'支付方式' },
                { text:'支付帐号' },
                { text:'类型' },
                { text:'操作'}
            ],
            bodyHtml: arr,
            renderItemCallback: function(){
                $('.table-use').each(function(i,item){
                    var payType = $(this).data('paytype') || '';
                    var uiRadioSlide = new UiRadioSlide({
                        status:($(item).data('status') == '1' ? 'on' : 'off'),
                        clickCallback:function(obj){
                            var value = obj.status == 'on' ? 0 : 1;
                            setStatus(payType, value, function(result){
                                if(result.res && result.res == 'succ'){
                                    new base.promptDialog({str:(result.msg || '修改成功'), time:2000});
                                    render();
                                } else {
                                    new base.promptDialog({str:(result.msg || '修改失败'), time:2000});
                                }
                            });
                        }
                    });
                    $(this).append(uiRadioSlide.parent);
                });
                new base.Popover({
                    obj: $payListWrap.find('.tip'),
                    parent:$payListWrap,
                    content: '<div class="w200"><p class="pb5">“云起微商城代收”服务使用说明</p><p class="ui-color2">1、云起微商城官方结算方式，平安银行监管，保障您的资金安全<br />2、同时开通微信支付、支付宝支付<br />3、提现0费用，即时到账<br />4、服务费补贴及返现</p></div>',
                    arrowPos: 'up',
                    event: 'hover'
                });
            }
        });
    };

    //绑定银行卡
    $payListWrap.on('click', '.js-show-dialog', function(){
        var url = $(this).attr('href') || '';
        new base.Dialog({
            headerTxt:'绑定收款银行卡',
            showBtn: false,
            customContent: true,
            content:('<iframe src="' + url + '" style="width: 750px; height: 550px; border: 0;"></iframe>'),
            okCallback: function(){

            }
        });
        return false;
    });

    //开启，关闭post
    function setStatus(type, value, callback){
        base.ajax({
            url:'openapi.php?act=changePay',
            type:'post',
            data:{
                pay_type: type,
                checked: value
            },
            success: function(data){
                data = data || {};
                callback(data);
            }
        })
    }

    module.exports = {
        init: function(){}
    }
});

