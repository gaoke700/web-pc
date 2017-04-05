/**
 * Created by zhouhuafei on 2017/1/7.
 */

define(function (require, exports, module){
    function isScrollNavigatorBottom(json){
        var opt=json||{};
        var success=opt.success||function(){};
        var fail=opt.fail||function(){};
        var doc=document;
        var interval=opt.interval||80;//延迟时间
        var isBottom=true;//假设到达了底部
        var fn=function(){
            var allH=doc.body.offsetHeight;
            var scrollTop=doc.documentElement.scrollTop||doc.body.scrollTop;
            var clientHeight=doc.documentElement.clientHeight;
            if(scrollTop+clientHeight>=allH-100&&isBottom){
                isBottom=false;
                success();
                //假设1000毫秒之后数据加载完毕
                setTimeout(function(){
                    isBottom=true;
                },1000)
            }else{
                fail();
            }
        };
        fn();
        var timer=null;
        var fnScroll=function(){
            clearTimeout(timer);
            timer=setTimeout(function(){
                fn();
            },interval);
        };
        window.addEventListener('scroll',function(){
            fnScroll();
        })
    }
    module.exports=isScrollNavigatorBottom;
});