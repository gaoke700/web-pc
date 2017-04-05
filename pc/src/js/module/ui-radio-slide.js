'use strict';

define(function (require, exports, module) {
    function Fn(json){
        this.opts=$.extend(true,{
            checkTxt:{
                on:'已开启',
                off:'已关闭'
            },
            status:'off',//'off'关  'on'开
            isHand:true,//默认手动触发划过去
            append: false,
            appendDom:$('body'),
            clickCallback:function(){ }
        },json);
        this.onClass='ui-radio-switch-active';//打开时对应状态的class
        this.init();
    }
    Fn.prototype.init=function(){
        if(this.opts.status === 1 || this.opts.status === 'on'){
            this.opts.status = 'on';
        } else {
            this.opts.status = 'off';
        }
        this.render();
        this.events();
    };
    Fn.prototype.render=function(){
        var className=``;
        var status=this.opts.status;
        if(status=='on'){
            className=this.onClass;
        }
        this.parent=$(`<div class="ui-radio-switch ${className}"></div>`);
        var html=`            
            <div class="ui-radio-switch-box">
                <div class="ui-radio-switch-run"></div>
            </div>
            <div class="ui-radio-switch-txt">${this.opts.checkTxt[status]}</div>            
        `;
        this.parent.html(html);
        if(this.opts.append){
            this.opts.appendDom.append(this.parent);
        }
    };
    Fn.prototype.on=function(){//开
        this.parent.addClass(this.onClass);
        this.opts.status='on';
        this.changeTxt();
    };
    Fn.prototype.off=function(){//关
        this.parent.removeClass(this.onClass);
        this.opts.status='off';
        this.changeTxt();
    };
    Fn.prototype.changeTxt=function(){
        this.parent.find('.ui-radio-switch-txt').html(this.opts.checkTxt[this.opts.status]);
    };
    Fn.prototype.clickFn=function(){
        var self=this;
        if(!self.opts.isHand){
            if(self.opts.status=='off'){
                self.on();
            }else{
                self.off();
            }
        }
        self.opts.clickCallback({
            parent:this.parent,
            status:self.opts.status,
            status2:(self.opts.status == 'on' ? 1 : 0)
        });
    };
    Fn.prototype.events=function(){
        var self=this;
        this.parent.on('click',function(){
            self.clickFn();
        })
    };
    Fn.prototype.remove=function(){
        this.parent.remove();
    };
    module.exports = Fn;
});