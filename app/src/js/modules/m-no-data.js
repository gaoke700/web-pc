//我的记录里的商品
define(function (require, exports, module){
    function Fn(json){
        this.opt=json||{};
        this.wrap=this.opt.wrap||'';
        this.logoHref=this.opt.logoHref||'javascript:;';
        this.logoSrc=this.opt.logoSrc;
        this.logoInfo=this.opt.logoInfo||'没有数据';
        this.button=this.opt.btn||[{href:'/',info:'进店逛逛'}];
        this.isShowBtn=this.opt.isShowBtn==false?this.opt.isShowBtn:true;
        this.render();
    }
    Fn.prototype.renderParent=function(){
        this.parentDom=document.createElement('div');
        this.parentDom.classList.add('m-no-data');
        this.parentDom.innerHTML=`
            <div class="m-no-data-img">
                <a href="${this.logoHref}"><img src="${this.logoSrc}" alt=""></a>
            </div>
            <div class="m-no-data-txt">${this.logoInfo}</div>            
            ${this.renderBtn()}            
        `;
        if(this.wrap){
            this.wrapDom=document.querySelector(this.wrap);
            this.wrapDom&&this.wrapDom.appendChild(this.parentDom);
        }
    };
    Fn.prototype.renderBtn=function(){
        var str=``;
        if(!this.isShowBtn){
            return ``;
        }
        this.button.forEach&&this.button.forEach(function(v){
            str+=`<div class="m-no-data-btn"><a href="${v.href}">${v.info}</a></div>`;
        });
        return str;
    };
    Fn.prototype.render=function(fn){
        this.renderParent();
        fn&&fn(this.parentDom);
    };
    module.exports = Fn;
});