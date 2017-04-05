/**
 * Created by zhouhuafei on 2017/1/6.
 */
define(function (require, exports, module) {
    function addSubtract(json){//购物加减商品系列
        var noActiveClass=json.noActiveClass||'on';//不能点的时候的class
        var minNUm=json.minNUm||1;//最小数量
        var add=json.add;//加的按钮
        var addCallback=json.addCallback;//加的回调
        var substract=json.substract;//减少的按钮
        var substractCallback=json.substractCallback;//减少的回调
        var input=json.input;//输入框的按钮
        var blurCallback=json.blurCallback;//失去焦点的回调
        var addShopping=json.addShopping;//加入购物车的按钮
        var addShoppingCallback=json.addShoppingCallback||function(){console.log('no find addShoppingCallback')};//加入购物车的回调
        var buyNow=json.buyNow;//立即购买的按钮
        var buyNowCallback=json.buyNowCallback||function(){console.log('no find buyNowCallback')};//立即购买的回调
        var inventoryNum=parseInt(json.inventoryNum);//商品库存
        var space=function(){
            if(input["value"].trim()==''){
                input["value"]=1;
            }
        };
        //增加
        add.onclick=function(){
            space();
            var num=parseInt(input.value);
            num++;
            input["value"]=num;
            if(num>=inventoryNum){
                if(inventoryNum==0){
                    input["value"]=minNUm;
                }else{
                    input["value"]=inventoryNum;
                }
                add.classList.add(noActiveClass);
            }
            substract.classList.remove(noActiveClass);
            addCallback&&addCallback();
        };
        //减少
        substract.onclick=function(){
            space();
            var num=parseInt(input.value);
            num--;
            input["value"]=num;
            if(num<=minNUm){
                input["value"]=minNUm;
                substract.classList.add(noActiveClass);
            }
            add.classList.remove(noActiveClass);
            substractCallback&&substractCallback();
        };
        //获取焦点
        input["onfocus"]=function(){
            input.select();
        };
        //失去焦点
        input["onblur"]=function(){
            space();
            var num=parseInt(input.value);
            if(isNaN(num)){
                num=minNUm;
            }
            substract.classList.remove(noActiveClass);
            add.classList.remove(noActiveClass);
            if(num>=inventoryNum){
                input["value"]=inventoryNum;
                add.classList.add(noActiveClass);
            }
            if(num<=minNUm){
                input["value"]=minNUm;
                substract.classList.add(noActiveClass);
            }
            blurCallback&&blurCallback();
        };
        //加入购物车
        if(addShopping){
            addShopping.onclick=addShoppingCallback;
        }
        //立即购买
        if(buyNow){
            buyNow.onclick=buyNowCallback;
        }
    }
    module.exports=addSubtract;
});