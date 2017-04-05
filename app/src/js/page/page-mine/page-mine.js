define(function (require, exports, module) {
    module.exports = {
        init: function () {
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