define(function (require, exports, module) {
    module.exports = {
        init: function(){
            var $ = MJQ;

            var $pageMuiltstoreInscode = $('.page-muiltstore-inscode');
            var $pageMain = $pageMuiltstoreInscode.find('.page-main');
            var $pageMenu = $pageMain.find('.page-menu');
            var $pageContentWrap = $pageMain.find('.page-content-wrap');
            var $validationWrap = $pageContentWrap.find('.validation-wrap');
            var $recordWrap = $pageContentWrap.find('.record-wrap');
            var $inputWrap = $validationWrap.find('.input-wrap');

            // layDate({
            //     elem: '#v-start-time'
            // });
            // layDate({
            //     elem: '#v-end-time'
            // });
        }
    }
});

