//我的记录里的商品
define(function (require, exports, module){
    var addSubtract=require('js/common/plug/addSubtract.js');
    function Shopping(opt){
        this.opt=opt||{};
        this.configData=this.opt.configData||{};//配置信息
        this.ajaxData=this.opt.ajaxData||{};//商品信息
        this.configData={
            isShowImgSrc:this.configData.isShowImgSrc==true?this.configData.isShowImgSrc:false,//是否直接显示图片(默认不直接显示)
            isShowMark:this.configData.isShowMark==true?this.configData.isShowMark:false,//是否直接显示标记(默认不直接显示)
            isShowRadio:this.configData.isShowRadio==true?this.configData.isShowRadio:false,//是否直接显示多选框(默认不直接显示)
            isShowNum:this.configData.isShowNum==false?this.configData.isShowNum:true,//是否渲染数量(默认直接显示)
            isShowInfoTxt:this.configData.isShowInfoTxt==false?this.configData.isShowInfoTxt:true,//是否直接显示文字区域(默认直接显示)
            isShowInfoOption:this.configData.isShowInfoOption==true?this.configData.isShowInfoOption:false,//是否直接显示操作区域(默认不直接显示)
            isShowDelete:this.configData.isShowDelete==true?this.configData.isShowDelete:false,//是否渲染删除按钮
            isShowTouchDelete:this.configData.isShowTouchDelete==true?this.configData.isShowTouchDelete:false,//是否开启触摸删除功能(默认不开启)
        };
        this.ajaxData={
            goodsName:this.ajaxData.goodsName,//商品名称
            goodsStandard:this.ajaxData.goodsStandard||'默认规格',//商品规格
            goodsBuyNum:this.ajaxData.goodsBuyNum,//商品购买数量
            goodsStore:this.ajaxData.goodsStore,//商品的库存
            gid:this.ajaxData.gid,//商品的id
            marketPrice:this.ajaxData.marketPrice||'undefined.undefined',//市场价格
            nowPrice:this.ajaxData.nowPrice||'undefined.undefined',//现在的价格
            vipPrice:this.ajaxData.vipPrice||'undefined.undefined',//会员价格
            likeNum:this.ajaxData.likeNum,//多少人喜欢
            imgSrc:this.ajaxData.imgSrc,//图片的地址
            aHref:this.ajaxData.aHref||'javascript:;',//商品详情的链接
            markInfo:this.ajaxData.markInfo||['undefined'],//标记信息
        };
    }
    //以下是渲染结构
    Shopping.prototype.renderParent=function(){//渲染父级容器
        var div=document.createElement('div');
        div.classList.add(`m-shopping`);
        this.parentDom=div;
        this.parentDom.innerHTML=`            
            <div class="m-shopping-wrap">
                <div class="m-shopping-content">
                    ${this.renderRadio()} 
                    ${this.renderImg()}        
                    ${this.renderInfo()}
                </div>
            </div>
            ${this.renderDelete()}            
        `;
        this.parentDomImg=this.parentDom.querySelector('.m-shopping-img a');
        this.parentDomInfo=this.parentDom.querySelector('.m-shopping-info');
    };
    Shopping.prototype.renderRadio=function(){//渲染多选框容器
        if(this.configData.isShowRadio){
            return `
                <div class="m-shopping-radio">
                    <input type="checkbox" class="g-input-circle">
                </div>
            `;
        }else{
            return ``;
        }
    };
    Shopping.prototype.renderRadioAdd=function(){
        var parent=this.parentDom.querySelector('.m-shopping-content');
        var before=this.parentDom.querySelector('.m-shopping-content .m-shopping-img');
        var obj=this.parentDom.querySelector('.m-shopping-content .m-shopping-radio');
        this.configData.isShowRadio=true;
        var div=document.createElement('div');
        div.innerHTML=this.renderRadio();
        var dom=div.children[0];
        if(!obj){
            parent.insertBefore(dom,before);
        }
    };
    Shopping.prototype.renderRadioRemove=function(){

        var parent=this.parentDom.querySelector('.m-shopping-content');
        var obj=this.parentDom.querySelector('.m-shopping-content .m-shopping-radio');
        if(obj){
            parent.removeChild(obj);
        }
    };
    Shopping.prototype.renderDelete=function(){//删除区域
        if(this.configData.isShowDelete){
            return `<div class="m-shopping-delete"><span class="icons icons-delete"></span></div>`;
        }else{
            return ``;
        }
    };
    Shopping.prototype.renderImg=function(){//渲染图片区域
        var imgHTML=``;
        if(this.configData.isShowImgSrc){
            imgHTML=`<img src="${this.ajaxData.imgSrc}" alt="">`;
        }else{
            imgHTML=`<img class="lazy-load" data-src="${this.ajaxData.imgSrc}" src="" alt="">`;
        }
        return `
            <div class="m-shopping-img">
                <a href="${this.ajaxData.aHref}">
                    ${imgHTML}
                </a>
            </div>
        `;
    };
    Shopping.prototype.renderInfo=function(){//信息容器
        return `
            <div class="m-shopping-info">            
                ${this.renderTxt()}
                ${this.renderOption()}
            </div>
        `;
    };
    Shopping.prototype.renderTxt=function(){//文字区域
        if(this.configData.isShowInfoTxt){
            return `
                <div class="m-shopping-info-txt">
                    ${this.renderGoodsName()}
                    ${this.renderGoodsStandard()}
                    ${this.renderGoodsPrice()}
                    ${this.renderGoodsBuyNum()}
                </div>
            `;
        }else{
            return ``;
        }
    };
    Shopping.prototype.renderGoodsName=function(){//渲染商品名称
        return `<div class="m-shopping-info-txt-name">${this.ajaxData.goodsName}</div>`;
    };
    Shopping.prototype.renderGoodsStandard=function(){//渲染商品规格
        return `<div class="m-shopping-info-txt-standard">
                    <span>规格:</span>
                    <span class="m-shopping-info-txt-standard-txt">${this.ajaxData.goodsStandard}</span>
                </div>
        `;
    };
    Shopping.prototype.renderGoodsPrice=function(){//渲染商品价格
        var p=this.ajaxData.nowPrice.split('.');
        var b=p[0];
        var s=p[1];
        return `
            <div class="m-shopping-info-txt-price">
                <span>￥</span>
                <span class="m-shopping-info-txt-price-big">${b}</span>
                <span>.</span>
                <span>${s}</span>
                ${this.renderMark()}
            </div>
        `;
    };
    Shopping.prototype.renderMark=function(){
        if(this.configData.isShowMark){
            var str=``;
            this.ajaxData.markInfo.forEach(function(v){
                str+=`<span class="m-shopping-info-mark">${v}</span>`;
            });
            return str;
        }else{
            return ``;
        }
    };
    Shopping.prototype.renderGoodsBuyNum=function(){//渲染商品数量
        if(this.configData.isShowNum){
            return `
                <div class="m-shopping-info-txt-num">
                    <span class="m-shopping-info-txt-num-des">×</span>
                    <span class="m-shopping-info-txt-num-txt">${this.ajaxData.goodsBuyNum}</span>
                </div>
            `;
        }else{
            return ``;
        }
    };
    Shopping.prototype.renderOption=function(){//操作区域
        if(this.configData.isShowInfoOption){
            return `
                <div class="m-shopping-info-option">
                    ${this.renderCompute()}
                    ${this.renderGoodsPrice()}
                </div>
            `;
        }else{
            return ``;
        }
    };
    Shopping.prototype.renderCompute=function(){//渲染加减商品的计算结构
        var classSubstract='';
        var classAdd='';
        if(this.ajaxData.goodsBuyNum<=1){
            classSubstract='m-shopping-inactive';
        }
        if(this.ajaxData.goodsBuyNum>=this.ajaxData.goodsStore){
            classAdd='m-shopping-inactive';
        }
        return `
            <div class="m-shopping-info-option-compute">
                    <div class="m-shopping-info-option-substract ${classSubstract}">-</div>
                    <div class="m-shopping-info-option-input"><input type="text" value="${this.ajaxData.goodsBuyNum}"></div>
                    <div class="m-shopping-info-option-add ${classAdd}">+</div>
            </div>
        `;
    };
    Shopping.prototype.render=function(fn){//渲染整个DOM
        this.renderParent();
        this.init();
        fn&&fn(this.parentDom);
    };
    //以下渲染功能
    Shopping.prototype.init=function(){
        this.base();
        this.power();
        this.touchDelete();
    };
    Shopping.prototype.base=function(){//用到的一些base里的方法
        this.addSubtract=addSubtract;
    };
    Shopping.prototype.power=function(){//加减计算功能
        var add=this.parentDom.querySelector('.m-shopping-info-option-add');
        var input=this.parentDom.querySelector('.m-shopping-info-option-input input');
        var substract=this.parentDom.querySelector('.m-shopping-info-option-substract');
        if(add){
            var self=this;
            self.addSubtract({
                add:add,
                addCallback:function(){
                    console.log('+');
                },
                substract:substract,
                substractCallback:function(){
                    console.log('-');
                },
                input:input,
                blurCallback:function(){
                    console.log('blur');
                },
                inventoryNum:this.ajaxData.goodsStore
            })
        }
    };
    Shopping.prototype.touchDelete=function(){//滑动删除功能
        if(this.configData.isShowTouchDelete){
            var wrap=this.parentDom.querySelector('.m-shopping-wrap');
            /*function TouchDelete(json){
                this.opt=json||{};
                this.opt.limitWidth=this.opt.limitWidth||'-92';
                this.init();
            }
            TouchDelete.prototype.init=function(){
                var self=this;
                self.opt.obj.addEventListener('touchstart',function(ev){
                    var changed=ev.changedTouches[0];
                    var startX=changed.pageX;
                    var startY=changed.pageY;
                    var endX=0;
                    var endY=0;
                    var nowX=0;
                    var nowY=0;
                    self.opt.obj.addEventListener('touchmove',function(ev){
                        var changed=ev.changedTouches[0];
                        nowX=changed.pageX-startX;
                        nowY=changed.pageY-startY;
                        self.opt.obj.style.transition='0s';
                        self.opt.obj.style.transform=`translateX(${nowX}px)`;
                    });
                    self.opt.obj.addEventListener('touchend',function(ev){
                        var changed=ev.changedTouches[0];
                        endX=changed.pageX;
                        endY=changed.pageY;
                        self.opt.obj.style.transition='0.4s';
                        self.opt.obj.style.transform=`translateX(${self.opt.limitWidth}px)`;
                        //console.log(startX-endX,startY-endY);
                    })
                })
            };
            new TouchDelete({obj:wrap});*/
        }
    };
    module.exports = Shopping;
});