"use strict";
define(function (require, exports, module) {
    function lazyload(opts){
        var opt=opts||{};
        var height=opt.height||0;//多加载一部分高度的图片
        var interval=80;//延迟时间
        var doc=document;
        var fn=function(){
            var aImg=[].slice.call(doc.getElementsByClassName('lazy-load'));//所有的img元素节点
            var iLen=aImg.length;
            if(!iLen){return false;}
            var offsetTop=function(obj){//获取top
                var top=0;
                while(obj){
                    top+=obj.offsetTop;
                    obj=obj.offsetParent;
                }
                return top;
            };
            var src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUCB1jYAACAAAFAAGNu5vzAAAAAElFTkSuQmCC';
            aImg.forEach(function(v){
                if(v.tagName.toLowerCase()=='img'){
                    if(!v.getAttribute('src')){
                        v.src=src;
                        v.setAttribute('height','100%');
                        v.setAttribute('width','100%');
                    }
                }
            });
            var iClientH=doc.documentElement.clientHeight;
            var iScrollTop=doc.documentElement.scrollTop||doc.body.scrollTop;
            var iResultTop=iClientH+iScrollTop+height;
            aImg.forEach(function(v){
                if(!v.offsetWidth){
                    return false;
                }
                var iObjTop=offsetTop(v)-height;
                var iObjBottom=offsetTop(v)+v.offsetHeight;
                //height
                if(iResultTop>=iObjTop&&iObjTop>=iScrollTop||iObjBottom>iScrollTop&&iObjBottom<iResultTop){
                    var srcHanlderAfter=base.utils.dataSrcHandle({image:v}).src;
                    if(!srcHanlderAfter){
                        return false;
                    }
                    if(v.tagName.toLowerCase()=='img'){
                        v.src=srcHanlderAfter;
                        v.removeAttribute('height');
                        v.removeAttribute('width');
                    }else{
                        v.style.backgroundImage='url('+srcHanlderAfter+')';
                    }
                    v.classList.remove('lazy-load');
                }
            })
        };
        fn();
        var timer=null;
        window.addEventListener('scroll',function(){
            clearTimeout(timer);
            timer=setTimeout(fn,interval);
        });
        lazyload.fn=fn;
    }
    module.exports = lazyload;
});