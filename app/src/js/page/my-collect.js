//我的收藏页面
define(function (require, exports, module) {
    module.exports = {
        init: function(){
            //页面级容器
            var page=$('.page-collect');
            //渲染切换部分
            (function(){
                var Fn=require('js/modules/m-record-tab.js');
                var main=document.querySelector('.main-record-tab');
                var fn=new Fn({
                    info:['购物车','收藏','购物记录'],
                    link:['?carts.html','?member-myFavorites.html','?member-shoppingRecord.html'],
                    index:1
                });
                fn.render(function(dom){
                    main.appendChild(dom);
                })
            })();
            //渲染收藏商品的结构----头部
            function renderHeader(json){
                var opt=json||{};
                var allNum=opt.allNum||'66';
                var dom=document.createElement('div');
                dom.classList.add('main-shopping-title');
                dom.innerHTML=`
                    <div class="main-shopping-title-txt">
                        <label><input class="g-input-circle" type="checkbox"></label>
                        <span>总共</span>
                        <span class="main-shopping-title-txt-num">${allNum}</span>
                        <span>件商品</span>
                    </div>
                    <div class="main-shopping-title-btn">编辑</div>
                `;
                return {dom:dom}
            }
            //渲染收藏商品的结构----底部
            function renderFooter(){
                var dom=document.createElement('div');
                dom.classList.add('main-shopping-footer');
                dom.innerHTML=`
                    <div class="main-shopping-footer-txt">
                        <span>已选择</span>
                        <span class="main-shopping-footer-txt-num">0</span>
                        <span>件商品</span>
                    </div>
                    <div class="main-shopping-footer-delete">删除</div>
                `;
                return {
                    dom:dom,
                    show:function(){
                        dom.classList.add('main-shopping-footer-show');
                    },
                    hide:function(){
                        dom.classList.remove('main-shopping-footer-show');
                    }
                }
            }
            //渲染收藏商品的结构----主体
            function RenderCollect(json){
                this.opt=json||{};
                this.storeName=this.opt.storeName||'店铺名称';
                this.storeLogo=this.opt.storeLogo;
                this.info=this.opt.info||[];//商品的配置信息configData和ajax信息ajaxData
                this.pushDataCallback=this.opt.pushDataCallback;
            }
            RenderCollect.prototype.renderParent=function(){
                this.parentDom=document.createElement('div');
                this.parentDom.classList.add('main-shopping-content');
                this.parentDom.innerHTML=`
                    <div class="main-shopping-shop">
                        <div class="main-shopping-shop-title">
                            <span class="main-shopping-shop-title-logo"><img src="${this.storeLogo}" alt=""></span>
                            <span class="main-shopping-shop-title-txt">${this.storeName}</span>
                        </div>
                        <div class="main-shopping-shop-content"></div>
                        <div class="main-shopping-shop-more"><span>查看更多</span><span class="icons icons-gengduo"></span></div>
                    </div>                                  
                `;
            };
            RenderCollect.prototype.pushData=function(){
                var self=this;
                self.info.forEach(function(v,i){
                    var main=self.parentDom.querySelector('.main-shopping-shop-content');
                    var Fn=require('js/modules/m-shopping.js');
                    var fn=new Fn({
                        configData:v.configData,
                        ajaxData:v.ajaxData
                    });
                    fn.render(function(dom){
                        dom.dataset.gid=v.ajaxData.gid;
                        main.appendChild(dom);
                    });
                    self.pushDataCallback&&self.pushDataCallback({
                        obj:fn,
                        index:i,
                        gid:v.ajaxData.gid
                    })
                });
            };
            RenderCollect.prototype.render=function(fn){
                this.renderParent();
                this.pushData();
                fn&&fn(this.parentDom);
            };
            function noData(){
                var NoData=require('js/modules/m-no-data.js');
                new NoData({
                    wrap:'.page-collect',
                    logoHref:'',
                    logoSrc:'images/no/cart.png',
                    logoInfo:'快去给我挑点宝贝吧~'
                });
            }
            //商品渲染开始
            (function(){
                var objShopping={};//用来获取内部模块的
                var footerObj=null;//底部DOM
                $.ajax({
                    url:'openapi.php?act=getFavorites',
                    type:'post',
                    data:{
                        site_id:siteId,
                        page:1,
                        pagesize:100
                    },
                    dataType:'json',
                    success:function(data){
                        if(data.res=='succ'){
                            var result=data.result;
                            var shopping=result.data;
                            if(!(shopping instanceof Array)){
                                shopping=base.jsonToArray(shopping);
                            }
                            if(!shopping.length){
                                noData();
                                return false;
                            }
                            //店铺商品的信息
                            var info=[];
                            shopping.forEach(function(v){
                                var obj={
                                    configData:{
                                        isShowTouchDelete:true,
                                        isShowNum:false,
                                    },
                                    ajaxData:{
                                        goodsName:v.name,
                                        gid:v.goods_id,
                                        goodsStandard:v.pdt_desc,
                                        goodsBuyNum:'1',
                                        goods:v.pdt_desc,
                                        nowPrice:v.price,
                                        imgSrc:v.pic_url,
                                        aHref:v.url
                                    }
                                };
                                info.push(obj);
                            });
                            //console.log(info);
                            //渲染
                            var main=document.querySelector('.main-shopping');
                            main.appendChild(renderHeader({allNum:result.count}).dom);
                            footerObj=renderFooter();
                            main.appendChild(footerObj.dom);
                            var renderCollect=new RenderCollect({
                                storeLogo:result.logo,
                                storeName:result.store_name,
                                info:info,
                                pushDataCallback:function(opt){
                                    var obj=opt.obj;
                                    var gid=opt.gid;
                                    objShopping[gid]=obj;
                                }
                            });
                            //console.log(objShopping);
                            renderCollect.render(function(dom){
                                main.appendChild(dom);
                            });
                            //延迟加载
                            require('js/common/plug/lazy_load_last.js')();
                        }
                        //console.log(data);
                    }
                });
                //已经选择几件商品
                function selectHowMuch(){
                    var numObj=document.querySelector('.main-shopping-footer-txt-num');
                    numObj.innerHTML=$('.main-shopping-shop-content .g-input-circle:checked').size();
                }
                //编辑
                page.on('click','.main-shopping-title-btn',function(){
                    var input=document.querySelector('.main-shopping-title-txt input');
                    if(this.innerHTML=='编辑'){
                        this.innerHTML='完成';
                        //选中了多少件商品
                        selectHowMuch();
                        //让选择框出现
                        input.classList.add('main-shopping-title-txt-input-show');
                        input.checked=false;
                        for(var attr in objShopping){
                            if(objShopping.hasOwnProperty(attr)){
                                objShopping[attr].renderRadioAdd();
                            }
                        }
                        selectFn();
                        //让底部出现
                        footerObj.show();
                    }else if(this.innerHTML=='完成'){
                        this.innerHTML='编辑';
                        //让选择框消失
                        input.classList.remove('main-shopping-title-txt-input-show');
                        input.checked=true;
                        for(var attrs in objShopping){
                            if(objShopping.hasOwnProperty(attrs)){
                                objShopping[attrs].renderRadioRemove();
                            }
                        }
                        //让底部消失
                        footerObj.hide();
                    }
                });
                //选择
                function selectFn(){
                    var Select=require('js/common/plug/select.js');
                    new Select({
                        selectAllButton:'.main-shopping-title-txt .g-input-circle',
                        radioButton:'.main-shopping-content .g-input-circle',
                        allSelectYesCallback:function(){selectHowMuch();},
                        allSelectNoCallback:function(){selectHowMuch();},
                        oneSelectCallback:function(){selectHowMuch();}
                    });
                }
                //删除
                page.on('click','.main-shopping-footer-delete',function(){
                    var gid=[];
                    $('.main-shopping-shop-content .g-input-circle:checked').each(function(i,e){
                        var g=$(e).parents('.m-shopping').data('gid');
                        gid.push(g);
                    });
                    //console.log(gid);
                    var diaglog=require('js/common/plug/dialog.js');
                    diaglog.dialogCustom1({
                        content:'确定删除该宝贝吗？',
                        okCallback:function(){
                            //console.log(gid,objShopping);
                            $.ajax({
                                url:'openapi.php?act=batchUnFavorite',
                                type:'post',
                                data:{goods_id:gid},
                                dataType:'json',
                                success:function(data){
                                    //console.log(data);
                                    if(data.res=='succ'){//删除成功
                                        gid.forEach(function(v){
                                            var dom=objShopping[v].parentDom;
                                            var parent=dom.parentNode;
                                            parent.removeChild(dom);
                                            delete objShopping[gid];
                                        });
                                        selectHowMuch();
                                        var size=$('.main-shopping-shop-content .g-input-circle').size();
                                        document.querySelector('.main-shopping-title-txt-num').innerHTML=size;
                                        //如果删除了全部数据(删除数据这里有问题,因为这是没有分页的情况,如果有分页怎么办)
                                        //删除的时候要先判断是不是已经是最后一页了,如果是再判断是不是删除了全部,如果删除了全部,再进行没有数据的渲染
                                        //下面是依据没有分页进行的数据渲染,如有有分页怎么搞
                                        if(size==0){
                                            page.find('.main-shopping').remove();
                                            noData();
                                        }
                                    }
                                    diaglog.dialogPrompt1({content:data.msg});
                                }
                            })
                        }
                    });
                });
                //点击查看更多功能待续....



            })();
        }
    };
});

