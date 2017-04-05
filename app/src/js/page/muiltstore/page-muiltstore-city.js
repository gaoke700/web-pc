define(function (require, exports, module) {

    var $pageMuiltstoreCity = $('.page-muiltstore-city');
    var $historySearch = $pageMuiltstoreCity.find('.history-search');
    var historyAddrUrl = unescape((base.utils.getCookie('mAddrUrl') || '')).split(',');
    var historyAddrText = unescape((base.utils.getCookie('mAddrText') || '')).split(',');
    var hasAddr = false;
    $.each(historyAddrUrl, function(i, v){
        if(v == ''){
            historyAddrUrl.splice(i, 1);
            historyAddrText.splice(i, 1);
        };
    });

    //渲染历史记录
    if(historyAddrText.length > 0){
        var historyAddrHtml = '';
        $.each(historyAddrText, function(i, v){
            if(v == ''){ return false ;}
            historyAddrHtml += '<div class="btn js-jump-list" data-url="' + (historyAddrUrl[i] || '') + '">' + (historyAddrText[i] || '') + '</div>';
        });
        if(historyAddrHtml == ''){
            $pageMuiltstoreCity.find('.history-s').hide();
        } else {
            $historySearch.html(historyAddrHtml);
        }
    } else {
        $pageMuiltstoreCity.find('.history-s').hide();
    };

    $pageMuiltstoreCity.on('click', '.js-jump-list', function(){
        var url = $(this).data('url') || '';
        var text = $(this).html();
        if(!url){ return false};

        if(historyAddrText.length > 0){
            $.each(historyAddrText, function(i, v){
                if(v == ''){
                    historyAddrUrl.splice(i, 1);
                    historyAddrText.splice(i, 1);
                }
                if(v == text){
                    hasAddr = true;
                }
            });
        }

        if(!hasAddr){
            historyAddrUrl.push(url);
            historyAddrText.push(text);
        }
        base.utils.setCookie('mAddrUrl', escape(historyAddrUrl.join(',')));
        base.utils.setCookie('mAddrText', escape(historyAddrText.join(',')));

        window.location.href = url;
    });

    module.exports = {
        init: function(){

        }
    }
});

