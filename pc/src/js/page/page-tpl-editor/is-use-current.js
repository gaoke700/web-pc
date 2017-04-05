define(function (require, exports, module) {
    var $ = MJQ;

    function IsUseCurrent(opts){
        this.status = opts.status||0;
        this.isUse = (opts.status == 1 ? true : false);
        this.parent = opts.parent || null;
        this.init();
    }

    IsUseCurrent.prototype.constructor = IsUseCurrent;

    IsUseCurrent.prototype.init = function(){
        var _this = this;

        if(this.isUse){
            this.parent.find('i').html('<em class="icons-tick"></em>');
        }

        this.parent.on('click', function(){
            _this.setStatus();
        });
    };

    IsUseCurrent.prototype.setStatus = function(){
        if(this.isUse){
            base.promptDialog({str:'当前正在使用，不可取消'});
            return false;
        }
        var _this = this;
        if(this.status){
            this.status = false;
            this.parent.find('i').html(' ');
        } else {
            new base.Dialog({
                headerTxt:'提示信息',
                content:'确定设为当前使用模版',
                okCallback: function(){
                    _this.status = true;
                    _this.parent.find('i').html('<em class="icons-tick"></em>');
                }
            });
        }
    };

    module.exports = IsUseCurrent;
});
