//我的记录里的商品
define(function (require, exports, module){
    function Fn(json){
        this.opt=json||{};
        this.statusInfo=this.opt.statusInfo;
        //'0'待付款,'1'待发货,'2'待收货,'3'待评价,'4'已完成,'5'未知
        this.statusTxt=['待付款','待发货','待收货','待评价','已完成','已取消','other'];
        this.alreadyCompleted='4';
        this.alreadyCancel='5';
        this.storeName=this.opt.storeName||'店铺名称';
        this.storeLogo=this.opt.storeLogo;
        this.storeMoreInfo=this.opt.storeMoreInfo||'更多';
        this.money=this.opt.money;
        this.orderId=this.opt.orderId;
        this.deleteCallback=this.opt.deleteCallback;
        this.info=this.opt.info||[];//商品的配置信息configData和ajax信息ajaxData
    }
    Fn.prototype.getOrderStatus=function(){
        var self=this;
        this.statusTxt.forEach(function(v,i){
            if(self.statusInfo==v){
                self.status=i;
            }
        });
        //console.log('statusInfo:',this.statusInfo,'orderId:',this.orderId,'status:',this.status);
    };
    Fn.prototype.renderParent=function(){
        this.getOrderStatus();
        this.parentDom=document.createElement('div');
        this.parentDom.classList.add('m-record-shopping');
        this.parentDom.classList.add(`m-record-shopping-status${this.status}`);
        this.parentDom.innerHTML=`
            ${this.renderHeader()}
            ${this.renderContent()}
            ${this.renderFooter()}
        `;
    };
    Fn.prototype.renderHeader=function(){
        var name=this.storeName;
        var status=this.statusInfo;
        var logo=this.storeLogo;
        return `
            <div class="m-record-shopping-header">
                <div class="m-record-shopping-header-store">
                    <span class="m-record-shopping-store-logo"><img src="${logo}" alt=""></span>
                    <span class="m-record-shopping-store-txt">${name}</span>
                </div>
                ${this.renderMore()}
                <div class="m-record-shopping-header-status">${status}</div>
            </div>
        `;
    };
    Fn.prototype.renderMore=function(){
        var more=this.storeMoreInfo;
        if(this.status==this.alreadyCompleted||this.status==this.alreadyCancel){
            return `
                <div class="m-record-shopping-header-more">
                    <div class="m-record-shopping-header-more-info">${more}</div>
                    <div class="m-record-shopping-header-more-list">
                        <div class="m-record-shopping-header-more-btn m-record-shopping-header-more-delete">删除订单</div>
                    </div>                                     
                </div>
            `;
        }else{
            return ``;
        }
    };
    Fn.prototype.renderContent=function(){
        return `<div class="m-record-shopping-content"></div>`;
    };
    Fn.prototype.renderFooter=function(){
        return `
            <div class="m-record-shopping-footer">
                <div class="m-record-shopping-footer-money">
                    <span>合计:</span>
                    <span>￥</span>
                    <span class="m-record-shopping-footer-money-detail">${this.money}</span>
                </div>
            </div>
        `;
    };
    Fn.prototype.power=function(){
        this.pushData();
        this.clickMore();
    };
    Fn.prototype.pushData=function(){
        var self=this;
        var main=self.parentDom.querySelector('.m-record-shopping-content');
        var Fn=require('js/modules/m-shopping.js');
        this.info.forEach(function(v){
            var fn=new Fn({
                configData:v.configData,
                ajaxData:v.ajaxData
            });
            fn.render(function(dom){
                main.appendChild(dom);
            });
        });
    };
    Fn.prototype.clickMore=function(){
        var more=this.parentDom.querySelector('.m-record-shopping-header-more-info');
        var list=this.parentDom.querySelector('.m-record-shopping-header-more-list');
        var deleteBtn=this.parentDom.querySelector('.m-record-shopping-header-more-delete');
        var self=this;
        if(more){
            more.addEventListener('click',function(){
                list.classList.toggle('m-record-shopping-header-more-list-show');
            });
            //console.log(self.orderId);
            deleteBtn.addEventListener('click',function(){
                var diaglog=require('js/common/plug/dialog.js');
                list.classList.remove('m-record-shopping-header-more-list-show');
                diaglog.dialogCustom1({
                    iconName:'icons-zhishi',
                    content:'确定删除该订单吗？',
                    okCallback:function(){
                        $.ajax({
                            url:'openapi.php?act=deleteOrder',
                            type:'post',
                            data:{order_id:self.orderId},
                            dataType:'json',
                            success:function(data){
                                //console.log(data);
                                if(data.res=='succ'){//删除成功
                                    var dom=self.parentDom;
                                    var parent=dom.parentNode;
                                    parent.removeChild(dom);
                                    self.deleteCallback&&self.deleteCallback();
                                }
                                diaglog.dialogPrompt1({content:data.msg});
                            }
                        });
                    }
                });
            });

        }
    };
    Fn.prototype.render=function(fn){
        this.renderParent();
        this.power();
        fn&&fn(this.parentDom);
    };
    module.exports = Fn;
});