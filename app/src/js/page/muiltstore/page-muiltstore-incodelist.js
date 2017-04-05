define(function (require, exports, module) {
    var $pageMuiltstoreIncodelist = $('.page-muiltstore-incodelist');
    var $content = $pageMuiltstoreIncodelist.find('.content');
    var $listWrap = $content.find('.list-wrap');
    var $gLoading = $pageMuiltstoreIncodelist.find('.g-loading');
    var $select = $pageMuiltstoreIncodelist.find('select[name=store_id]');
    var $inputWrap = $pageMuiltstoreIncodelist.find('.input-wrap');
    var params = {
        page:1,
        incode:'',
        store_id:''
    };

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

    function loadContent(){
        function renderList(arr){
            var htmls = [];
            if(!arr){return false;}
            $.each(arr, function(i, item){
                var finshTime = item.finsh_time || '';
                var incode = item.incode || '';
                htmls.push('<div class="list" data-incode="' + incode + '">');
                htmls.push('<p class="s1">' + finshTime.substring(2, finshTime.length-3) + '</p>');
                htmls.push('<p class="s2">' + incode + '</p>');
                htmls.push('<p class="s3">' + (item.store_name || '') + '</p>');
                htmls.push('</div>');
            });
            return htmls.join('');
        };

        var isLoad = false;
        function load(opts){
            opts = opts || {};
            if(isLoad){ return false;}
            isLoad = true;
            $gLoading.show();
            base.ajax({
                url: 'index.php?ctl=store&act=inCodeListAjax',
                type:'post',
                data: opts,
                dataType: 'json',
                success: function(result){
                    $gLoading.hide();
                    isLoad = false;
                    $listWrap.append(renderList(result));
                    params.page++;
                }
            });
        }

        load(params);

        $(window).scroll(function(){
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();

            if(scrollTop + windowHeight + 200 >= scrollHeight){
                load(params);
            }
        });
    };

    loadContent();

    $select.on('change', function(){
        $listWrap.find('.list').not('.list-head').remove();
        params.page = 1;
        params.store_id = $select.val();
        loadContent();
    });

    $inputWrap.on('click', '.i-search', function(){
        $listWrap.find('.list').not('.list-head').remove();
        var val = $inputWrap.find('input[name=incode]').val();
        params.page = 1;
        params.incode = val;
        loadContent();
    });

    $listWrap.on('click', '.list', function(){
        if($(this).hasClass('list-head')){ return false;}
        var incode = $(this).data('incode') || '';
        if(!incode){ return false;}
        window.location.href = 'index.php?ctl=store&act=incodeDetail&incode=' + incode;
    });

    module.exports = {
        init: function(){

        }
    }
});

