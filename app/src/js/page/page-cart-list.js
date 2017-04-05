define(function(require,exports,module){
    var addSubtract=require('js/common/plug/addSubtract.js');
    var dialogSecondary=require('js/common/plug/dialog.js');
    module.exports={
        init:function(){
            //渲染切换部分
            (function(){
                var Fn=require('js/modules/m-record-tab.js');
                var main=document.querySelector('.main-record-tab');
                var fn=new Fn({
                    info:['购物车','收藏','购物记录'],
                    link:['?carts.html','?member-myFavorites.html','?member-shoppingRecord.html'],
                    index:0
                });
                fn.render(function(dom){
                    main.appendChild(dom);
                })
            })();
            //没有商品
            var o=document.querySelector('#noData');
            if(o){
                var NoData=require('js/modules/m-no-data.js');
                new NoData({
                    wrap:'#noData',
                    logoHref:'',
                    logoSrc:'images/no/cart.png',
                    logoInfo:'快去给我挑点宝贝吧~'
                });
                return false;
            }
            //主体功能部分
            (function(){
                const doc=document;
                //全选,编辑,删除,结算
                {
                    const parent=doc.querySelector('.shopping-store');//父级容器
                    const getOrder=doc.querySelector('.settlement .btn');//结算按钮
                    const aLi=[].slice.call(doc.querySelectorAll('.shopping-content li'));//所有的li
                    const aCheckbox=doc.querySelectorAll('input[type=checkbox]');//所有的input
                    const oBtn=aCheckbox.item(0);//全选按钮
                    const oBtnLabel=doc.querySelector('.shopping-edit label');//全选默认文字的盒子
                    const sBtnDefaultTxt=oBtnLabel.innerHTML;//全选默认文字
                    const aInputCheckBox=[].slice.call(aCheckbox,1);//多选框
                    const oEdit=doc.querySelector('.shopping-edit span.bianji');//编辑
                    const lingquan=doc.querySelector('.shopping-edit span.lingquan');//领券
                    const sEditDefaultTxt=oEdit.innerHTML;//编辑默认文字
                    const aDelete=[].slice.call(doc.querySelectorAll('.shopping-content aside'));//删除
                    const oAllMoney=doc.querySelector('.settlement-content b');//总额盒子
                    const oResultMoney=doc.querySelector('.settlement-content i');//合计盒子
                    const oSubstractMoney=doc.querySelector('.settlement-content span');//满减盒子
                    let allMoney=0;//总额
                    let substractMoney=0;//满减
                    let resultMoney=0;//合计
                    //初始化输入框的值
                    aLi.forEach(v=>{v.querySelector('h6 input').value=v.querySelector('h5 i').innerHTML;});
                    //初始化商品数据(把商品数据存到cookie里,保证用户二次进来时,数据依然存在)
                    const setCartLocal=(pid,num)=>{
                        //存储cookie(php负责删除)
                        if(!base.utils.getCookie('C')){//存
                            let aLi=[].slice.call(doc.querySelectorAll('.shopping-content li'));//所有的li
                            let aI=doc.querySelectorAll('.shopping-content h5 i');//所有的i
                            let C=[];//存起来
                            aLi.forEach((v,i)=>{
                                var pid=v.dataset.pid;
                                var num=aI[i].innerHTML;
                                C.push({p:pid,n:num});
                            });
                            base.utils.setCookie('C',JSON.stringify(C));
                        }
                        //修改cookie
                        var arr=JSON.parse(base.utils.getCookie('C'));
                        arr.forEach(v=>{
                            if(v.p==pid){
                                v.n=num;
                            }
                        });
                        //console.log(arr);
                        base.utils.setCookie('C',JSON.stringify(arr));
                    };
                    //取cookie(把商品数据存到cookie里,保证用户二次进来时,数据依然存在)
                    (function(){
                        if(base.utils.getCookie('C')){
                            let aLi=[].slice.call(doc.querySelectorAll('.shopping-content li'));//所有的li
                            let arr=JSON.parse(decodeURIComponent(base.utils.getCookie('C')));
                            aLi.forEach(v=>{
                                var pid=v.dataset.pid;
                                var input=v.querySelector('h6 input');
                                var i=v.querySelector('h5 i');
                                arr.forEach(vs=>{
                                    if(pid==vs["p"]){
                                        input.value=vs["n"];
                                        i.innerHTML=vs["n"];
                                    }
                                });
                            });
                        }
                    })();
                    //计算总额度
                    const getAllMoney=()=>{
                        let aInputCheckBox=[].slice.call(doc.querySelectorAll('input[type=checkbox]'),1);
                        let oMoney=[].slice.call(doc.querySelectorAll('.shopping-content h4 i'));
                        let oNumber=[].slice.call(doc.querySelectorAll('.shopping-content h5 i'));
                        oMoney.forEach(function(v,i){
                            if(aInputCheckBox[i].checked){
                                allMoney+=v.innerHTML*oNumber[i].innerHTML;
                            }
                        });
                        if(oAllMoney){
                            oAllMoney.innerHTML=Number(allMoney).toFixed(2);
                        }
                    };
                    getAllMoney();
                    //计算满减
                    const getSubstractMoney=()=>{
                        const aSubstract=[].slice.call(doc.querySelectorAll('.shopping-substract'));//找到满减商品
                        const aRule=[].slice.call(doc.querySelectorAll('.shopping-substract .shopping-substract-input'));//找到满减商品对应的满减规格
                        aSubstract.forEach((v,i)=>{
                            //三种满减规则
                            //1.满100，减10,上不封顶   (rules_type=>1      unlimited=>1)
                            //2.满100，减10,           (rules_type=>1)
                            //3.满100，减10；满200减20    (rules_type=>2)
                            if(!aRule[i]){ return false;}
                            var rule=JSON.parse(aRule[i].value);
                            let substractMoneyRule=rule.rules;//满减规则
                            let all=0;//一条类目里的总金额
                            let aMoney=[].slice.call(v.querySelectorAll('h4 i'));
                            let aNumber=[].slice.call(v.querySelectorAll('h5 i'));
                            let aInputCheckBox=[].slice.call(v.querySelectorAll('input[type=checkbox]'));
                            aMoney.forEach(function(v,i){
                                if(aInputCheckBox[i].checked){
                                    all+=v.innerHTML*aNumber[i].innerHTML;
                                }
                            });
                            //根据满减规则计算满减
                            if(rule.rules_type=='1'&&rule.unlimited){//上不封顶
                                substractMoney+=parseInt(all/substractMoneyRule[0])*substractMoneyRule[1];
                                //console.log('上不封顶',all,substractMoneyRule,substractMoney);
                            }else if(rule.rules_type=='1'){//封顶
                                if(all>=substractMoneyRule[0]){
                                    substractMoney+=substractMoneyRule[1];
                                }
                                //console.log('封顶',all,substractMoneyRule,substractMoney);
                            }else if(rule.rules_type=='2'){//多级优惠
                                var max=0;
                                substractMoneyRule.forEach(v=>{
                                    if(all>=v[0]&&v[1]!=0){
                                        max=v[1];
                                    }
                                });
                                substractMoney+=max;
                                //console.log('多级优惠',all,substractMoneyRule,substractMoney);
                            }
                        });
                        if(oSubstractMoney){
                            oSubstractMoney.innerHTML=Number(substractMoney).toFixed(2);
                        }
                    };
                    getSubstractMoney();
                    //计算合计
                    const getResultMoney=()=>{
                        resultMoney=allMoney-substractMoney;
                        if(oResultMoney){
                            oResultMoney.innerHTML=Number(resultMoney).toFixed(2);
                        }
                    };
                    getResultMoney();
                    //价格清零
                    const zeroMoney=()=>{
                        allMoney=0;//总额
                        substractMoney=0;//满减
                        resultMoney=0;//合计
                        if(oAllMoney){
                            oAllMoney.innerHTML=Number(allMoney).toFixed(2);
                        }
                        if(oSubstractMoney){
                            oSubstractMoney.innerHTML=Number(substractMoney).toFixed(2);
                        }
                        if(oResultMoney){
                            oResultMoney.innerHTML=Number(resultMoney).toFixed(2);
                        }
                    };
                    //全选和取消全选
                    oBtn.isSelect=true;//全选和取消全选
                    oBtn.addEventListener('click',function(){
                        let self=this;
                        aInputCheckBox.forEach(v=>{v.checked=self.isSelect?false:true;});
                        this.isSelect=!this.isSelect;
                        if(this.isSelect){//全选
                            oBtnLabel.innerHTML=sBtnDefaultTxt;
                            getAllMoney();//重新计算总额
                            getSubstractMoney();//重新计算满减
                            getResultMoney();//重新计算合计
                        }else{//取消全选
                            oBtnLabel.innerHTML='全选';
                            zeroMoney();//价格清零
                        }
                    });
                    //自动全选
                    const autoSelect=()=>{
                        let isAllSelect=true;//假设全部选中
                        let aInputCheckBox=[].slice.call(doc.querySelectorAll('input[type=checkbox]'),1);
                        aInputCheckBox.forEach(v=>{(!v.checked)&&(isAllSelect=false);});
                        if(isAllSelect){
                            oBtn.checked=true;
                            oBtn.isSelect=true;
                            oBtnLabel.innerHTML=sBtnDefaultTxt;
                        }else{
                            oBtn.checked=false;
                            oBtn.isSelect=false;
                            oBtnLabel.innerHTML='全选';
                        }
                    };
                    //选中所有按钮,自动勾选全选
                    aInputCheckBox.forEach(v=>{
                        v.addEventListener('click',()=>{
                            zeroMoney();//价格清零
                            getAllMoney();//重新计算总额
                            getSubstractMoney();//重新计算满减
                            getResultMoney();//重新计算合计
                            autoSelect();//满足条件自动全选
                        })
                    });
                    //编辑
                    oEdit.isEdit=false;//编辑和完成
                    oEdit.addEventListener('click',function(){
                        this.isEdit=!this.isEdit;
                        if(this.isEdit){
                            aLi.forEach(function(v){
                                //给删除按钮添加小图标(小优化)
                                let img=v.querySelector('aside img');
                                if(img.getAttribute('src')==''){
                                    img.src=img.dataset.src;
                                }
                                v.classList.add('on');
                            });
                            this.innerHTML='完成';
                        }else{
                            aLi.forEach(function(v){v.classList.remove('on');});
                            this.innerHTML=sEditDefaultTxt;
                        }
                    });
                    //加减商品系列
                    aLi.forEach(function(v){
                        let inventoryNum=v.dataset.store;
                        let add=v.querySelector('h6 em');
                        let substract=v.querySelector('h6 b');
                        let input=v.querySelector('h6 input');
                        let num=v.querySelector('h5 i');
                        if(input.value*1>inventoryNum){
                            if(inventoryNum==0){
                                inventoryNum=1;
                                v.className='no-store';

                                dialogSecondary.dialogPrompt1({content:'库存不足,请删除'});

                            }else{

                                dialogSecondary.dialogPrompt1({content:'库存不足,已校正'});

                            }
                            input.value=inventoryNum;
                            num.innerHTML=inventoryNum;
                        }
                        //加减号添加移除色彩
                        if(input.value>1){
                            substract.classList.remove('on');
                        }
                        if(input.value>=inventoryNum*1){
                            add.classList.add('on');
                        }
                        //加减输入框的回调
                        let callback=()=>{
                            num.innerHTML=input.value;
                            setCartLocal(v.dataset.pid,input.value);//修改本地数据
                            zeroMoney();//价格清零
                            getAllMoney();//重新计算总额
                            getSubstractMoney();//重新计算满减
                            getResultMoney();//重新计算合计
                        };
                        //加减功能系列
                        addSubtract({
                            add:add,//加
                            addCallback:function(){//加的回调
                                callback();
                            },
                            substract:substract,//减
                            substractCallback:function(){//减的回调
                                callback();
                            },
                            input:input,//输入框
                            blurCallback:function(){//输入框失去焦点的回调
                                callback();
                            },
                            inventoryNum:inventoryNum//商品库存
                        });
                    });
                    //删除
                    aDelete.forEach(function(v,i){
                        v.addEventListener('click',function(){
                            dialogSecondary.dialogCustom1({
                                content:'确认删除吗？',
                                okCallback:function(){
                                    //移除节点
                                    var parent=$(v).closest('li')[0];
                                    var pid=parent.dataset.pid;
                                    var num=parent.querySelector('h5 i').innerHTML;
                                    $.ajax({
                                        type:'post',
                                        url:'openapi.php?act=deleteCart',
                                        data:{
                                            product_id:pid,
                                            num:num
                                        },
                                        dataType: 'json',
                                        success:function(data){
                                            //console.log(num);
                                            if(data.res=='succ'){
                                                if(aLi[i].parentNode.children.length==1){
                                                    const con=$(v).closest('.shopping-content')[0];
                                                    con.parentNode.removeChild(con);
                                                }else{
                                                    aLi[i].parentNode.removeChild(aLi[i]);
                                                }
                                                //自动全选
                                                autoSelect();
                                                //重新计算金额
                                                zeroMoney();//价格清零
                                                getAllMoney();//重新计算总额
                                                getSubstractMoney();//重新计算满减
                                                getResultMoney();//重新计算合计
                                                //购物车是空的,刷新页面
                                                if(document.querySelectorAll('.shopping-content').length==0){
                                                    window.location.reload();
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        })
                    });
                    //结算
                    getOrder.addEventListener('click',()=>{
                        var aLi=[].slice.call(doc.querySelectorAll('.shopping-content li'));//所有的li
                        var aI=doc.querySelectorAll('.shopping-content h5 i');
                        var form=doc.createElement('form');
                        form.action='index.php?ctl=orders&act=checkout';
                        form.method='post';
                        document.body.appendChild(form);
                        var formHtml='';
                        var isStore=true;//是否有商品是0库存
                        aLi.forEach((v,i)=>{
                            if(v.dataset.store==0){
                                isStore=false;
                            }
                            if(v.querySelector('input:checked')){
                                formHtml+='<input type="hidden" name="goods['+v.dataset.pid+']" value="'+aI[i].innerHTML+'" />';
                            }
                        });
                        if(isStore){
                            form.innerHTML=formHtml;
                            form.submit();
                        }else{

                            dialogSecondary.dialogPrompt1({content:'请删除没有库存的商品'});

                        }
                    });
                    //领券
                    lingquan.addEventListener('click',function(){
                        var Coupon=require('js/modules/dialog/dialog-get-coupons.js');
                        new Coupon({headerTxt:'优惠券',couponsList:[]});
                    })
                }
            })();
            //延迟加载
            require('js/common/plug/lazy_load_last.js')({height:1000});
        }
    }
});


