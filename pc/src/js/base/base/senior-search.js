window.MJQ = window.MJQ || window.$;
(function(window, $){
    $('.js-senior-search').on('click', '.js-senior-search-show', function(e){
        //js-senior-search-show
        //js-senior-search-all
        var $parent = $(this).parents('.js-senior-search');
        var $all = $parent.find('.js-senior-search-all');
        var $i = $(this).find('i');
        if($i.hasClass('iconss-jiantouxia')){
            $all.show();
            $i.removeClass('iconss-jiantouxia');
            $i.addClass('iconss-jiantoushang');
        } else {
            $all.hide();
            $i.addClass('iconss-jiantouxia');
            $i.removeClass('iconss-jiantoushang');
        }
    });
})(window, MJQ);
