define(function (require, exports, module){
    function returnTop (json){//普通黑色遮罩
        var doc=document;
        var body=doc.body;
        var html='<em><img style="height:100%;" data-src="static/standard/images/return-top.svg" src="" alt=""></em>置顶';
        var section=doc.createElement('section');
        section.className='g-return-top';
        section.innerHTML=html;
        body.appendChild(section);
        var oImg=section.querySelector('img');
        base.scrollTo({obj:section,resultTop:0});
        var iTop=doc.documentElement.scrollTop||doc.body.scrollTop;
        window.addEventListener('scroll',function(){
            iTop=doc.documentElement.scrollTop||doc.body.scrollTop;
            if(iTop>=200){
                section.style.display='block';
                if(oImg.getAttribute('src')!=oImg.dataset.src){
                    oImg.src=oImg.dataset.src;
                }
            }else{
                section.style.display='none';
            }
        },false);
    }

    module.exports = returnTop;
});