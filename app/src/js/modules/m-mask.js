define(function (require, exports, module){
    function mask (json){//普通黑色遮罩
        var doc=document;
        var body=doc.body;
        var opt=json||{};
        opt.isTransparent=opt.isTransparent==true?opt.isTransparent:false;//默认不是透明的
        opt.style=opt.style||{};
        var mask=doc.createElement('div');
        var style='';
        var className='';
        if(opt.isTransparent){
            className='mask-transparent';
            style='z-index:9999;background:rgba(0,0,0,0);';
        }else{
            className='mask';
            style='z-index:200;background:rgba(0,0,0,0.4);';
        }
        mask.className=className;
        mask.setAttribute('style','position:fixed;left:0;top:0;width:100%;height:100%;'+style);
        for(var attr in opt.style){
            if(opt.style.hasOwnProperty(attr)){
                mask.style[attr]=opt.style[attr];
            }
        }
        return {
            show:function(){
                body.appendChild(mask);
            },
            hide:function(){
                body.removeChild(mask);
            }
        };
    }

    module.exports = mask;
});