define(function (require, exports, module) {
    var $pageMyCash = $('.page-my-cash');

    //提现
    $pageMyCash.on('click', '.btn-withdrawal', function(){
        var status = $(this).data('status') || 0;
        var msg = $(this).data('msg') || '';
        var url = $(this).data('url') || '';

        if(status == 1){
            var $iframe = $('<iframe src="' + url + '" style="border: 0; width: 500px; height: 500px;"></iframe>');
            new base.Dialog({
                content:$iframe,
                customContent: true,
                showBtn: false
            });

        } else {
            if(url == ''){
                new base.Dialog({ content:msg, type:'alert' })
            } else {
                new base.Dialog({
                    content:msg,
                    type:'alert',
                    btnOkTxt:'去设置',
                    okCallback: function(){
                        window.location.href = url;
                    }
                });
            }
        }


    });

    module.exports = {
        init: function(){
            
        }
    }
});