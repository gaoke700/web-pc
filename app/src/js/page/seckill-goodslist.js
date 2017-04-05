//秒杀聚合页
define(function (require, exports, module) {
    module.exports = {
        init: function () {
            var main = $('.main-container')[0];
            var Product = require('js/modules/m-product.js');
            var NoData = require('js/modules/m-no-data.js');
            var NoMore = require('js/modules/m-loading-bottom.js');
            var noMore = new NoMore();
            var isScrollNavigatorBottom = require('js/common/plug/is-scroll-navigator-bottom.js');
            //存储那些已经被加载过得数据
            var productList = {
                //即将开始的
                active: [],
                activeStatus: false,//即将开始的是否加载完毕了
                //进行中的
                runing: [],
                runingStatus: false,//进行中的是否加载完毕了
            };
            //页码
            var pageNo = 1;//页码过度的变量
            var pageNoRunning = 1;//运行中的页码
            var pageNoActive = 1;//即将开始的页码
            var willBeginIsHaveShopping = false;//即将开始有没有商品
            //数量
            var pageSize = 6;
            //即将开始亦或进行中    running(进行中)    active(即将开始)
            var status = 'running';
            var isGoods = false; //用来判断，暂无秒杀商品 提示是否显示,默认不显示
            //获取商品
            var getGoods = function (json) {
                var opt = json || {};
                var status = opt.status;
                var pageNo = opt.pageNo;
                var pageSize = opt.pageSize;
                var callback = opt.callback;
                var configData = {};
                var ajaxData = {};
                $.ajax({
                    url: '?module-getSecGoods.html',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        pageSize: pageSize,
                        pageNo: pageNo,
                        act_status: status
                    },
                    success: function (data) {
                        //console.log(data,'==>ajax返回的数据');
                        if (data.res != 'succ') {
                            return false;
                        }
                        var list = data.data.list;
                        var fnNoData = function (noData) {
                            //渲染没有更多数据
                            if (isGoods == false) {
                                noData.render(function (dom) {
                                    if (willBeginIsHaveShopping) {
                                        dom.classList.add('will-begin-no-data');
                                    }
                                    main.appendChild(dom);
                                    isGoods = true;
                                });
                            } else {
                                if (main.innerHTML == '') {
                                    noData.render(function (dom) {
                                        if (willBeginIsHaveShopping) {
                                            dom.classList.add('will-begin-no-data');
                                        }
                                        main.appendChild(dom);
                                        isGoods = true;
                                    });
                                }
                            }
                        };
                        var fnNoDataWillBegin = function () {
                            //即将开始没有商品(暂无秒杀商品)
                            willBeginIsHaveShopping = false;
                            var noData = new NoData({
                                logoInfo: '暂无秒杀商品',
                                logoSrc: 'images/secKill/no-data.png'
                            });
                            fnNoData(noData);
                        };
                        //没有商品
                        if (list.length == 0 && pageNo == 1) {
                            //如果是进行中...根据即将开始的状态来判断应该显示什么提示
                            if (status == 'running') {
                                $.ajax({
                                    url: '?module-getSecGoods.html',
                                    type: 'post',
                                    dataType: 'json',
                                    data: {
                                        pageSize: pageSize,
                                        pageNo: pageNo,
                                        act_status: 'active'
                                    },
                                    success: function (data2) {
                                        if (data2.res != 'succ') {
                                            return false;
                                        }
                                        var list2 = data2.data.list;
                                        //即将开始有商品(更多好货即将开始)
                                        if (list2.length != 0) {
                                            willBeginIsHaveShopping = true;
                                            var noData = new NoData({
                                                logoInfo: '更多好货即将开始',
                                                logoSrc: 'images/secKill/no-data.png',
                                                btn:[{href:'javascript:;',info:'去看看'}]
                                            });
                                            fnNoData(noData);
                                        }
                                        //即将开始有商品(更多好货即将开始的点击事件)
                                        $('.will-begin-no-data').on('click', '.m-no-data-btn', function () {
                                            $('.main-header-btn').get(1).click();
                                        });
                                        //即将开始没有商品(进行中没有更多数据)
                                        if (list2.length == 0) {
                                            fnNoDataWillBegin();
                                        }
                                    }
                                });
                            }
                            //如果是即将开始...进行中没有更多数据
                            if (status == 'active') {
                                //即将开始没有商品(暂无秒杀商品)
                                if (list.length == 0) {
                                    fnNoDataWillBegin();
                                }
                            }
                            return false;
                        }
                        list.forEach(function (v) {
                            console.log(v);
                            //进行中
                            if (status == 'running') {
                                configData = {
                                    showType: 'm-product-list',
                                    isShowGoodsName: true,
                                    isShowPrice: true,
                                    isShowLikeNum: true,
                                    isShowSeckillWillEndTime: true,
                                    isShowSeckillNowGetBtn: true,
                                    isShowImgSrc: true,
                                };
                                ajaxData = {
                                    goodsName: v.name,
                                    gid: v.goods_id,
                                    imgSrc: v.thumbnail_pic,
                                    aHref: v.url,
                                    likeNum: v.statistics.pv,
                                    nowPrice: v.secKill.price,
                                    marketPrice: v.gprice,
                                    seckillWillEndTime: v.secKill.countDown,
                                    seckillActiveAllTime: v.secKill.end_time - v.secKill.begin_time,
                                };
                            }
                            //即将开始
                            if (status == 'active') {
                                configData = {
                                    showType: 'm-product-list',
                                    isShowGoodsName: true,
                                    isShowPrice: true,
                                    isShowLikeNum: true,
                                    isShowImgSrc: true,
                                    isShowSeckillWillBeginTime: true,
                                };
                                ajaxData = {
                                    goodsName: v.name,
                                    gid: v.goods_id,
                                    imgSrc: v.thumbnail_pic,
                                    aHref: v.url,
                                    likeNum: v.statistics.pv,
                                    nowPrice: v.secKill.price,
                                    seckillActId: v.secKill.act_id,
                                    marketPrice: v.gprice,
                                    seckillWillBeginTime: v.secKill.beginCountDown,
                                    seckillWillEndTime: v.secKill.countDown,
                                    seckillActiveAllTime: v.secKill.end_time - v.secKill.begin_time,
                                    seckillWillBeginBtnShowTime: v.secKill.remind_time * 60,
                                };
                                //已经设置提醒
                                if (v.secKill.need_remind == '1') {//商家开通了短信提醒
                                    if (v.secKill.is_remind == 1) {//已经点了提醒我
                                        configData.isShowSeckillHintBtnSetOk = true;
                                    } else {//没有点击提醒我

                                        configData.isShowSeckillHintBtn = true;
                                    }
                                } else {///商家没有开通短信提醒
                                    configData.isShowCart = true;
                                }
                            }
                            var product = new Product({
                                configData: configData,
                                ajaxData: ajaxData,
                            });
                            product.render(function (dom) {
                                main.appendChild(dom);
                                if (status == 'active') {
                                    productList.active.push(dom);
                                }
                                if (status == 'running') {
                                    productList.runing.push(dom);
                                }
                            });
                        });
                        callback && callback(data);
                        //console.log('一上来就没有更多数据',data,data.data.count,pageNo);
                        //用总页数,和当前页数对比,才可以得知当前是否已经加载完毕了全部数据
                        if (data.data.pageCount == pageNo) {
                            noMore.over();
                        }
                    }
                })
            };
            isScrollNavigatorBottom({
                success: function () {
                    if (status == 'running') {
                        pageNo = pageNoRunning;
                    }
                    if (status == 'active') {
                        pageNo = pageNoActive;
                    }
                    getGoods({
                        status: status, pageNo: pageNo, pageSize: pageSize, callback: function (data) {
                            if (status == 'running') {
                                pageNoRunning++;
                            }
                            if (status == 'active') {
                                pageNoActive++;
                            }
                            //下拉没有更多数据
                            //console.log('下拉没有更多数据',data,data.data.count,pageNo);
                            if (data.data.count == 0 || data.data.pageCount == pageNo) {
                                noMore.over();
                            }
                        }
                    });
                }
            });
            /*点击切换*/
            //BUG...定时器会走多次...解决方案:点击的时候不进行ajax请求...把最初的DOM数据存储起来...备用
            (function () {
                var aBtn = $('.main-header-btn');
                aBtn.on('click', function () {
                    main.innerHTML = '';
                    $('.m-loading-bottom').html('');
                    $(this).addClass('main-header-btn-on').siblings().removeClass('main-header-btn-on');
                    if ($(this).data('status') == 'running') {
                        status = 'running';
                        if (productList.runing.length != 0) {
                            productList.runing.forEach(function (v) {
                                main.appendChild(v)
                            });
                            return false;
                        }
                        getGoods({
                            status: status, pageNo: 1, pageSize: pageSize, callback: function () {
                                pageNoRunning++;
                            }
                        });
                    }
                    if ($(this).data('status') == 'active') {
                        status = 'active';
                        if (productList.active.length != 0) {
                            productList.active.forEach(function (v) {
                                main.appendChild(v)
                            });
                            return false;
                        }
                        getGoods({
                            status: status, pageNo: 1, pageSize: pageSize, callback: function () {
                                pageNoActive++;
                            }
                        });
                    }
                });
            })();

            var Auxiliary = require('js/common/auxiliary.js');
            base.statistics();     //统计
            Auxiliary.wxAbout();        //微信相关
        }
    }
});