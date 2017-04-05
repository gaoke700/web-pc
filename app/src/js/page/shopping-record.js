//我的记录之购物记录
define(function (require, exports, module) {
    module.exports = {
        init: function(){
            //渲染切换部分
            (function(){
                var Fn=require('js/modules/m-record-tab.js');
                var main=document.querySelector('.main-record-tab');
                var fn=new Fn({
                    info:['购物车','收藏','购物记录'],
                    link:['?carts.html','?member-myFavorites.html','?member-shoppingRecord.html'],
                    index:2
                });
                fn.render(function(dom){
                    main.appendChild(dom);
                })
            })();
            //渲染结构部分
            (function(){
                var isLazyload=false;//是否进行过延迟加载的调用
                var page=1;
                var pageSize=5;
                var isAjax=true;
                var allPage=null;
                var scrollLoad=require('js/common/plug/is-scroll-navigator-bottom.js');
                var Loading=require('js/modules/m-loading-bottom.js');
                var loading=new Loading();
                scrollLoad({
                    success:function(){
                        if(isAjax){
                            isAjax=false;
                            loading.show();
                            pullData(function(data){
                                //console.log(data,333333);
                                allPage=Math.ceil(data.result.count/pageSize);
                                //console.log(page,allPage);
                                page++;
                                isAjax=true;
                                loading.hide();
                                if(page>allPage){
                                    isAjax=false;
                                    loading.over();
                                }
                            });
                        }
                    }
                });
                function noData(){
                    var NoData=require('js/modules/m-no-data.js');
                    new NoData({
                        wrap:'.page-record',
                        logoHref:'',
                        logoSrc:'images/no/record.png',
                        logoInfo:'快去给我添加记录吧~'
                    });
                    loading.hide();
                }
                function pullData(callback){
                    $.ajax({
                        url:'openapi.php?act=shoppingRecord',
                        type:'post',
                        data:{
                            page:page,
                            pagesize:pageSize
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
                                shopping.forEach(function(v){
                                    //console.log(v);
                                    //商品信息
                                    var goodsInfo=v.goods_info;
                                    var info=[];
                                    goodsInfo.forEach(function(v2){
                                        info.push({
                                            ajaxData:{
                                                goodsName:v2.name,
                                                goodsBuyNum:v2.nums,
                                                gid:v2.goods_id,
                                                goodsStandard:v2.addon,
                                                nowPrice:v2.price,
                                                imgSrc:v2.thumbnail_pic,
                                            }
                                        })
                                    });
                                    //渲染结构
                                    var Fn=require('js/modules/m-record-shopping.js');
                                    var main=document.querySelector('.main-record-shopping');
                                    //'0'待付款,'1'待发货,'2'待收货,'3'待评价,'4'已完成
                                    //console.log(v.order_status);
                                    var fn=new Fn({
                                        orderId:v.order_id,
                                        storeLogo:v.logo,
                                        statusInfo:v.order_status,
                                        money:v.final_amount,
                                        storeName:v.store_name,
                                        info:info,
                                        deleteCallback:function(){
                                            //这里没有测试
                                            //删除的时候要先判断是不是已经是最后一页了,如果是再判断是不是删除了全部,如果删除了全部,再进行没有数据的渲染
                                            //console.log(page,allPage);
                                            //已经是最后一页
                                            if(page>=allPage){
                                                if($('.m-record-shopping').size()==0){
                                                    $('.main-record-shopping').remove();
                                                    noData();
                                                }
                                            }
                                        }
                                    });
                                    fn.render(function(dom){
                                        main.appendChild(dom);
                                        fn.parentDom.querySelector('.m-record-shopping-content').addEventListener('click',function(){
                                            window.location.href=`?member-${v.order_id}-orderdetail.html`;
                                        });
                                    });
                                });
                                //延迟加载
                                if(!isLazyload){
                                    isLazyload=true;
                                    require('js/common/plug/lazy_load_last.js')();
                                }
                                callback&&callback(data);
                            }
                        }
                    });
                }
            })();
        }
    }
});