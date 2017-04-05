define(function (require, exports, module) {
    module.exports = {
        init: function () {
            //本地存储的数据
            var hash=JSON.parse(decodeURIComponent(location.hash.substring(1)));
            var moduleId=hash.moduleId;
            var sessionStorageData = {
                shoppingGid: [],//存储所有商品的gid
                scrollTop: 0,//存储滚动条位置
                pageNo: 1,//存储当前页码
                pageCount: 0,//存储总页码
                name: 'lookMore'+moduleId,//存储名字
            };
            if (window.sessionStorage[sessionStorageData.name]) {//本地数据已经存在,则为本地数据
                //本地存储这里会有问题,因为没有唯一标识符号
                sessionStorageData = JSON.parse(window.sessionStorage[sessionStorageData.name]);
            }
            //search
            var Search = require('js/modules/m-search.js');
            var search = new Search();
            search.render(function (dom) {
                document.querySelector('.search-main').appendChild(dom);
            });
            //product
            var LoadingBottom = require('js/modules/m-loading-bottom.js');
            var productDomDataConfig = require('js/modules/m-product-dom-data-config.js');
            var lazyload = require('js/common/plug/lazy_load_last.js');
            var whenScrollBottom = require('js/common/plug/when-scroll-bottom.js');
            var loadingBottom = new LoadingBottom();
            var main = document.querySelector('.product-main');
            var ajaxData = JSON.parse(decodeURIComponent(window.location.hash.substring(1)));
            ajaxData.pageNo = 1;
            var isAllData = false;//数据是否已经全部加载完毕
            function render(callback) {
                $.ajax({
                    url: 'index.php?ctl=module&act=getGoods',
                    data: ajaxData,
                    type: 'post',
                    dataType: 'json',
                    success: function (obj) {
                        var list = obj.data.list;
                        productDomDataConfig({
                            data: list, parent: main, callback: function (obj) {
                                var ajaxDataD = obj.ajaxData;
                                //存储加载过的商品数据
                                sessionStorageData.shoppingGid.push(ajaxDataD.gid);
                                window.sessionStorage[sessionStorageData.name] = JSON.stringify(sessionStorageData);
                            }
                        });
                        callback && callback({pageCount: obj.data.pageCount});
                    }
                });
            }

            if (sessionStorage[sessionStorageData.name]) {//本地已经存储了数据
                ajaxData.pageNo = sessionStorageData.pageNo;//更新页码
                var SG = sessionStorageData.shoppingGid;
                //console.log(SG.length,'发送');
                var sg = SG.join(',');
                $.ajax({
                    type: "post",
                    url: 'assist.php?act=getGoodsAttr',
                    dataType: 'json',
                    data: {g: sg},
                    success: function (obj) {
                        //console.log(base.jsonToArray(obj).length,'接收');
                        var arr = [];
                        SG.forEach(function (v) {
                            arr.push(obj[v]);
                        });
                        productDomDataConfig({data: arr, parent: main});
                        if (ajaxData.pageNo > sessionStorageData.pageCount) {//没有更多数据
                            loadingBottom.over();
                            isAllData = true;
                        }
                        window.scrollTo(0, sessionStorageData.scrollTop);
                        //console.log(base.jsonToArray(obj).length,'ajax返回的商品数量');
                        //console.log(document.querySelector('.product-main').children.length,'所有的节点数量');
                        //console.log(JSON.parse(sessionStorage.lookMore).shoppingGid.length,'本地存储的商品的数量');
                    }
                });
            }



            //浏览器滚动的时候
            $(window).on('scroll', function () {
                //存储滚动位置
                sessionStorageData.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                //console.log(sessionStorageData.scrollTop);
                window.sessionStorage[sessionStorageData.name] = JSON.stringify(sessionStorageData);
            });

            //当滚动到浏览器底部(滑动加载更多)
            whenScrollBottom({
                success: function () {
                    if (!isAllData) {
                        loadingBottom.show();
                        render(function (opt) {
                            loadingBottom.hide();
                            ajaxData.pageNo++;
                            lazyload();
                            sessionStorageData.pageNo=ajaxData.pageNo;//存储加载过的页码
                            sessionStorageData.pageCount=opt.pageCount;//存储总的页码
                            window.sessionStorage[sessionStorageData.name]=JSON.stringify(sessionStorageData);
                            if(ajaxData.pageNo>opt.pageCount){//没有更多数据
                                isAllData=true;
                                loadingBottom.over();
                                window.sessionStorage[sessionStorageData.name] = JSON.stringify(sessionStorageData);
                            }
                        });
                    }
                }
            });
        }
    }
});