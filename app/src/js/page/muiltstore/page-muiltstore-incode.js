define(function (require, exports, module) {
    var $pageMuiltstoreIncode = $('.page-muiltstore-incode');
    var $menu = $pageMuiltstoreIncode.find('.menu');
    var $bottomYjjl = $pageMuiltstoreIncode.find('.bottom-yjjl');
    var $main = $pageMuiltstoreIncode.find('.main');
    var $sdyj = $main.find('.sdyj');
    var $smyj = $main.find('.smyj');
    var $form = $main.find('.form');

    $('.js-btn-qrcode').on('click', function(){
        if(!base.utils.isWeixin()){
            alert('请在微信环境下使用扫码功能');
            return false;
        };
        wx.ready(function(){
            wx.scanQRCode({
                needResult: 1,
                desc: 'scanQRCode desc',
                success: function (res) {
                    if(!res || !res.resultStr || res.resultStr == ''){
                        alert('扫码出错');
                    } else {
                        window.location.href =  res.resultStr || '';
                    }
                }
            });
        });
    });

    //wx.ready(function () {
    //    $('.js-btn-qrcode').on('click', function(){
    //        if(!base.utils.isWeixin()){
    //            alert('请在微信环境下使用扫码功能');
    //            return false;
    //        };
    //        wx.scanQRCode({
    //            needResult: 1,
    //            desc: 'scanQRCode desc',
    //            success: function (res) {
    //                if(!res || !res.resultStr || res.resultStr == ''){
    //                    alert('扫码出错');
    //                } else {
    //                    window.location.href =  res.resultStr || '';
    //                }
    //            }
    //        });
    //    });
    //});

    function tab(name){
        $menu.find('.btn-menu').removeClass('active');
        $main.children().hide();
        $menu.find('[data-name="' + name + '"]').addClass('active');
        $main.find('.' + name).show();
    }
    tab(tabName);
    $menu.on('click', '.btn-menu', function(){
        $form.find('input[name=incode]').val('');
        $form.find('input[name=type]').val($(this).data('name'));
        $form.submit();
    });

    $sdyj.on('click', '.js-btn-search', function(){
        $form.find('input[name=incode]').val($(this).siblings('input').val());
        $form.submit();
    });

    module.exports = {
        init: function(){

        }
    }
});

