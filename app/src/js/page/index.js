/**
 * Created by zhangzhigang on 2016/9/12.
 */
define(function (require, exports, module) {
    //解析用户使用了哪些组件
    /*
     * 解析用户使用了哪些组件。
     * 1.页面获取组件value
     * 2.require('component/component-loader.js')，需传入json参数
     * 3.参数:{ signs:[组件数组], data:{ nav: [这一类型的数组] } }
     *       @ signs : 组件数组
     *       @ data : 组件数据，如无可不传
     * */

    module.exports = {
        init: function(){
            var componentLoader = require('js/component/component-loader.js');
            var pageIndexs = pageIndex || {};
            //console.log(pageIndexs);
            var signs=pageIndexs.moduleTpls[0]?pageIndexs.moduleTpls:[];

            var className={
                SliderImg:'c-component-sliderImg',
                NavImg:'c-component-NavImg',
                ProductList:'c-component-productList',
                ChuChuang:'c-component-chuchuang',
                Search:'c-component-search',
                StoreHeader:'c-component-storeHeader',
                HdBanner:'c-component-hdBanner',
                CutFigure:'c-component-CutFigure',
            };

            var dataAll={};
            if(!(signs instanceof Array)){
                signs=base.jsonToArray(signs);
            }
            signs.forEach(function(v){
                var modu=pageIndexs.modules;
                dataAll[v]=[];
                var num=0;
                for(var attr in modu){
                    var value=modu[attr];
                    if(value.sign==v){
                        value.config.parent=$('.' + className[v]).eq(num);
                        if(value.config.sign=="ProductList"){
                            var goodsChoose=value.config.goodsChoose;
                            for(var attrs in goodsChoose){
                                var values = goodsChoose[attrs];
                                if(!(values.data instanceof Array)){
                                    values.data = base.jsonToArray(values.data);
                                }
                                values.data.unshift({});
                            }
                        }
                        dataAll[v].push({data:value.config});
                        num++;
                    }
                }
            });

            componentLoader({
                signs:signs,
                data:dataAll
                /*data:{
                    NavImg:[
                        {data:'nav111'},//第一个NavImg的信息
                        {data:'nav222'},
                        {data:'nav333'}
                    ],
                    SliderImg:[
                        {data:'slider111'},//第一个SliderImg的信息
                        {data:'slider222'}
                    ],
                    StoreHeader:[{data:pageIndexs.dataPage&&pageIndexs.dataPage.StoreHeader||{}}]
                }*/
            });
            //全局数据
            $('.tran').each(function(){
                var arr=$(this).data('key').split('.');
                var str=pageIndex.dataPage;
                arr.forEach(function(v,i){
                    if(i!=0){
                        str=str[arr[i]];
                    }
                });
                //console.log(str);
                if(arr[0]=='html'){
                    $(this).html(str);
                }
                if(arr[0]=='display'){
                    if(str==0){
                        $(this).css('display','none');
                    }
                }
            });
            //记录滚动的位置
            window.addEventListener('scroll', function () {
                sessionStorage.indexScrolTop = document.documentElement.scrollTop || document.body.scrollTop;
            });
            //滚动到指定的位置
            if (sessionStorage.indexScrolTop) {
                //console.log(sessionStorage.indexScrolTop,document.documentElement.clientHeight,document.body.offsetHeight);
                if (parseInt(sessionStorage.indexScrolTop) + parseInt(document.documentElement.clientHeight) <= parseInt(document.body.offsetHeight)) {
                    setTimeout(function () {
                        //console.log(sessionStorage.indexScrolTop,111111);
                        window.scrollTo(0, sessionStorage.indexScrolTop);
                    },0);
                }
            }
            //返回顶部
            require('js/modules/m-return-top.js')();
            //延迟加载
            require('js/common/plug/lazy_load_last.js')({height:500});
            //公用的一些东西
            var Auxiliary = require('js/common/auxiliary.js');
            Auxiliary.customService();//客服
            Auxiliary.openStore();//开店
            Auxiliary.wxAbout();//微信相关
            Auxiliary.performance();
            base.statistics();//统计
        }
    }
});