/**
 * Created by zhangzhigang on 2016/9/9.
 */
define(function (require, exports, module) {
    /*
    * 组件列表
    * hdBanner              横幅广告
    * navImg                图片导航
    * sliderImg             轮播广告
    * Tag                   标签
    * ProductList           商品列表
    * Search                搜索
    * StoreHeader           店铺头部
    * Chuchuang             橱窗
    * CutFigure             海报切图
    *
    * 参数
    * useNum    1：可用1次      infinity：无使用次数限制
    *
    * */

    var ComponentConfig = {
        cutFigure:{
            sign: 'CutFigure',
            name: '海报切图',
            useNum: 'infinity',
            iconName: 'cut-figure'
        },
        hdBanner:{
            sign: 'HdBanner',
            name: '横幅广告',
            useNum: 'infinity',
            iconName: 'hd-banner'
        },
        navImg:{
            sign: 'NavImg',
            name: '快捷入口',
            useNum: 'infinity',
            iconName: 'nav-img'
        },
        sliderImg:{
            sign: 'SliderImg',
            name: '轮播广告',
            useNum: 'infinity',
            iconName: 'slider-img'
        },
        productList:{
            sign: 'ProductList',
            name: '商品列表',
            useNum: 'infinity',
            iconName: 'product-list'
        },
        chuchuang:{
            sign: 'ChuChuang',
            name: '橱窗',
            useNum: 'infinity',
            iconName: 'chu-chuang'
        },
        search:{
            sign: 'Search',
            name: '搜索',
            useNum: 1,
            iconName: 'search'
        },
        storeHeader:{
            sign: 'StoreHeader',
            name: '店铺头部',
            useNum: 1,
            iconName: 'store-header'
        }
    };
    module.exports = ComponentConfig;
});