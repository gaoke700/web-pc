define(function (require, exports, module) {
    var dialogSecondary=require('js/common/plug/dialog.js');
    var mMask=require('js/modules/m-mask.js');
    module.exports = {
        init: function(){
            var mask=mMask();
            var isScroll=base.yesNoScroll();
            var loading=base.loading();
            var loadShow=function(){
                loading.show();
                mask.show();
                isScroll.noScroll();
            };
            var loadHide=function(){
                loading.hide();
                mask.hide();
                isScroll.yesScroll();
            };
            var nowGet=document.querySelector('#now-get');
            var addressSelect=document.querySelector('.address-select');
            //获取填写地址的url
            var goToAddress=function(){
                var isWX=document.querySelector('#isWX');
                if(isWX){//跳微信的地址库
                    window.location.href=document.querySelector('#address2url').getAttribute('href');
                }else{
                    var DialogAddressEditor = require('js/modules/dialog/dialog-address-editor.js');  //编辑地址
                    new DialogAddressEditor({
                        headerTxt:'编辑收货地址',
                        chooseAddress: function(result){
                            //这里返回的是选择的地址json字段
                            console.log(result);
                        }
                    });                    
                }
            };
            //判断留言是否存在
            if(sessionStorage.getItem('ms_key')){
                document.querySelector('.address-language input').value=sessionStorage.getItem('ms_key');
            }
            //存储留言
            var textArea=document.querySelector('.address-language input');
            addressSelect.addEventListener('click',function(){
                if(textArea.value.trim()!=''){
                    sessionStorage.setItem('ms_key',textArea.value);
                }
            });
            //去选地址
            addressSelect.addEventListener('click',function(){
                goToAddress();
            });
            //立即领取
            nowGet.addEventListener('click',function(){
                //dialogSecondary.dialogPrompt1({content:'弹窗测试'});
                if(document.querySelector('#isHaveAddress').innerHTML==''){
                    dialogSecondary.dialogCustom1({
                        iconName:'icons-zhishi',
                        content:'还没有填写地址,现在去填写？',
                        okCallback:function(){
                            goToAddress();
                        }
                    });
                    return false;
                }
                var someone_name = document.querySelector('#someone_name').innerHTML;
                var phone = document.querySelector('#phone').innerHTML;
                let ajaxNum=0;//二次请求次数
                let ajaxTime=3000;//二次请求间隔
                let ajaxTrue=true;//是否进行ajax请求
                var dealer_order_id=document.querySelector('#dealer_order_id').value;//订单id
                var wish_info=document.querySelector('.address-language input').value;//留言
                var nums=document.querySelector('#nums').value;//数量
                var goodsUrl=document.querySelector('#goodsUrl').value;//失败页面
                loadShow();
                $.ajax({
                    url:'index.php?ctl=orders&act=create&gifts=1',
                    type:'post',
                    timeout:10000,
                    data:{
                        dealer_order_id:dealer_order_id,
                        wish_info:wish_info,
                        nums:nums,
                    },
                    dataType:'json',
                    success:function(data){
                        //console.log(data);
                        if(data.res=='succ'){

                            let ajaxFn=()=>{
                                $.ajax({
                                    url:'index.php?ctl=orders&act=gifts_confirm_order&taskId='+data.info.order_id,
                                    type:'post',
                                    dataType:'json',
                                    success:function(data){
                                        //console.log(data,'ajaxNum:'+ajaxNum);
                                        if(data.status=='success'){
                                            dialogSecondary.dialogPrompt1({
                                                content:'领取成功',
                                                callback:function(){
                                                    window.location.href='?member-'+dealer_order_id+'-giftsOrder.html';
                                                }
                                            });
                                        }else{
                                            if(ajaxTrue&&(data.status=='waiting')){
                                                setTimeout(function(){
                                                    ajaxNum++;
                                                    if(ajaxNum==5){
                                                        ajaxTrue=false;
                                                    }
                                                    ajaxFn();
                                                },ajaxTime);
                                            }else{
                                                loadHide();
                                                dialogSecondary.dialogPrompt1({
                                                    content:'领取失败',
                                                    callback:function(){
                                                        window.location.href='?member-'+dealer_order_id+'-giftsOrder.html';
                                                    }
                                                });
                                            }
                                        }

                                    }
                                })
                            };
                            ajaxFn();

                        }else{
                            loadHide();
                            dialogSecondary.dialogPrompt1({
                                content:'领取失败',
                                callback:function(){
                                    window.location.href='?member-'+dealer_order_id+'-giftsOrder.html';
                                }
                            });
                        }
                    },
                    error: function(xhr, type){
                        loadHide();
                    }
                });
            });

            var Auxiliary = require('js/common/auxiliary.js');
            Auxiliary.wxAbout();        //微信相关

        }
    }
});