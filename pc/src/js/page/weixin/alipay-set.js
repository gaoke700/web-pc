define(function (require, exports, module) {

    var parentDiv = $('.page-alipay-set');
    var setId = id;

//保存
    $('.js-save').on('click',function(){
        var focus = true;
        var sendAjax = true;
        $('.no-empty').each(function(i,e){
            if(e.value == ''){
                sendAjax = false;
                new base.promptDialog({
                    str:'输入框不能为空',
                    showTime:false
                });
                return false;
                console.log('return failed')
            }

        });

        var wxConfig = {
            pay_type : '1',
            id : setId,
            alipay_account : parentDiv.find('.ali-account').val(),
            alipay_partner : parentDiv.find('.coop-id').val(),
            alipay_key : parentDiv.find('.safe-code').val()
        };
        sendAjax && $.ajax({
            url:'openapi.php?act=updatePaymentCfg',
            method:'post',
            data:wxConfig,
            dataType:'json',
            success:function(data){
                if(data.res == 'succ'){
                    new base.promptDialog({
                        str:'保存成功',
                        showTime:false,
                        callback:function(){
                            location.href = 'admin.php?ctl=system/setting&act=show_store_payinfo'
                        }
                    })
                }else{
                    new base.promptDialog({
                        str:'保存失败',
                        showTime:false
                    })
                }
            }
        })
    });




















    module.exports = {
        init: function(){

        }
    }
});