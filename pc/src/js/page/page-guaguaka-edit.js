define(function(require,exports,module){
    module.exports = {
        init: function(){
            var jq=jQuery;

            //查看进来不能点
            if(document.querySelector('#viewshow')){
                jq('input,select,textarea').attr({disabled:'disabled'});
                jq('input,select,textarea').css({background:'grey',color:'white'});

                jq('#laydate_box input,#laydate_box iselect').removeAttr('disabled');
                jq('#laydate_box input,#laydate_box iselect').css({background:'',color:''});
                return false;
            }

            //字符数量限制
            var limitTxt=function(opt){
                if(!opt){
                    return false;
                }
                var str=opt.str;
                var length=str.length;
                var max=opt.max;
                if(length>max){
                    str=str.substring(0,max);
                }
                return str;
            };
            //是不是空
            var isSpace=function(opt){
                var obj=opt||{};
                var value=obj.value||" ";
                var valueTrim=value.trim();
                var b=false;
                if(valueTrim==''){
                    b=true;
                }
                return b;
            };
            //是不是0
            var isZero=function(opt){
                var obj=opt||{};
                var value=obj.value||" ";
                var valueTrim=value.trim();
                var b=false;
                if(valueTrim==0){
                    b=true;
                }
                return b;
            };
            //是不是整数
            var isPositiveInteger=function(opt){
                var obj=opt||{};
                var value=obj.value||" ";
                var valueTrim=value.trim();
                var re=/^\d+$/;
                var b=false;
                if(re.test(valueTrim)){
                    b=true;
                }
                return b;
            };
            //是不是保留了num位小数的正数
            var isReservedDecimal=function(opt){
                var obj=opt||{};
                var num=obj.num||2;
                var value=obj.value||" ";
                var valueTrim=value.trim();
                var re=new RegExp("^\\d+\\.\\d{"+num+"}$");
                var b=false;
                if(re.test(valueTrim)){
                    b=true;
                }
                return b;
            };
            //等待验证的变量(第一步)
            var validatePrev={
                activeName:false,//活动名称验证
                startTime:false,//开始时间验证
                endTime:false,//结束时间验证
                removeScore:false,//消耗积分
                guaNum:false,//刮奖次数
            };
            //验证刮奖次数
            var vGuaNum=function(){
                var aRadio=jq('#guajiang-num input[type=radio]');
                var aInput=jq('#guajiang-num input[type!=radio]');
                var now=0;
                aRadio.each(function(i,e){
                    aInput.eq(i).siblings('.parent-hint').removeClass('on');
                    if(e.checked==true){
                        now=i;
                    }
                });
                var obj=aInput.eq(now);
                var value=obj.val();
                var opt={value:value};
                if(isSpace(opt)){//是空
                    //console.log('是空');
                    validatePrev.guaNum=false;
                    obj.siblings('.parent-hint').addClass('on').html('本项必填');
                    return false;
                }else{//非空
                    validatePrev.guaNum=true;
                    //console.log('非空');
                }
                if(isPositiveInteger(opt)&&!isZero(opt)){//是不为0的正整数
                    //console.log('是不为0的正整数');
                    validatePrev.guaNum=true;
                }else{
                    //console.log('不是不为0的正整数');
                    validatePrev.guaNum=false;
                    obj.siblings('.parent-hint').addClass('on').html('请输入正整数');
                    return false;
                }
            };
            //消耗积分验证
            var vRemoveScore=function(){
                var obj=jq('#removeScore input');
                var value=obj.val();
                var opt={value:value};
                if(isSpace(opt)){//是空
                    //console.log('是空');
                    validatePrev.removeScore=false;
                    obj.siblings('.parent-hint').addClass('on').html('本项必填');
                    return false;
                }else{//非空
                    //console.log('非空');
                    validatePrev.removeScore=true;
                    obj.siblings('.parent-hint').removeClass('on');
                }
                if(isPositiveInteger(opt)){//是正整数
                    //console.log('是正整数');
                    validatePrev.removeScore=true;
                    obj.siblings('.parent-hint').removeClass('on');
                }else{//非空
                    //console.log('不是正整数');
                    validatePrev.removeScore=false;
                    obj.siblings('.parent-hint').addClass('on').html('请输入0或者正整数');
                    return false;
                }
            };
            //结束时间验证
            var vEndTime=function(){
                if(document.querySelector('#endTime')){
                    var obj=jq('#endTime');
                    var value=obj.val();
                    if(isSpace({value:value})){//是空
                        //console.log('是空');
                        obj.siblings('.parent-hint').addClass('on').html('本项必填');
                        validatePrev.endTime=false;
                        return false;
                    }else{//非空
                        obj.siblings('.parent-hint').removeClass('on');
                        validatePrev.endTime=true;
                        //console.log('非空');
                    }
                }
            };
            //开始时间验证
            var vStartTime=function(){
                if(document.querySelector('#startTime')){
                    var obj=jq('#startTime');
                    var value=obj.val();
                    if(isSpace({value:value})){//是空
                        //console.log('是空');
                        obj.siblings('.parent-hint').addClass('on').html('本项必填');
                        validatePrev.startTime=false;
                        return false;
                    }else{//非空
                        obj.siblings('.parent-hint').removeClass('on');
                        validatePrev.startTime=true;
                        //console.log('非空');
                    }
                }
            };
            //验证活动名称
            var vName=function(){
                var obj=jq('#active-name input');
                var value=obj.val();
                if(isSpace({value:value})){//是空
                    //console.log('是空');
                    obj.siblings('.parent-hint').addClass('on').html('本项必填');
                    validatePrev.activeName=false;
                    return false;
                }else{//非空
                    obj.siblings('.parent-hint').removeClass('on');
                    validatePrev.activeName=true;
                    //console.log('非空');
                }
            };
            //上一步的事件系列验证(第一步)
            var blurFnPrev=function(){
                //验证名称
                jq('#active-name input').blur(function(){
                    vName();
                });
                //验证开始时间
                jq('#startTime').blur(function(){
                    vStartTime();
                });
                //验证结束时间
                jq('#endTime').blur(function(){
                    vEndTime();
                });
                //验证消耗积分
                jq('#removeScore input').blur(function(){
                    vRemoveScore();
                });
                //验证刮奖次数
                (function(){
                    var aRadio=jq('#guajiang-num input[type=radio]');
                    var aInput=jq('#guajiang-num input[type!=radio]');
                    aInput.each(function(i,e){
                        jq(e).blur(function(){
                            if(aRadio.get(i).checked==true){
                                vGuaNum();
                            }
                        })
                    })
                })();
            };
            blurFnPrev();
            //上一步的直接系列验证(第一步)
            var validateFnPrev=function(){
                vName();
                vStartTime();
                vEndTime();
                vRemoveScore();
                vGuaNum();
            };
            //点击其他地方的时候进行验证
            jq('.page-guaguaka-edit').click(function(){
                vStartTime();
                vEndTime();
            });
            //功能系列
            var laydate=require('plugin/laydate/laydate.js');
            //开始时间
            laydate({
                elem: '#startTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                istime: true,
                min: laydate.now(),
                festival: true,
            });
            //结束时间
            laydate({
                elem: '#endTime',
                event: 'focus',
                format: 'YYYY-MM-DD hh:mm:ss',
                istime: true,
                min: laydate.now(),
                festival: true,
            });
            //活动名称字符限制
            jq('#active-name input').get(0).onblur=function(){
                var str=this.value;
                var str2=limitTxt({str:str,max:10});
                if(this.value!=str2){
                    this.value=str2;
                }
                var len=this.value.length;
                jq('#active-name .txt-content span').eq(0).html(len);
            };
            //活动说明字符限制
            jq('#active-des textarea').get(0).oninput=function(){
                var str=this.value;
                this.value=limitTxt({str:str,max:120});
                var len=this.value.length;
                jq('#active-des .txt-content span').eq(0).html(len);
            };
            //刮奖次数切换
            jq('#guajiang-num .guajiang-num-limit').click(function(){
                //jq(this).parents('.txt-content').find('.conw input').val('');
                jq(this).addClass('on').siblings('.guajiang-num-limit').removeClass('on');
            });
            //奖品类型切换
            jq('.page-guaguaka-edit').on('click','.jiangpin-type-box .hd li',function(){
                jq(this).addClass('on').siblings().removeClass('on');
                var index=jq(this).index();
                var bd=jq(this).parents('.hd').siblings('.bd').find('li').eq(index);
                bd.addClass('on').siblings().removeClass('on');
                vJiangpinNum();
            });
            //奖品名称字符限制
            jq('.page-guaguaka-edit').on('blur','.jiangpin-name',function(){
                var str=this.value;
                var str2=limitTxt({str:str,max:5});
                if(this.value!=str2){
                    this.value=str2;
                }
                var len=this.value.length;
                jq(this).siblings('span').eq(0).html(len);
            });
            //创建新奖项
            (function(){
                var num=jq('.active-jiangpin-set').length;
                var parent=jq('#active-jiangpin-set-group');
                var hintNum=jq('.create-active-btn-new-hint i');
                var max=10;
                hintNum.html(max-jq('.active-jiangpin-set').length);
                jq('.create-active-btn-new').click(function(){
                    var len=jq('.active-jiangpin-set').length;
                    if(len<10){
                        jq('.active-jiangpin-set').addClass('active-jiangpin-set-close-show');
                        var obj=jq('.active-jiangpin-set').eq(0).clone();
                        var aDom=obj.find('*[name]');
                        obj.find('input.jiangxiangid').val('');
                        aDom.each(function(i,e){
                            var name=jq(e).attr('name');
                            var name2=name.replace(/\d/,num);
                            jq(e).attr('name',name2);
                        });

                        var aInput=obj.find('.input');
                        aInput.val('');
                        parent.append(obj);
                        hintNum.html(max-len-1);
                        num++;
                    }
                });
            })();
            //删除新奖项
            (function(){
                jq('.page-guaguaka-edit').on('click','.active-jiangpin-set-close',function(){

                    jq(this).parents('.active-jiangpin-set').remove();
                    var box=jq('.active-jiangpin-set');
                    var length=box.length;
                    if(length==1){
                        jq('.active-jiangpin-set').removeClass('active-jiangpin-set-close-show');
                    }
                    var re=/\d+/i;
                    for (var attr in validateNext){
                        var index=attr.match(re);
                        if(index>=length){
                            delete validateNext[attr];
                        }
                    }
                    jq('.create-active-btn-new-hint i').html(10-length);
                    //console.log(validateNext);
                })
            })();




            //等待验证的变量(第二步)
            var validateNext={
                chance:false,//中奖率
            };
            //验证中奖率
            var vChance=function(){
                var obj=jq('#chance input');
                var value=obj.val();
                var opt={value:value};
                if(isSpace(opt)){//是空
                    //console.log('是空');
                    validateNext.chance=false;
                    obj.siblings('.parent-hint').addClass('on').html('本项必填');
                    return false;
                }else{//非空
                    //console.log('非空');
                    validateNext.chance=true;
                    obj.siblings('.parent-hint').removeClass('on');
                }
                if(isPositiveInteger(opt)){//是正整数
                    //console.log('是正整数');
                    if(value>=0&&value<=100){
                        validateNext.chance=true;
                        obj.siblings('.parent-hint').removeClass('on');
                    }else{
                        validateNext.chance=false;
                        obj.siblings('.parent-hint').addClass('on').html('请输入0~100的整数');
                }
                }else{
                    //console.log('不是正整数');
                    validateNext.chance=false;
                    obj.siblings('.parent-hint').addClass('on').html('请输入0~100的整数');
                    return false;
                }
            };
            //验证奖项名称
            function vJiangpinName(){
                jq('.jiangpin-name').each(function(i,e){
                    validateNext['jiangpinName'+i]=false;
                    var obj=jq(e);
                    var value=obj.val();
                    var opt={value:value};
                    if(isSpace(opt)){//是空
                        //console.log('是空');
                        obj.siblings('.parent-hint').addClass('on').html('本项必填');
                    }else{//非空
                        //console.log('非空');
                        obj.siblings('.parent-hint').removeClass('on');
                        validateNext['jiangpinName'+i]=true;
                    }
                });
            }
            //验证奖项类型之选择优惠选
            function vJiangpinTypeCoupon(){
                jq('.jiangpin-type').each(function(i,e){
                    validateNext['jiangpinTypeCoupon'+i]=false;
                    var obj=jq(e).find('.select-coupon');
                    var value=obj.val();
                    var isOn=obj.parents('li').hasClass('on');
                    if(isOn){
                        if(value==0){
                            obj.siblings('.parent-hint').addClass('on').html('请选择优惠券');
                        }else{
                            obj.siblings('.parent-hint').removeClass('on');
                            validateNext['jiangpinTypeCoupon'+i]=true;
                        }
                    }else{
                        validateNext['jiangpinTypeCoupon'+i]=true;
                    }
                })
            }
            //验证奖项类型之选择送积分
            function vJiangpinTypeScore(){
                jq('.jiangpin-type').each(function(i,e){
                    validateNext['jiangpinTypeScore'+i]=false;
                    var obj=jq(e).find('.score-value');
                    var value=obj.val();
                    var opt={value:value};
                    var isOn=obj.parents('li').hasClass('on');
                    if(isOn){
                        if(isSpace(opt)){//是空
                            //console.log('是空');
                            obj.siblings('.parent-hint').addClass('on').html('本项必填');
                        }else{//非空
                            //console.log('非空');
                            obj.siblings('.parent-hint').removeClass('on');
                            validateNext['jiangpinTypeScore'+i]=true;
                            if(isPositiveInteger(opt)){//是正整数
                                //console.log('是正整数');
                                obj.siblings('.parent-hint').removeClass('on');
                            }else{
                                //console.log('不是正整数');
                                obj.siblings('.parent-hint').addClass('on').html('请输入0或者正整数');
                                validateNext['jiangpinTypeScore'+i]=false;
                            }
                        }
                    }else{
                        validateNext['jiangpinTypeScore'+i]=true;
                    }
                })
            }
            //验证奖项类型之选择会员卡
            function vJiangpinTypeVip(){
                jq('.jiangpin-type').each(function(i,e){
                    validateNext['jiangpinTypeVip'+i]=false;
                    var obj=jq(e).find('.select-vip');
                    var value=obj.val();
                    var isOn=obj.parents('li').hasClass('on');
                    if(isOn){
                        if(value==0){
                            obj.siblings('.parent-hint').addClass('on').html('请选择会员卡');
                        }else{
                            obj.siblings('.parent-hint').removeClass('on');
                            validateNext['jiangpinTypeVip'+i]=true;
                        }
                    }else{
                        validateNext['jiangpinTypeVip'+i]=true;
                    }
                })
            }
            //验证奖品数量
            function vJiangpinNum(){
                jq('.jiangpin-num').each(function(i,e){
                    validateNext['jiangpinNum'+i]=false;
                    var obj=jq(e).find('input');
                    var value=obj.val();
                    var opt={value:value};
                    if(isSpace(opt)){//是空
                        //console.log('是空');
                        obj.siblings('.parent-hint').addClass('on').html('本项必填');
                    }else{//非空
                        //console.log('非空');
                        obj.siblings('.parent-hint').removeClass('on');
                        validateNext['jiangpinNum'+i]=true;
                        if(isPositiveInteger(opt)){//是整数
                            //console.log('是正整数');
                            //判定是否是优惠券,在判断数量是否大于限定的数量
                            var parent=obj.parents('.active-jiangpin-set').find('.select-coupon-radio');
                            var isCh=parent[0].checked==true;
                            if(isCh){//优惠券
                                var allnum=obj.parents('.active-jiangpin-set').find('.select-coupon').find('option:selected').attr('nums');
                                //console.log(allnum);
                                if(value*1>allnum*1){
                                    obj.siblings('.parent-hint').addClass('on').html('数量不可大于当前优惠券总数');
                                    validateNext['jiangpinNum'+i]=false;
                                }else{
                                    obj.siblings('.parent-hint').removeClass('on');
                                }
                            }else{
                                obj.siblings('.parent-hint').removeClass('on');
                            }
                        }else{
                            //console.log('不是整数');
                            obj.siblings('.parent-hint').addClass('on').html('请输入0或者正整数');
                            validateNext['jiangpinNum'+i]=false;
                        }
                    }
                })
            }
            jq('.page-guaguaka-edit').on('change','.select-coupon',function(){
                //console.log(111);
                var num=jq(this).find('option:selected').attr('nums');
                //console.log(jq(this).find('option:selected').attr('prize_num'),num);
                //console.log(jq(this).parents('.active-jiangpin-set').find('.jiangpin-num input'));
                jq(this).parents('.active-jiangpin-set').find('.jiangpin-num input').val(num);
                //jq(this).parents('.active-jiangpin-set').find('.jiangpin-num input').html(num);
            });


            //下一步的事件系列验证(第二步)
            var blurFnNext=function(){
                //验证中奖率
                jq('#chance input').blur(function(){
                    vChance();
                });
                //验证奖项名称
                jq('.page-guaguaka-edit').on('blur','.jiangpin-name',function(){
                    vJiangpinName();
                });
                //验证奖项类型之选择送积分
                jq('.page-guaguaka-edit').on('blur','.score-value',function(){
                    vJiangpinTypeScore();
                });
                //验证奖品数量
                jq('.page-guaguaka-edit').on('blur','.jiangpin-num',function(){
                    vJiangpinNum();
                });
            };
            blurFnNext();
            //下一步的直接系列验证(第二步)
            var validateFnNext=function(){
                vChance();
                vJiangpinName();
                vJiangpinTypeCoupon();
                vJiangpinTypeScore();
                vJiangpinTypeVip();
                vJiangpinNum();
            };










            //是否通过验证
            function isValidate(obj){
                var b=true;
                for(var attr in obj){
                    if(obj[attr]==false){
                        b=false;
                        break;
                    }
                }
                return b;
            }
            function isGetPrev(){return isValidate(validatePrev);}//验证上一步是否全部满足条件
            function isGetNext(){return isValidate(validateNext);}//验证下一步是否全部满足条件
            //下一步(这个功能已经被去掉)
            function nextStep(){
                validateFnPrev();
                if(isGetPrev()){
                    console.log('可以进行下一步');
                    jq('.next-step').removeClass('on');
                    jq('.prev-step').addClass('on');
                    jq('.save-step').addClass('on');
                    jq('.create-active-btn-box .create-active-btn').eq(0).removeClass('on');
                    jq('.create-active-btn-box .create-active-btn').eq(1).addClass('on');
                    jq('.info-set').eq(0).removeClass('on');
                    jq('.info-set').eq(1).addClass('on');
                }
            }
            jq('.next-step').click(function(){
                if(!document.querySelector('#viewshow')){
                    var obj=jq('#active-name input');
                    var value=obj.val();
                    var act_id=jq('#act_id').val();
                    jq.ajax({
                        url:'index.php?ctl=promotion/shaveCard&act=checkActName&act_name='+value.trim()+'&act_id='+act_id,
                        dataType:'json',
                        success:function(data){
                            if(data.rs=="false"){//不重名
                                obj.siblings('.parent-hint').removeClass('on');
                                validatePrev.activeName=true;
                                nextStep();
                            }else{//重名
                                obj.siblings('.parent-hint').addClass('on').html('奖项名称已存在，请修改');
                                validatePrev.activeName=false;
                            }
                        }
                    });
                }else{
                    nextStep();
                }
            });
            jq('.create-active-btn-box .create-active-btn').eq(1).click(function(){
                nextStep();
            });
            //上一步(这个功能已经被去掉)
            function prevStep(){
                jq('.next-step').addClass('on');
                jq('.prev-step').removeClass('on');
                jq('.save-step').removeClass('on');
                jq('.create-active-btn-box .create-active-btn').eq(0).addClass('on');
                jq('.create-active-btn-box .create-active-btn').eq(1).removeClass('on');
                jq('.info-set').eq(0).addClass('on');
                jq('.info-set').eq(1).removeClass('on');
            }
            jq('.prev-step').click(function(){
                prevStep();
            });
            jq('.create-active-btn-box .create-active-btn').eq(0).click(function(){
                prevStep();
            });
            //保存
            jq('.save-step').click(function(){
                //console.log(validatePrev);
                console.log(validateNext);
                validateFnPrev();
                validateFnNext();
                if(isGetPrev()&&isGetNext()){
                    //index.php#ctl=promotion/shaveCard&act=toSave
                    var _form=$('sec-kill-form');
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
                                W.page('index.php?ctl=promotion/shaveCard&act=index');
                            }catch(e){}
                            MODALPANEL.hide();
                            W.page('index.php?ctl=promotion/shaveCard&act=index');
                        };
                        _form.set('action',_formActionURL).fireEvent('submit');
                    };
                    subGoodsForm(this);
                }
            });

            //离开页面时触发弹框
            base.onunload();
        }
    }
});