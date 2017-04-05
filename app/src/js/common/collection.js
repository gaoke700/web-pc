define(function (require, exports, module) {
    var dialog=require('js/common/plug/dialog.js');
    function Collection(opts){
        this.opts = $.extend({
            gid:'',
            status: true
        }, opts||{});
        this.init();
    }

    Collection.prototype.constructor = Collection;

    Collection.prototype.init = function(){
        if(!this.opts.gid) return false;
        this.request();
    };

    Collection.prototype.return = function(result){
        var status = true;
        var tip = {
            iconName:'icons-chenggong',
            text:(this.opts.status ? '已收藏' : '已取消')
        };

        if(!result.res){
            if (!result.mid){
                window.location.href="index.php?passport-login.html";
                return false;
            }
            tip.iconName = 'icons-shibai';
            tip.text = result.msg;
            status = false;
        }

        dialog.dialogPrompt1({content:tip.text});

        $(this).trigger('collect',{status:status});
    };

    Collection.prototype.request = function(){
        var _this = this;
        $.ajax({
            type:'post',
            url:'index.php?ctl=member&act=' + (this.opts.status ? 'doFavorite' : 'unFavorite'),
            data:{
                goods_id:this.opts.gid
            },
            dataType:'json',
            success:function(res){
                _this.return(res);
            }
        });
    };

    module.exports = Collection;
});
