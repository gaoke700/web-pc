define(function (require, exports, module) {
    module.exports = {
        init: function () {
            var UiRadioSlide = require('../../module/ui-radio-slide.js');
            //是否开启在线客服
            (function () {
                $.ajax({
                    url:'openapi.php?act=get_custom_service',
                    type:'post',
                    dataType:'json',
                    success:function(data){
                        var {res,result}=data;
                        var {state,url}=result;
                        var status=state=='0'?'off':'on';
                        if(state=='1'){
                            $('.page-des').addClass('page-des-active');
                        }
                        if(res=='succ'){
                            var uiRadioSlide = new UiRadioSlide({
                                status: status, //默认开启还是关闭(默认关闭)  'off'  'on'
                                isHand:false,
                                clickCallback:function(){
                                    $('.page-des').toggleClass('page-des-active');
                                }
                            });
                            $('.page-is-open-custom-service').append(uiRadioSlide.parent);
                            $('#kefu').val(url);
                        }
                    }
                });
            })();

            //点击保存
            $('.page-save').on('click',function(){
                $.ajax({
                    url:'openapi.php?act=set_custom_service',
                    type:'post',
                    data:{
                        state:$('.page-des').hasClass('page-des-active')?'1':'0',
                        url:$('#kefu').val(),
                    },
                    dataType:'json',
                    success:function(data){
                        var {res,result}=data;
                        if(res=='succ'){
                            new base.promptDialog({str:(result&&result.msg || '保存成功'), time:2000});
                        }else{
                            new base.promptDialog({str:(result&&result.msg || '保存失败'), time:2000});
                        }
                    }
                })
            })
        }
    }
});

