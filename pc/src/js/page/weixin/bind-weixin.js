define(function (require, exports, module) {

    //复制信息
    $('.js-copy').on('click',function(){
        $(this).siblings('input').select();
        document.execCommand('copy');
        new base.promptDialog({
            str:'复制成功',
            showTime:false
        })
    });


    //保存
    $('.js-save').on('click',function(){
        var focus = true;
        var sendAjax = false;
        $('.no-empty').each(function(i,e){
            if(e.value == ''){
                $(this).siblings('i').removeClass('none');
                focus && $(this).focus();
                focus = false;
            }else if(e.type == 'email'){
                var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                if(!filter.test(this.value)){
                    $(this).siblings('.correct-mail').removeClass('none');
                }else{
                    sendAjax = true;
                }
            }
        });

        var wxConfig = {
            url:$('.url span').html(),
            token:$('.token span').html(),
            name:$('.account-name').val(),
            weixin_type:$('.js-select').val(),
            weixin_account:$('.wx-account').val(),
            weixin_id:$('.origion-id').val(),
            email:$('.login-email').val(),
            appid:$('.app-id').val(),
            appsecret:$('.app-secret').val(),
            upVerifyFileName:$('.file-name').val(),
            upVerifyContent:$('.file-content').val()
        };
        sendAjax && $.ajax({
            url:'openapi.php?act=weixin_bind',
            method:'post',
            data:wxConfig,
            dataType:'json',
            success:function(data){
                if(data.res == 'succ'){
                    new base.promptDialog({
                        str:'保存成功',
                        showTime:false
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

    $('.no-empty').on('blur',function(){
        if($(this).val() != ''){
            $(this).siblings('i').addClass('none');
            $(this).siblings('.correct-mail').addClass('none');
        }
    });













    module.exports = {
        init: function(){

        }
    }
});