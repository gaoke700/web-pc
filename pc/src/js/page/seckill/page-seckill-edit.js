define(function(require,exports,module){
    module.exports = {
        init: function(){
            var jq=jQuery;
            //活动分享描述纠正后台给值不精确的问题
            (function(){
                var len=jq('.sec-kill-des input')[0].value.length;
                jq('.sec-kill-des span').html(len+'/25');
            })();
            //总数
            jq('#sec-kill').attr('allnum',jq('.secStore').length);
            //取消
            jq('.scoremall-btn-cancel').click(function(ev){
                ev.preventDefault();
                location.href='index.php?ctl=promotion/secKill&act=index';
                //W.page('index.php?ctl=promotion/secKill&act=index');
            });

            //移入查看效果
            jq('.hint-box span').hover(function(){
                jq('.hovers').addClass('on');
            },function(){
                jq('.hovers').removeClass('on');
            });

            //查看进来不能点
            if(document.querySelector('#viewshow')){
                jq('input,select').attr({disabled:'disabled'});
                jq('input,select').css({background:'grey',color:'white'});
                jq('#changeGoods').css({background:'grey'});

                jq('#laydate_box input,#laydate_box iselect').removeAttr('disabled');
                jq('#laydate_box input,#laydate_box iselect').css({background:'',color:''});
                return false;
            }
            //是否参与活动返奖金切换
            jq('.sec-kill-money .isReturnMoney label').click(function(){
                var index=jq(this).index();
                if(index==0){
                    jq('.sec-kill-money .bd').addClass('on');
                    jq('.sec-kill-money .bd input').removeAttr('disabled');
                    jq('.isReturnMoney-box-box .isReturnMoney-box input').attr('disabled','disabled');
                    jq('.isReturnMoney-box-box.on .isReturnMoney-box input').removeAttr('disabled');
                }else if(index==1){
                    jq('.sec-kill-money .bd').removeClass('on');
                    jq('.sec-kill-money .bd input').attr('disabled','disabled');
                }
            });
            //参与活动返奖金切换的比例切换
            jq('.sec-kill-money .bd .label').click(function(){
                var index=jq(this).index('.sec-kill-money .bd .label');
                jq('.isReturnMoney-box-box').eq(index).addClass('on').siblings().removeClass('on');
                //让没被选中的那部分disabled
                jq('.isReturnMoney-box-box .isReturnMoney-box input').attr('disabled','disabled');
                jq('.isReturnMoney-box-box.on .isReturnMoney-box input').removeAttr('disabled');
                jq('.sec-kill-active-main .parent-hint').removeClass('on');
            });
            //生效过期时间
            var laydate=require('plugin/laydate/laydate.js');
            laydate({
                elem: '#startTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                istime: true,
                min: laydate.now(),
                festival: true,
            });
            laydate({
                elem: '#endTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                istime: true,
                min: laydate.now(),
                festival: true,
            });
            //验证
            var validate={
                //secKillDes:false,//活动分享描述验证
                limitBuy:false,//限购验证
                flatPrice:false,//价格验证
                startTime:false,//开始时间验证
                endTime:false,//结束时间验证
                scaleMoney:false,//按比例验证
                fixedMoney:false//按固定金额验证
            };
            //库存验证设置
            jq('.secStore').each(function(i){
                validate['store'+i]=false;
            });
            //价格验证设置
            jq('.secKillPrice').each(function(i){
                validate['price'+i]=false;
            });
            //活动提醒设置
            function msgno(){
                var parent=jq('.active-hint-set');
                var span=parent.find('em span');
                var hint=parent.find('.hint em');
                if(span&&span.html()&&span.html().split(',').join('')<=0){
                    hint.html('当前短信不足请尽快充值');
                    jq('.active-hint-set input[type=radio]').get(0).disabled=true;
                    jq('.active-hint-set input[type=radio]').get(1).checked=true;
                    jq('.active-hint-set .black').eq(0).css('color','#ccc');
                    jq('.sec-kill-hint-msg').css('display','none');
                }
            }
            msgno();
            jq('.active-hint-set label').click(function(){
                var index=jq(this).index('.active-hint-set label');
                if(index==0){
                    jq.ajax({
                        url:'index.php?ctl=promotion/secKill&act=checkSmsTemplate',
                        type:'post',
                        dataType:'json',
                        success:function(res){
                            if(res.res=='succ'){
                                if(!jq('.active-hint-set input[type=radio]').get(0).disabled){
                                    jq('.sec-kill-hint-msg').css('display','inline-block');
                                }
                            }else{
                                new base.Dialog({
                                    content:'为保证您活动提醒功能的正常使用<br/>请事先开启短信通知模板？',
                                    btnOkTxt:'开启',
                                    okCallback:function(){
                                        jq.ajax({
                                            url:'index.php?ctl=system/setting&act=setSmsTemplateConfig',
                                            type:'post',
                                            data:{
                                                smsTemplateId:21,
                                                status:1,
                                            },
                                            dataType:'json',
                                            success:function(res){
                                                if(res.res){
                                                    base.promptDialog({str:res.msg});
                                                    jq('.active-hint-set input[type=radio]').get(0).checked=true;
                                                    jq('.sec-kill-hint-msg').css('display','inline-block');
                                                }else{
                                                    base.promptDialog({str:res.msg});
                                                    jq('.active-hint-set input[type=radio]').get(1).checked=true;
                                                    jq('.sec-kill-hint-msg').css('display','none');
                                                }
                                            }
                                        })
                                    },
                                    cancelCallback:function(){
                                        jq('.active-hint-set input[type=radio]').get(1).checked=true;
                                        jq('.sec-kill-hint-msg').css('display','none');
                                    }
                                });
                            }
                        }
                    });
                }else if(index==2){
                    jq('.sec-kill-hint-msg').css('display','none');
                }
            });
            //价格设置
            function priceClickSet(){
                var aBtn=[].slice.call(document.querySelectorAll('.sec-kill-set-price .hd label'));
                var oBd=document.querySelector('.bd');
                aBtn.forEach(function(v,i){
                    v.addEventListener('click',function(){
                        this.classList.add('on');
                        jq(this).siblings().removeClass('on');
                        if(i==0){
                            oBd.classList.remove('on');
                        }else if(i==1){
                            oBd.classList.add('on');
                        }
                    })
                });
            }
            priceClickSet();
            //库存验证
            //秒杀库存填写要求：①：不可大于实际库存：“秒杀库存不能超过实际库存”② 必须为大于等于0的正整数，提示语如下：③ 非空，提示样式如下：
            //价格验证
            //统一价格验证
            //统一价格框的填写条件：①必须为数值，不可为字符；②必须为大于等于0的正数，且最多为两位小数；③所填的统一价必须小于等于原商品的最高销售价；④非空
            //秒杀价格验证
            function secValidate(opt){
                var obj=opt.obj;
                var type=opt.type;
                var success=opt.success;
                var fail=opt.fail;
                obj.isValidate=true;
                jq(obj).siblings('.parent-hint').removeClass('on');
                if(jq(obj).val().trim()==''){
                    jq(obj).siblings('.parent-hint').addClass('on').html('本项必填');
                    obj.isValidate=false;
                }else if(!(/^\d+(.\d{1,2})?$/.test(jq(obj).val()))){
                    jq(obj).siblings('.parent-hint').addClass('on').html('请输入正数,最多保留两位小数');
                    obj.isValidate=false;
                }else if(jq(obj).val()>jq(obj).attr((type=='price'?'data-realprice':'data-realstore'))*1){//假设原价是100.
                    jq(obj).siblings('.parent-hint').addClass('on').html(type=='price'?'秒杀价格必须小于等于原价！':'秒杀库存不能超过实际库存');
                    obj.isValidate=false;
                }
                if(obj.isValidate){
                    success&&success();
                }else{
                    fail&&fail();
                }
            }
            function nowVa(){
                //统一价格
                jq('.flatPrice').each(function(){commonPrictV(this);});
                //秒杀价格和秒杀库存重新赋值
                for(var i=0;i<jq('#sec-kill').attr('allnum');i++){
                    if(i>=jq('.secKillPrice').length){
                        validate['price'+i]=true;
                        validate['store'+i]=true;
                    }
                }
                //秒杀价格
                jq('.secKillPrice').each(function(i){
                    priceV(this,i);
                });
                //秒杀库存
                jq('.secStore').each(function(i){
                    storeV(this,i);
                });
                //活动分享描述
                //jq('.sec-kill-des input').each(function(){activeV(this);});
                //限购验证
                jq('.limitNum').each(function(){limitV(this);});
                //开始时间
                timeV(jq('#startTime')[0]);
                //结束时间
                timeV(jq('#endTime')[0]);
                //按比例返奖金验证
                scaleMoneyV();
                //按固定值返奖金验证
                fixedMoneyV();
            }
            function moveVa(){
                if(document.querySelector('#startTime')){
                    //开始时间
                    timeV(jq('#startTime')[0]);
                    //结束时间
                    timeV(jq('#endTime')[0]);
                }
            }
            document.addEventListener('click',function(){
                moveVa();
            });
            function blurVa(){
                //统一价格
                jq('.sec-kill-set-price .title').on('blur','.flatPrice',function(){
                    commonPrictV(this);
                });
                //秒杀价格
                jq('.sec-kill-set-price .body').on('blur','.secKillPrice',function(){
                    var i=jq(this).index('.secKillPrice');
                    priceV(this,i);
                });
                //秒杀库存
                jq('.sec-kill-set-price .body').on('blur','.secStore',function(){
                    var i=jq(this).index('.secStore');
                    storeV(this,i);
                });
                //活动分享描述
                //jq('.sec-kill-des input').off();
                //jq('.sec-kill-des input').blur(function(){activeV(this);});
                //活动分享描述不可超过25字符
                jq('.sec-kill-des input')[0].onblur=function(){
                    var span=jq('.sec-kill-des span');
                    var arr=span.html().split('/');
                    var max=arr[1];
                    if(this.value.length>=max*1){
                        this.value=this.value.substring(0,max);
                    }
                    arr[0]=this.value.length;
                    span.html(arr.join('/'));
                };
                //限购验证
                jq('.limitNum').off();
                jq('.limitNum').blur(function(){limitV(this);});
                //按比例返奖金验证
                jq('.isReturnMoney-box-box.isReturnMoney-left .isReturnMoney-box input').off();
                jq('.isReturnMoney-box-box.isReturnMoney-left .isReturnMoney-box input').blur(function(){
                    scaleMoneyV();
                });
                //按固定值返奖金验证
                jq('.isReturnMoney-box-box.isReturnMoney-right .isReturnMoney-box input').off();
                jq('.isReturnMoney-box-box.isReturnMoney-right .isReturnMoney-box input').blur(function(){
                    fixedMoneyV();
                });
                //开始时间
                jq('#startTime').on('blur',function(){timeV(this);});
                //结束时间
                jq('#endTime').on('blur',function(){timeV(this);});
            }
            blurVa();
            //开始时间和结束时间验证
            function timeV(obj){
                if(jq(obj).val()==''){
                    jq(obj).siblings('.parent-hint').addClass('on').html('本项必填');
                    validate[obj.id]=false;
                }else{
                    jq(obj).siblings('.parent-hint').removeClass('on');
                    validate[obj.id]=true;
                }
            }
            //按比例返奖金(按比例返奖金：填写的两数之和需<=50%、大于等于0的正整数、非空)
            //按固定金额返奖金(填写的两数之和需<=（最大秒杀价）*50%、最多两位小数的)
            //统一价格验证
            function commonPrictV(obj){
                var jqthis=jq(obj);
                if(!jqthis.parents('.bd').hasClass('on')){
                    secValidate({obj:obj,type:'price',success:function(){
                        jq('.secKillPrice').val(jqthis.val());
                        validate.flatPrice=true;
                    },fail:function(){
                        validate.flatPrice=false;
                    }});
                }else{
                    validate.flatPrice=true;
                }
            }
            //秒杀价格验证
            function priceV(obj,i){
                if(jq(obj).parents('.bd').hasClass('on')){
                    secValidate({obj:obj,type:'price',success:function(){
                        validate['price'+i]=true;
                    },fail:function(){
                        validate['price'+i]=false;
                    }});
                }else{
                    validate['price'+i]=true;
                }
            }
            //秒杀库存验证
            function storeV(obj,i){
                secValidate({obj:obj,type:'store',success:function(){
                    validate['store'+i]=true;
                },fail:function(){
                    validate['store'+i]=false;
                }});
            }
            //活动分享验证
            function activeV(obj){
                if(jq(obj).val().trim()==''){
                    jq(obj).siblings('.parent-hint').addClass('on').html('本项必填');
                    validate.secKillDes=false;
                }else{
                    jq(obj).siblings('.parent-hint').removeClass('on');
                    validate.secKillDes=true;
                }
            }
            //限购验证
            function limitV(obj){
                if(jq('.limitNum').closest('.limit-radio').find('input[type=radio]').get(1).checked){
                    if(jq(obj).val().trim()==''){
                        jq(obj).siblings('.parent-hint').addClass('on').html('本项必填');
                        validate.limitBuy=false;
                    }else if(!(/^\d+$/.test(jq(obj).val()))){
                        jq(obj).siblings('.parent-hint').addClass('on').html('请输入正整数');
                        validate.limitBuy=false;
                    }else{
                        jq(obj).siblings('.parent-hint').removeClass('on');
                        validate.limitBuy=true;
                    }
                }else{
                    validate.limitBuy=true;

                }
            }
            //按比例返奖金：填写的两数之和需<=50%、大于等于0的正整数、非空
            function scaleMoneyV(){
                if(jq('.sec-kill-active-main .bd').hasClass('on')){
                    if(jq('.isReturnMoney-box-box.isReturnMoney-left').hasClass('on')){
                        var num=null;
                        jq('.isReturnMoney-box-box.isReturnMoney-left .isReturnMoney-box input').each(function(){
                            num+=jq(this).val()*1;
                        });
                        jq('.isReturnMoney-box-box.isReturnMoney-left .isReturnMoney-box input').each(function(){
                            if(jq(this).val().trim()==''){
                                jq(this).siblings('.parent-hint').addClass('on').html('本项必填');
                                validate.scaleMoney=false;
                                return false;
                            }else if(!(/^\d+$/.test(jq(this).val()))){
                                jq(this).siblings('.parent-hint').addClass('on').html('请输入正整数');
                                validate.scaleMoney=false;
                                return false;
                            }else if(num>50){
                                jq(this).siblings('.parent-hint').addClass('on').html('两数之和需<=50%');
                                validate.scaleMoney=false;
                                return false;
                            }else{
                                jq(this).siblings('.parent-hint').removeClass('on');
                                validate.scaleMoney=true;
                            }
                        });
                    }else{
                        jq('.isReturnMoney-box-box.isReturnMoney-left .isReturnMoney-box .parent-hint').removeClass('on');
                        validate.scaleMoney=true;
                    }
                }else{
                    jq('.isReturnMoney-box-box.isReturnMoney-left .isReturnMoney-box .parent-hint').removeClass('on');
                    validate.scaleMoney=true;
                }
            }
            //按固定金额返奖金：填写的两数之和需<=（最大秒杀价）*50%、最多两位小数的正数、非空
            function fixedMoneyV(){
                if(jq('.sec-kill-active-main .bd').hasClass('on')){
                    if(jq('.isReturnMoney-box-box.isReturnMoney-right').hasClass('on')){
                        var maxPrice=jq('.isReturnMoney-box-box.isReturnMoney-right').attr('data-maxSecPrice');
                        var num=null;
                        jq('.isReturnMoney-box-box.isReturnMoney-right .isReturnMoney-box input').each(function(){
                            num+=jq(this).val()*1;
                        });
                        jq('.isReturnMoney-box-box.isReturnMoney-right .isReturnMoney-box input').each(function(){
                            if(jq(this).val().trim()==''){
                                jq(this).siblings('.parent-hint').addClass('on').html('本项必填');
                                validate.fixedMoney=false;
                                return false;
                            }else if(!(/^\d+(.\d{1,2})?$/.test(jq(this).val()))){
                                jq(this).siblings('.parent-hint').addClass('on').html('请输入正数,最多保留两位小数');
                                validate.fixedMoney=false;
                                return false;
                            }else if(num>=maxPrice*0.5){
                                jq(this).siblings('.parent-hint').addClass('on').html('两数之和需<=(最大秒杀价)*50%');
                                validate.fixedMoney=false;
                                return false;
                            }else{
                                jq(this).siblings('.parent-hint').removeClass('on');
                                num+=jq(this).val()*1;
                                validate.fixedMoney=true;
                            }
                        });
                    }else{
                        jq('.isReturnMoney-box-box.isReturnMoney-right .isReturnMoney-box .parent-hint').removeClass('on');
                        validate.fixedMoney=true;
                    }
                }else{
                    jq('.isReturnMoney-box-box.isReturnMoney-right .isReturnMoney-box .parent-hint').removeClass('on');
                    validate.fixedMoney=true;
                }
            }
            //更改商品
            function addGoods(){
                var sGoods = $('gids').getValue();
                sGoods=sGoods?sGoods:"";
                new Dialog(
                    'index.php?ctl=promotion/secKill&act=search_goods',
                    {
                        ajaxoptions: {
                            data: {
                                'goods_ids': sGoods
                            },
                            method: "post"
                        },
                        width: 960,
                        modal:false,
                        title:'添加商品',
                        onShow:function(item){
                            item.dialog.addClass('scrollable');
                            item.dialog_head.nextElementSibling.setStyles({'height': window.getSize().y * 0.5,'overflow-y':'scroll'});
                            item.dialog_body.addClass('gao');
                        }
                    }
                );
            }
            jq('#changeGoods').click(function(){
                if(document.querySelector('.sec-kill-set-head .h2 img').getAttribute('src')!=''){
                    new base.Dialog({
                        content:'更改商品后，您需重新设置活动参数，<br/>是否继续？',
                        btnOkTxt:'继续修改',
                        btnCancelTxt:'暂不修改',
                        okCallback:function(){
                            addGoods();
                        }
                    });
                }else{
                    addGoods();
                }
            });
            //保存
            jq('.scoremall-btn-sure').click(function(ev){
                ev.preventDefault();
                ev.stopPropagation();
                nowVa();

                // console.log(validate);
                var isValidate=true;
                for(var attr in validate){
                    if(validate[attr]==false){
                        isValidate=false;
                        break;
                    }
                }
                if(!isValidate){return false;}

                var _form=$('sec-kill-from');
                var _formActionURL=_form.get('action');
                var subGoodsForm = function (submitBtn){
                    _form.set('target',"{ure:'messagebox',update:'messagebox'}");
                    $('loadMask').amongTo(window).show();
                    window.MessageBoxOnShow=function(box,success){
                        if(!success){
                            MODALPANEL.hide();
                            return;
                        }
                        try{
                            if(dlg=$('sec-kill').getParent('.dialog')){
                                dlg.retrieve('instance').close();
                                MODALPANEL.hide();
                            }
                            var goods_id = $('goods_id').getValue();
                            location.href='index.php?ctl=promotion/secKill&act=index';
                            //W.page('index.php?ctl=promotion/secKill&act=index');
                        }catch(e){}
                        MODALPANEL.hide();
                        location.href='index.php?ctl=promotion/secKill&act=index';
                        //W.page('index.php?ctl=promotion/secKill&act=index');
                    };
                    _form.set('action',_formActionURL).fireEvent('submit');
                };
                subGoodsForm(this);
            });

            //离开页面时触发弹框
            base.onunload();
        }
    }
});