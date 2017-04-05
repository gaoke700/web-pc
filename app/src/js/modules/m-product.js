define(function (require, exports, module){
    var dialog=require('js/common/plug/dialog.js');
    function ProductList(opt){
        this.opt=opt||{};
        this.configData=this.opt.configData||{};//配置信息
        this.ajaxData=this.opt.ajaxData||{};//商品信息
        this.configData={
            showType:this.configData.showType||'m-product-window',//默认的展现形式(默认为列表式:'m-product-list',橱窗式:'m-product-window',海报式:'m-product-placard')
            isShowImgSrc:this.configData.isShowImgSrc==true?this.configData.isShowImgSrc:false,//是否直接显示图片(默认不直接显示)
            isShowLong:this.configData.isShowLong==true?this.configData.isShowLong:false,//是否显示为长方形(默认不显示)
            isShowCart:this.configData.isShowCart==true?this.configData.isShowCart:false,//是否显示购物车(默认不显示)
            isShowGoodsName:this.configData.isShowGoodsName==true?this.configData.isShowGoodsName:false,//是否显示商品名称(默认不显示)
            isShowPrice:this.configData.isShowPrice==true?this.configData.isShowPrice:false,//是否显示商品价格(默认不显示)
            isVipCustom:this.configData.isVipCustom==true?this.configData.isVipCustom:false,//是否是VIP客户(默认不显示)
            isShowLikeNum:this.configData.isShowLikeNum==true?this.configData.isShowLikeNum:false,//是否显示多少人想买(默认不显示)
            isShowSeckillMark:this.configData.isShowSeckillMark==true?this.configData.isShowSeckillMark:false,//是否显示秒杀标识(默认不显示)
            isShowSeckillLogo:this.configData.isShowSeckillLogo==true?this.configData.isShowSeckillLogo:false,//是否显示秒杀logo(默认不显示)
            isShowSeckillWillBeginBtn:this.configData.isShowSeckillWillBeginBtn==true?this.configData.isShowSeckillWillBeginBtn:false,//是否显示秒杀即将开始按钮(默认不显示)
            isShowSeckillWillBeginTime:this.configData.isShowSeckillWillBeginTime==true?this.configData.isShowSeckillWillBeginTime:false,//是否显示秒杀即将开始的时间(默认不显示)
            isShowSeckillHintBtn:this.configData.isShowSeckillHintBtn==true?this.configData.isShowSeckillHintBtn:false,//是否显示秒杀提醒按钮(默认不显示)
            isShowSeckillHintBtnSetOk:this.configData.isShowSeckillHintBtnSetOk==true?this.configData.isShowSeckillHintBtnSetOk:false,//是否显示已设置秒杀提醒按钮(默认不显示)
            isShowSeckillNowGetBtn:this.configData.isShowSeckillNowGetBtn==true?this.configData.isShowSeckillNowGetBtn:false,//是否显示秒杀马上抢按钮(默认不显示)
            isShowSeckillWillEndTime:this.configData.isShowSeckillWillEndTime==true?this.configData.isShowSeckillWillEndTime:false,//是否显示秒杀即将结束的倒计时(默认不显示)
        };
        this.ajaxData={
            goodsName:this.ajaxData.goodsName||'商品名称',//商品名称
            gid:this.ajaxData.gid,//商品的id
            marketPrice:this.ajaxData.marketPrice||'undefined.undefined',//市场价格
            nowPrice:this.ajaxData.nowPrice||'undefined.undefined',//现在的价格
            vipPrice:this.ajaxData.vipPrice||'undefined.undefined',//会员价格
            seckillPrice:this.ajaxData.seckillPrice||'undefined.undefined',//秒杀价格
            likeNum:this.ajaxData.likeNum,//多少人喜欢
            imgSrc:this.ajaxData.imgSrc||'',//图片的地址
            aHref:this.ajaxData.aHref||'javascript:;',//商品详情的链接
            seckillActId:this.ajaxData.seckillActId,//秒杀商品的活动id
            seckillWillBeginTime:this.ajaxData.seckillWillBeginTime,//秒杀即将开始的倒计时(秒数)
            seckillWillBeginBtnShowTime:this.ajaxData.seckillWillBeginBtnShowTime||'600',//秒杀即将开始按钮出现的时间(剩余最后60秒的时候出现,这个参数没什么卵用,因为不做倒计时就是后台在控制,除非即将开始也是倒计时,才会用的到)
            seckillWillEndTime:this.ajaxData.seckillWillEndTime||'6',//秒杀即将结束的时间(秒数)
            seckillActiveAllTime:this.ajaxData.seckillActiveAllTime||'6',//秒杀活动的总时间(秒数)
        };
    }
    //以下是渲染结构
    ProductList.prototype.renderParent=function(){//渲染父级容器
        var div=document.createElement('div');
        div.classList.add(`m-product`);
        div.classList.add(`${this.configData.showType}`);
        this.parentDom=div;
        this.parentDom.innerHTML=`            
            ${this.renderImg()}        
            ${this.renderTxt()}
        `;
        this.parentDomImg=this.parentDom.querySelector('.m-product-img a');
        this.parentDomTxt=this.parentDom.querySelector('.m-product-txt');
    };
    ProductList.prototype.renderImg=function(){//渲染图片区域
        var imgHTML=``;
        if(this.configData.isShowImgSrc){
            imgHTML=`<img src="${this.ajaxData.imgSrc}" alt="">`;
        }else{
            imgHTML=`<img class="lazy-load" data-src="${this.ajaxData.imgSrc}" src="" alt="">`;
        }
        return `
            <div class="m-product-img">
                <a href="${this.ajaxData.aHref}">
                    ${imgHTML}
                    ${this.renderSeckillLogo()}
                </a>
            </div>
        `;
    };
    ProductList.prototype.renderTxt=function(){//渲染文字区域
        return `
            <div class="m-product-txt">
                ${this.renderGoodsName()}
                ${this.renderPrice()}
                ${this.renderLikeNum()}
                ${this.renderCart()}
                
                ${this.renderSeckillWillBeginBtn()}
                ${this.renderSeckillWillBeginTime()}
                ${this.renderSeckillHintBtn()}
                ${this.renderSeckillNowGetBtn()}
                ${this.renderSeckillWillEndTime()}
                ${this.renderSeckillHintBtnSetOk()}
            </div>
        `;
    };
    ProductList.prototype.renderGoodsName=function(){//渲染商品名称
        if(this.configData.isShowGoodsName){
            return `<div class="m-product-goods-name">${this.ajaxData.goodsName}</div>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderGoodsNameAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowGoodsName',
            renderName:'renderGoodsName',
            className:'.m-product-goods-name'
        });
    };
    ProductList.prototype.renderGoodsNameRemove=function(){
        this.domRemove({
            className:'.m-product-goods-name'
        });
    };
    ProductList.prototype.renderPrice=function(){//渲染商品价格
        if(this.configData.isShowPrice){
            var isVip=this.configData.isVipCustom;
            var ajaxData=this.ajaxData;
            var nowPrice=ajaxData.nowPrice;
            if(isVip){
                nowPrice=ajaxData.vipPrice;
            }
            var nowPrice0=nowPrice.split('.')[0];
            var nowPrice1=nowPrice.split('.')[1];
            var marketPrice=ajaxData.marketPrice;
            var VipHtml=``;
            if(isVip){
                VipHtml=`<span class="m-product-price-vip-money">会员价</span>`;
            }
            return `
                <div class="m-product-price">
                    ${VipHtml}
                    <span class="m-product-price-now-money-symbol">￥</span>
                    <span class="m-product-price-now-money-big">${nowPrice0}</span>
                    <span class="m-product-price-now-money-point">.</span>
                    <span class="m-product-price-now-money-small">${nowPrice1}</span>
                    ${this.renderSeckillMark()}
                    <span class="m-product-price-market-money-symbol">￥</span>
                    <span class="m-product-price-market-money-small">${marketPrice}</span>
                </div>
            `;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderPriceAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowPrice',
            renderName:'renderPrice',
            className:'.m-product-price'
        });
    };
    ProductList.prototype.renderPriceRemove=function(){
        this.domRemove({
            className:'.m-product-price'
        });
    };
    ProductList.prototype.renderLikeNum=function(){//渲染多少人喜欢
        if(this.configData.isShowLikeNum){
            return `
                <div class="m-product-price-like-num">
                    <span class="m-product-price-like-num-people">${this.ajaxData.likeNum}</span>
                    <span>人想买</span>
                </div>
            `;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderLikeNumAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowLikeNum',
            renderName:'renderLikeNum',
            className:'.m-product-price-like-num'
        });
    };
    ProductList.prototype.renderLikeNumRemove=function(){
        this.domRemove({
            className:'.m-product-price-like-num'
        });
    };
    ProductList.prototype.renderCart=function(){//渲染购物车
        if(this.configData.isShowCart){
            return `<div class="m-product-cart"><span class="icons icons-cart"></span></div>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderCartAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowCart',
            renderName:'renderCart',
            className:'.m-product-cart'
        });
    };
    ProductList.prototype.renderCartRemove=function(){
        this.domRemove({
            className:'.m-product-cart'
        });
    };
    ProductList.prototype.renderSeckillLogo=function(){//渲染秒杀Logo
        return ``;//因为设计图改版了,这里的功能就不是必须的了,所以就先跳过这里吧
        /*if(this.configData.isShowSeckillLogo){
            var price=this.ajaxData.seckillPrice.split('.');
            var price0=price[0];
            var price1=price[1];
            return `
                <div class="m-product-seckill-logo">
                    <div class="m-product-seckill-img"></div>
                    <div class="m-product-seckill-price">
                        <span class="m-product-seckill-price-money-symbol">￥</span>
                        <span class="m-product-seckill-price-money-big">${price0}</span>
                        <span class="m-product-seckill-price-money-point">.</span>
                        <span class="m-product-seckill-price-money-small">${price1}</span>
                    </div>
                </div>
            `;
        }else{
            return ``;
        }*/
    };
    ProductList.prototype.renderSeckillLogoAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillLogo',
            renderName:'renderSeckillLogo',
            className:'.m-product-seckill-logo',
            parent:this.parentDomImg
        });
    };
    ProductList.prototype.renderSeckillLogoRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-logo',
            parent:this.parentDomImg
        });
    };
    ProductList.prototype.renderSeckillMark=function(){//渲染秒杀标识
        if(this.configData.isShowSeckillMark){
            //this.parentDom.classList.add('m-product-seckill');
            return `<span class="m-product-seckill-mark">秒杀</span>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillMarkAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillMark',
            renderName:'renderSeckillMark',
            className:'.m-product-seckill-mark'
        });
    };
    ProductList.prototype.renderSeckillMarkRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-mark'
        });
        this.parentDom.classList.remove('m-product-seckill');
    };
    ProductList.prototype.renderSeckillWillBeginBtn=function(){//渲染秒杀即将开始的按钮
        if(this.configData.isShowSeckillWillBeginBtn){
            return `<div class="m-product-seckill-will-begin-btn">即将开始</div>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillWillBeginBtnAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillWillBeginBtn',
            renderName:'renderSeckillWillBeginBtn',
            className:'.m-product-seckill-will-begin-btn'
        });
    };
    ProductList.prototype.renderSeckillWillBeginBtnRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-will-begin-btn'
        });
    };
    ProductList.prototype.renderSeckillWillBeginTime=function(){//渲染秒杀即将开始的时间
        if(this.configData.isShowSeckillWillBeginTime){
            var seconds=this.ajaxData.seckillWillBeginTime;
            var o=this.secondsToTime({seconds:seconds});
            var d=o.d;
            var h=o.h;
            var m=o.m;
            var s=o.s;
            return `
                <div class="m-product-seckill-will-begin-time">
                    <span class="m-product-seckill-will-begin-time-des">距开始&nbsp;</span>
                    <span class="m-product-seckill-will-begin-time-num">${d}</span>
                    <span class="m-product-seckill-will-begin-time-txt">天</span>
                    <span class="m-product-seckill-will-begin-time-num">${h}</span>
                    <span class="m-product-seckill-will-begin-time-txt">时</span>
                    <span class="m-product-seckill-will-begin-time-num">${m}</span>
                    <span class="m-product-seckill-will-begin-time-txt">分</span>
                    <span class="m-product-seckill-will-begin-time-num">${s}</span>
                    <span class="m-product-seckill-will-begin-time-txt">秒</span>
                </div>
            `;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillWillBeginTimeAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillWillBeginTime',
            renderName:'renderSeckillWillBeginTime',
            className:'.m-product-seckill-will-begin-time'
        });
    };
    ProductList.prototype.renderSeckillWillBeginTimeRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-will-begin-time'
        });
    };
    ProductList.prototype.renderSeckillHintBtn=function(){//渲染秒杀提醒按钮
        if(this.configData.isShowSeckillHintBtn){
            return `<div class="m-product-seckill-hint-btn">提醒我</div>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillHintBtnAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillHintBtn',
            renderName:'renderSeckillHintBtn',
            className:'.m-product-seckill-hint-btn'
        });
    };
    ProductList.prototype.renderSeckillHintBtnRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-hint-btn'
        });
    };
    ProductList.prototype.renderSeckillHintBtnSetOk=function(){//渲染已设置秒杀提醒按钮
        if(this.configData.isShowSeckillHintBtnSetOk){
            return `<div class="m-product-seckill-hint-btn-set-ok">已设置</div>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillHintBtnSetOkAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillHintBtnSetOk',
            renderName:'renderSeckillHintBtnSetOk',
            className:'.m-product-seckill-hint-btn-set-ok'
        });
    };
    ProductList.prototype.renderSeckillHintBtnSetOkRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-hint-btn-set-ok'
        });
    };
    ProductList.prototype.renderSeckillNowGetBtn=function(){//渲染秒杀马上抢按钮
        if(this.configData.isShowSeckillNowGetBtn){
            return `<div class="m-product-seckill-now-get-btn"><a href="${this.ajaxData.aHref}">马上抢</a></div>`;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillNowGetBtnAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillNowGetBtn',
            renderName:'renderSeckillNowGetBtn',
            className:'.m-product-seckill-now-get-btn'
        });
    };
    ProductList.prototype.renderSeckillNowGetBtnRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-now-get-btn'
        });
    };
    ProductList.prototype.renderSeckillWillEndTime=function(){//渲染秒杀结束倒计时
        if(this.configData.isShowSeckillWillEndTime){
            var seconds=this.ajaxData.seckillWillEndTime;
            var o=this.secondsToTime({seconds:seconds});
            var d=o.d;
            var h=o.h;
            var m=o.m;
            var s=o.s;
            return `
                <div class="m-product-seckill-will-end-time">
                    <div class="m-product-seckill-will-end-time-progress">
                        <div class="m-product-seckill-will-end-time-progress-num"></div>
                    </div>
                    <div class="m-product-seckill-will-end-time-info">
                        <span class="m-product-seckill-will-end-time-des">距结束&nbsp;</span>
                        <span class="m-product-seckill-will-end-time-num">${d}</span>
                        <span class="m-product-seckill-will-end-time-txt">天</span>
                        <span class="m-product-seckill-will-end-time-num">${h}</span>
                        <span class="m-product-seckill-will-end-time-txt">时</span>
                        <span class="m-product-seckill-will-end-time-num">${m}</span>
                        <span class="m-product-seckill-will-end-time-txt">分</span>
                        <span class="m-product-seckill-will-end-time-num">${s}</span>
                        <span class="m-product-seckill-will-end-time-txt">秒</span>
                    </div>
                </div>
            `;
        }else{
            return ``;
        }
    };
    ProductList.prototype.renderSeckillWillEndTimeAdd=function(opts){
        var opt=opts||{};
        this.domAdd({
            isRepeat:opt.isRepeat,
            isShowName:'isShowSeckillWillEndTime',
            renderName:'renderSeckillWillEndTime',
            className:'.m-product-seckill-will-end-time'
        });
    };
    ProductList.prototype.renderSeckillWillEndTimeRemove=function(){
        this.domRemove({
            className:'.m-product-seckill-will-end-time'
        });
    };
    ProductList.prototype.domAdd=function(opt){//添加结构
        if(!opt){
            console.log('no find param');
            return false;
        }
        var isRepeat=opt.isRepeat==true?opt.isRepeat:false;
        var parent=opt.parent||this.parentDomTxt;
        var className=opt.className;
        this.configData[opt.isShowName]=true;
        var div=document.createElement('div');
        div.innerHTML=this[opt.renderName]();
        var dom=div.children[0];
        if(isRepeat){
            parent.appendChild(dom);
        }else{
            if(!parent.querySelector(className)){
                parent.appendChild(dom);
            }
        }
    };
    ProductList.prototype.domRemove=function(opt){//移除结构
        if(!opt){
            console.log('no find param');
            return false;
        }
        var parent=opt.parent||this.parentDomTxt;
        var dom=parent.querySelector(opt.className);
        if(dom){
            parent.removeChild(dom);
        }
    };
    ProductList.prototype.render=function(callback){//渲染整个结构
        this.requireFn();
        this.renderParent();
        this.init();
        callback&&callback(this.parentDom);
    };
    //以下是渲染功能
    ProductList.prototype.init=function(){//初始化
        this.events();
        this.seckillWillBeginTime();
        this.seckillWillEndTime();
    };
    ProductList.prototype.requireFn=function(){//小功能函数
        this.timeCountDown=base.timeCountDown;//倒计时
        this.secondsToTime=base.secondsToTime;//秒转时间
    };
    ProductList.prototype.events=function(){//事件集合
        this.cartClick();
        this.seckillHintClick();
    };
    ProductList.prototype.cartClick=function(){//购物车的点击
        var self=this;
        $(self.parentDom).on('click','.m-product-cart',function(){
            if(base.utils.isPc()){
                dialog.dialogPrompt1({content:'预览模式暂不支持购买，请在手机中扫码操作'});
                return false;
            }
            self.cartFn();
        })
    };
    ProductList.prototype.cartFn=function(){//购物车的功能
        var self=this;
        var Cart=require('js/component/attached/Cart.js');
        var gid=self.ajaxData.gid;
        if(!gid){

            dialog.dialogPrompt1({content:'没有此商品'});

            return false;
        }
        new Cart({gid:gid});
    };
    ProductList.prototype.seckillHintClick=function(){//秒杀提醒我的点击
        var self=this;
        $(self.parentDom).on('click','.m-product-seckill-hint-btn',function(){
            if(base.utils.isPc()){
                dialog.dialogPrompt1({content:'预览模式暂不支持购买，请在手机中扫码操作'});
                return false;
            }
            self.seckillHintFn();
        })
    };
    ProductList.prototype.seckillHintFn=function(){//秒杀提醒我的功能
        var self=this;
        $.ajax({
            type:"post",
            url:"index.php?seckill-doRemind.html",
            async:true,
            data:{act_id:self.ajaxData.seckillActId},
            dataType:'json',
            success:function(data){
                if(data.res=='succ'){

                    dialog.dialogPrompt1({content:data.msg});

                    self.renderSeckillHintBtnRemove();
                    self.renderSeckillHintBtnSetOkAdd();
                }else{
                    if(data.data){

                        dialog.dialogCustom1({
                            content:data.msg,
                            okCallback:function(){
                                window.location.href="index.php?member-verifyMobile.html";
                            }
                        });


                    }else{

                        dialog.dialogPrompt1({time:3000,content:data.msg});
                    }
                }
            }
        });
    };
    ProductList.prototype.seckillWillEndTime=function(){//秒杀即将结束的倒计时功能
        if(this.configData.isShowSeckillWillEndTime){
            var self=this;
            var aSpan=[].slice.call(self.parentDom.querySelectorAll('.m-product-seckill-will-end-time-num'));
            var seconds=self.ajaxData.seckillWillEndTime;
            var allTime=this.ajaxData.seckillActiveAllTime;
            var oProgress=this.parentDom.querySelector('.m-product-seckill-will-end-time-progress-num');
            self.timeCountDown({
                seconds:seconds,
                runCallback:function(obj){
                    aSpan[0].innerHTML=obj.d;
                    aSpan[1].innerHTML=obj.h;
                    aSpan[2].innerHTML=obj.m;
                    aSpan[3].innerHTML=obj.s;
                    oProgress.style.width=(allTime-obj.a)/allTime*100+'%';
                    //console.log('秒杀活动的总时间:',allTime,'当前剩余倒计时:',obj.a,'比例:',(allTime-obj.a)/allTime*100);//后台给的倒计时错误,导致这里出BUG,无奈啊~
                },
                overCallback:function(){
                    self.renderSeckillMarkRemove();
                    self.renderSeckillWillEndTimeRemove();
                    self.renderSeckillLogoRemove();
                    self.renderSeckillNowGetBtnRemove();
                    self.renderCartAdd();
                }
            })
        }
    };
    ProductList.prototype.seckillWillBeginTime=function(){//秒杀即将开始的倒计时功能
        if(this.configData.isShowSeckillWillBeginTime){
            var self=this;
            var aSpan=[].slice.call(self.parentDom.querySelectorAll('.m-product-seckill-will-begin-time-num'));
            var ajaxData=self.ajaxData;
            var seconds=ajaxData.seckillWillBeginTime;
            var hintTime=ajaxData.seckillWillBeginBtnShowTime;
            self.configData.isShowSeckillWillBeginBtn=true;
            self.timeCountDown({
                seconds:seconds,
                runCallback:function(obj){
                    aSpan[0].innerHTML=obj.d;
                    aSpan[1].innerHTML=obj.h;
                    aSpan[2].innerHTML=obj.m;
                    aSpan[3].innerHTML=obj.s;

                    //console.log(hintTime,obj.a,hintTime>=obj.a);

                    if(hintTime>=obj.a){
                        self.renderCartRemove();//移除购物车按钮
                        self.renderSeckillHintBtnSetOkRemove();//移除已设置按钮
                        self.renderSeckillHintBtnRemove();//移除提醒我按钮
                        self.renderSeckillWillBeginBtnAdd();//添加即将开始按钮
                    }
                },
                overCallback:function(){
                    self.renderSeckillWillBeginTimeRemove();
                    self.renderSeckillWillBeginBtnRemove();
                    self.renderSeckillNowGetBtnAdd();
                    self.renderSeckillWillEndTimeAdd();
                    self.seckillWillEndTime();
                }
            })
        }
    };
    module.exports = ProductList;
});