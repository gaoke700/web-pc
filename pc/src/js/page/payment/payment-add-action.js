define(function(require,exports,module){
    require('../../../css/page/payment/payment-add-action.css');
    
    module.exports = {
        init: function(){
            var $select = document.querySelectorAll('.select-content');
            var $couponType = document.querySelector('.coupon-type');
            var $scoreType = document.querySelector('.integral');
            var $levelType = document.querySelector('.level-type');
			var $guaguakaType = document.querySelector('.guaguaka-type');
            var $view = document.querySelector('.view').value;     //查看/编辑
            var $save = document.querySelector('.pon-baoBtn');
            var $cancel = document.querySelector('.pon-quBtn');
            var $startTime = document.querySelector('.start-time');
            var $endTime = document.querySelector('.end-time');
            var jq=MJQ;

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

            //开始时间和结束时间验证
            // function timeV(obj){
            //     var $hint = obj.previousElementSibling;
            //     if(obj.value.trim() == ''){
            //         $hint.classList.add('on');
            //         $hint.innerHTML = '本项必填';

            //     }else{
            //         $hint.classList.remove('on');
            //     }
            // }

            // function moveVa(){
            //     //开始时间
            //     timeV($startTime);
            //     //结束时间
            //     timeV($endTime);
            // }
            // document.addEventListener('click',function(){
            //     console.log(88);
            //     moveVa();
            // });

            //选择类型
            for(var i=0;i<$select.length;i++){
                $select[i].addEventListener('click',function(){
                    var $option = this.nextElementSibling;
                    $option.classList.add('on');
                });
            }
            //dd点击
            var $dd = document.querySelectorAll('.option dd');
            for(var i=0;i<$dd.length;i++){
                $dd[i].addEventListener('click',function(){
                    var $title = this.parentNode.previousElementSibling.childNodes[1];
                    var $titleDataId = $title.dataset.id;
                    var $ddDataId = this.dataset.id;

                    $title.innerHTML = this.innerHTML;
                    $titleDataId = $ddDataId;
                    if(this.parentNode.classList.contains('on')){
                        this.parentNode.classList.remove('on');
                    }

                    var $parentLi = this.parentNode.parentNode.parentNode.dataset.type;
                    if($parentLi == 'coupon'){
                        $couponType.value = $titleDataId;
                    }
                    if($parentLi == 'level'){
                        $levelType.value = $titleDataId;
                    }
                    if($parentLi == 'guaguaka'){
                        $guaguakaType.value = $titleDataId;
                    }
                });
            }

            //tab
            var thLi = document.querySelectorAll('.hd li');
            var tdLi = document.querySelectorAll('.bd li');

            function analogyTab(th,td){
                for(var i=0;i<th.length;i++){
                    th[i].index = i;
                    th[i].addEventListener('click',function(){
                        if($view == '1'){  //0为编辑，1为查看
                            return false;
                        }
                        for(var j=0;j<th.length;j++){
                            removeDisabled(th[j]);
                            removeDisabled(td[j]);
                        }
                        addDisabled(this);
                        addDisabled(td[this.index]);
                    });

                };
            }

            //去掉disabled
            function removeDisabled(e){
                e.classList.remove('on');
                var $thAllInput = e.querySelectorAll('input');
                for(var m=0;m<$thAllInput.length;m++){
                    $thAllInput[m].removeAttribute('disabled');
                }
            }
            //兄弟元素增加disabled
            function addDisabled(e){
                e.classList.add('on');
                var $hdLIliSiblings = e.siblings();
                for(var l=0;l<$hdLIliSiblings.length;l++){
                    var $siblingsInput = $hdLIliSiblings[l].querySelector('input');
                    $siblingsInput.setAttribute('disabled','disabled');
                };
            }

            (function(){  //保存刷新后仍停留在当前tab下
              for(var i=0;i<thLi.length;i++){
                tdLi[i].classList.remove('on');
                if(thLi[i].classList.contains('on')){
                  var $index = i;
                  if(!tdLi[i].classList.contains('on')){
                    tdLi[$index].classList.add('on');
                  }
                }
              }
            })();
            window.onload = analogyTab(thLi,tdLi);

            //活动名称--非空输入字符个数
            var $name = document.querySelector('.action-name');
            var $length = document.querySelector('.word-length');
            var $nameValue = $name.value;

            (function(){  //包含新增/编辑
              $length.innerHTML = $nameValue.length;
              $name.addEventListener('input',function(){
                $length.innerHTML = $name.value.length;
              });
            })();

            //对所有的input[type=text]进行非空判断
            var regMoney = /^\d+(\.\d{1,2})?$/;  //0和正数，包含一位或者两位小数
            var regNum = /^\d+$/;  //0和正整数
            var $integral = document.querySelector('.integral');
            var $hintAll = document.querySelectorAll('.parent-hint');
            var $input = [].slice.call(document.querySelectorAll('input[type=text]'));

            $input.forEach(function(v){
              v.addEventListener('blur',function(){
                  checkNull(v);
              });
            });
            
            document.addEventListener('click',function(){
                checkNull(jq('#startTime')[0]);
                checkNull(jq('#endTime')[0]);
            });

            function checkNull(v){
                var $hint = v.previousElementSibling;
                var $scoreLi = v.parentNode.parentNode.parentNode;
                var $money = document.querySelector('.money2');

                if(v.value.trim() == ''){ //空
                    if($hint.classList.contains('maxwidth')){
                        $hint.classList.remove('maxwidth');
                    }
                    if(v.classList.contains('integral')){
                        if(!$scoreLi.classList.contains('on')){
                            return false;
                        }
                    }
                    $hint.classList.add('on');
                    $hint.innerHTML = '本项必填';
                }else {
                    $hint.classList.remove('on');
                    //参与条件--可输入2位小数
                    if(v.classList.contains('money')){
                        if(regMoney.test($money.value) == false){
                            $hint.classList.add('on');
                            $hint.classList.add('maxwidth');
                            $hint.innerHTML = '请输入正数,最多保留两位小数';
                        }else {
                            $hint.classList.remove('on');
                        }
                    }
                    //送积分--0和正整数
                    if(v.classList.contains('integral')){
                        if(!$scoreLi.classList.contains('on')){
                            return false;
                        }
                        if(regNum.test($integral.value) == false){
                            $hint.classList.add('on');
                            $hint.innerHTML = '请输入0或者正数';
                        }
                    }
                }
            }

            //查看
            (function(){
                if($view == '1'){  //0为编辑，1为查看
                    //所有的input[type=text]不可以输入
                    var $inputText =  document.querySelectorAll('input[type=text]');
                    for(var i=0;i<$inputText.length;i++){
                        $inputText[i].setAttribute('disabled','disabled');
                    }
                    //保存不显示
                    $save.classList.add('on');
                    $cancel.classList.add('on');
                    $cancel.innerHTML = '关闭';
                }
            })();

            //取消
            $cancel.addEventListener('click',function(){
                window.location.href='index.php?ctl=promotion/paymentGift&act=index';
                //W.page('index.php?ctl=promotion/paymentGift&act=index');  //返回到上一页
            });

            //保存
            (function(){
                var _form=$('payment_gitft_form');
                var _formActionURL=_form.get('action');
                _form.set('target',"{ure:'messagebox',update:'messagebox'}");

                var otherForm = function (submitBtn){
                    //console.log(6);
                    $input.forEach(function(v){
                        checkNull(v);
                    });
                    //console.log(7);

                    for(var i=0;i<$hintAll.length;i++){
                        if($hintAll[i].classList.contains('on')){
                            return false;
                        }
                    }
                    //console.log(8);

                    $('loadMask').amongTo(window).show();
                    window.MessageBoxOnShow=function(box,success){
                        if(!success)return;
                        try{
                            if(dlg =$('payment_gitft_form').getParent('.dialog')){
                              dlg.retrieve('instance').close();
                            }
                            window.location.href='index.php?ctl=promotion/paymentGift&act=index';
                            //W.page('index.php?ctl=promotion/paymentGift&act=index');
                        }catch(e){}
                        MODALPANEL.hide();
                        window.location.href='index.php?ctl=promotion/paymentGift&act=index';
                    };
                    _form.set('action',_formActionURL).fireEvent('submit');
                };
                document.querySelector('.pon-baoBtn').onclick=function(){
                    otherForm(this);
                }
            })();
            
            //离开页面时触发弹框
            base.onunload();
        }
    }
});