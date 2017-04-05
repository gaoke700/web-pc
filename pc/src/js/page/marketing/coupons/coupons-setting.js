define(function (require, exports, module) {

    var parentDiv = $('.page-coupons-setting');

    parentDiv.find('.js-save').on('click',function(){
        var cashLimit = parentDiv.find('.cash-limit').val();
        var timeLimit = parentDiv.find('.time-limit').val();
        $.ajax({
            url:'openapi.php?act=setLimit',
            data:{
                toSave:'1',
                brokerage_limit:cashLimit,
                day_limit:timeLimit
            },
            dataType:'json',
            type:'post',
            success:function(data){
                if(data.res=='succ'){
                    new base.promptDialog({
                        str:'发布成功'
                    })
                }else{
                    new base.promptDialog({
                        str:'发布失败'
                    })
                }
            }
        })
    });



    module.exports = {
        init: function(){}
    }
});

