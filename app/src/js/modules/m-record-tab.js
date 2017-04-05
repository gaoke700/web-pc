//我的记录里的商品
define(function (require, exports, module){
    function Fn(json){
        this.opt=json||{};
        this.info=this.opt.info||['没有','数据'];
        var arr=[];
        this.info.forEach(function(){
            arr.push('javascript:;');
        });
        this.link=this.opt.link||arr;
        this.index=this.opt.index||'0';
    }
    Fn.prototype.renderParent=function(){
        this.parentDom=document.createElement('div');
        this.parentDom.classList.add('m-record-tab');
        this.parentDom.innerHTML=`
            ${this.renderData()}
        `;
    };
    Fn.prototype.renderData=function(){
        var self=this;
        var str=``;
        self.info.forEach(function(v,i){
            var className=``;
            var link=self.link[i];
            if(i==self.index){
                className=`m-record-tab-btn-on`;
            }
            str+=`<div class="m-record-tab-btn ${className}"><a href="${link}">${v}</a></div>`;
        });
        return str;
    };
    Fn.prototype.render=function(fn){
        this.renderParent();
        fn&&fn(this.parentDom);
    };
    module.exports = Fn;
});