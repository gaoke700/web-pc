/**
 * Created by zhangzhigang on 2017/1/9.
 */
define(function (require, exports, module) {
    var api=require('js/modules/m-api.js');
    var Dialog = require('js/common/plug/dialog.js');
    var addSubtract=require('js/common/plug/addSubtract.js');
    var mMask=require('js/modules/m-mask.js');
    
    function ProductSelectStandard(opts){
        this.opts = $.extend({
            goods_id:'',
            act_id:'',
            showJoinCart:false,
            showBuyNow:false,
            seckill:false,
            showSendGift:false,
            showHowToGiftTip:false,
            group:false,
            groupJoinTeam:false,
            closeCallback:'null'
        }, opts || {});
        this.data = {};
        this.choose = {};
        this.init();
    }
    ProductSelectStandard.prototype.constructor = ProductSelectStandard;
    ProductSelectStandard.prototype.init = function(){
    	var _this=this;
        if(!this.opts.goods_id){ return false;}
        this.$productSelectStandard = $('<div class="g-product-select-standard"></div>');
        this.dialog = new Dialog.Dialog({
            showBtn: false,
            customContent: true,
            content: this.$productSelectStandard,
            closeCallback:_this.opts.closeCallback,
            style:{
                position:'bottom',
                borderRadius:.1,
                width: '100%'
            }
        });
        this.event();
        this.ajax();
    };
    ProductSelectStandard.prototype.render = function(){
        var htmls = [], data = this.data, _this = this;
        
        htmls.push('<div class="product-header">');
        htmls.push('<i class="icons icons-guanbi close-popup js-close-parent"></i>');
        htmls.push('<img class="product-img" src="' + (data.result.thumbnail[0] || '') + '"/>');
        htmls.push('<div class="product-infos">');
        if(_this.opts.group || _this.opts.groupJoinTeam){//拼团
            htmls.push('<div class="product-pirce">￥'+_this.choose.act_price+'</div>');
            htmls.push('<p class="product-store">库存：<span>'+_this.choose.act_store+'件</span></p>');
        }else{//非拼团
            htmls.push('<div class="product-pirce">￥'+_this.choose.price+'</div>');
            htmls.push('<p class="product-store">库存：<span>'+_this.choose.store+'件</span></p>');
        }
        htmls.push('<p class="product-standard">已选：<span>'+ _this.choose.text+'</span></p>');
        htmls.push('</div>');
        htmls.push('</div>');
        htmls.push('<div class="product-content">');
        htmls.push('<div class="is-scroll">');
        if(_this.opts.showHowToGiftTip){
        	var dom=`
        	<div class="how-to-gift">
        		<!--<div class="how-to-gift-header">
        			如何送礼？<i class="icons icons-gengduo rotate-arrow"></i>
        		</div>-->
        		<div class="how-to-gift-content">
        			<!--<ul class="gift-content-top">
        				<li><span>1.</span><i>选择礼物</i></li>
        				<li><span>2.</span><i>分享给好友</i></li>
        				<li><span>3.</span><i>好友领取礼物</i></li>
        			</ul>-->
                    <div class="gift-content-title" >如何送礼</div>
        			<p class="gift-content-bottom">
        				1、选择要送出的礼物和数量，如购买10件可分享送给10个好友领取；<br/>
						2、付款成功后将订单分享给好友，好友领取礼物并填写收货地址，即可完成礼物的领取；<br/>
						3、送礼订单的有效期为3天，逾期未领取的礼物钱款将自动退还至送礼人的支付账户中。<br/>	
        			</p>
        		</div>
        	</div>`.trim();
        	htmls.push(dom);
        }
        htmls.push('<div class="standards">');
        htmls.push('<p>种类</p>');
        htmls.push('<ul>');
        for(var i=0;i<data.result.product.length;i++){
			if(data.result.product[i].pid == _this.choose.pid){
				htmls.push('<li product-pid="'+ _this.choose.pid +'" class="active2">'+ _this.choose.text +'</li>');
			} else {
				htmls.push('<li product-pid="'+ data.result.product[i].pid +'" class="'+(data.result.product[i].store==0?'active1':'')+'">'+ data.result.product[i].text +'</li>');
			}
        }
        htmls.push('</ul>');
        htmls.push('</div>');
        htmls.push('<div class="number-warp">');
        htmls.push('<p>数量</p>');
        htmls.push('<div class="limit-buy none">(可购买数：<span></span>件)</div>');
        htmls.push('<div class="plus">');
        htmls.push('<span class="no-active js-reduce-num"><i class="icons icons-jianhao"></i></span>');
        htmls.push('<input class="num-value" type="text" value="1" />');
        htmls.push('<span class="js-add-num"><i class="icons icons-jiahao"></i></span>');
        htmls.push('</div>');
        htmls.push('</div>');

        var $groupLimit = document.querySelector('.wang-group-limit-num');
        var $groupJoinLimit = document.querySelector('.wang-group-info-join');
        var $groupLimitValue;
        if($groupLimit || $groupJoinLimit){ //拼团
            if(_this.opts.group || _this.opts.groupJoinTeam){
                $groupLimitValue = $groupLimit?$groupLimit.value:$groupJoinLimit.value;
                if($groupLimitValue*1 == 0){ //不限购
                    htmls.push('');
                }else{ //限购
                    htmls.push('<div class="group-limit">限购<span class="group-limit-num">'+ $groupLimitValue +'</span>件</div>');
                }
            }
        }else {//非拼团
            htmls.push('');
        }
        htmls.push('</div>');
        htmls.push('</div>');
        htmls.push('<div class="bottom-btns">');
        if(_this.opts.showJoinCart){
        	htmls.push('<div class="join-cart join-cart-js">加入购物车</div>');
        }
        if(_this.opts.showBuyNow){
            var sk = 'normal';
            if(_this.opts.seckill){
                sk = 'seckill';
            }
            if(_this.opts.group){ //立即开团
                sk = 'group';
            }
            if(_this.opts.groupJoinTeam){ //立即参团
                sk = 'group-jointeam';
            }
            if(sk == 'group'){
                htmls.push('<div class="buy-now buy-now-js '+sk+'">立即开团</div>');
            }
            if(sk == 'group-jointeam'){
                htmls.push('<div class="buy-now buy-now-js '+sk+'">立即参团</div>');
            }
            if(sk == 'normal' || sk == 'seckill'){
                htmls.push('<div class="buy-now buy-now-js '+sk+'">立即购买</div>');
            }
        }
        if(_this.opts.showSendGift){
        	htmls.push('<div class="send-gift send-gift-js">选好礼物</div>');
        }
        htmls.push('</div>');
        return htmls.join('');
    };
    ProductSelectStandard.prototype.event = function(){
        var _this = this;
        //关闭弹窗
        this.$productSelectStandard.on('click', '.js-close-parent', function(){
            _this.dialog.remove();
        });
        var loading=base.loading();
        var maskTransparent=mMask({isTransparent:true});
        function loShow(){
            loading.show();
            maskTransparent.show();
        }
        function loHide(){
            loading.hide();
            maskTransparent.hide();
        }
        //点击如何送礼
        this.$productSelectStandard.on('click', '.how-to-gift-header', function(){
        	_this.$productSelectStandard.find('.how-to-gift-content').toggle();
        	$(this).find('i').toggleClass('rotate-arrow');
        });
        //选择规格
        var product_pid;
        this.$productSelectStandard.on('click', '.standards li', function(){

            var liNum = $(this).siblings().length;
            console.log(2,liNum);
            if(liNum !== 0){
            console.log(3);

            loShow();
            	product_pid = $(this).attr("product-pid");
    			var index = base.utils.arrayFindkey(_this.data.result.product, 'pid', product_pid);
    			if(index < 0){ loHide();return false;}

    			var qdNum = _this.choose.qdNum;
    			_this.choose = _this.data.result.product[index];
    			_this.choose.qdNum = qdNum;
    			if(_this.choose.store <= 0){     //一开始库存数
                    loHide();
                    _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                    Dialog.dialogPrompt1({
                        content:'商品已抢光'
                    });
                    return false;
    			}
                $('body').find('.select-standard .content').html($(this).html());

    			var $_this = $(this);
                //选规格时更新库存
    	        base.ajax({
    	            url: 'assist.php?act=getProPriceStoreAjax',
    	            data: {
    	                goods_id: _this.opts.goods_id,
    	                product_id: product_pid,
                        act_id:_this.opts.act_id
    	            },
    	            dataType: 'json',
    	            success: function(result){
                        loHide();
    	            	_this.choose.store = result.store || 0;

                        var buyNum = result.store;
                        //如果限购
                        if(result.param.limitBuy == 'on'){
                            var limitNum = result.param.limit_num;
                            if(limitNum*1>result.store*1){
                                limitNum=result.store;
                            }
                            if(buyNum*1>limitNum*1){
                                buyNum=limitNum;
                            }
                            _this.$productSelectStandard.find('.limit-buy').removeClass('none').find('span').html(buyNum);
                        }

    	            	if(_this.choose.store<=0 || buyNum*1<=0){
                            Dialog.dialogPrompt1({
                                content:'商品已抢光'
                            });
    	                	_this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                            _this.$productSelectStandard.find('.bottom-btns .join-cart-js').removeClass('join-cart-js');
                            _this.$productSelectStandard.find('.bottom-btns .buy-now-js').removeClass('buy-now-js');
    	                }else{
                            _this.$productSelectStandard.find('.bottom-btns div').removeClass('bg-grey');
                            _this.$productSelectStandard.find('.bottom-btns .join-cart-js').addClass('join-cart-js');
                            _this.$productSelectStandard.find('.bottom-btns .buy-now-js').addClass('buy-now-js');
                        }
    	                $_this.parents(".g-dialog-content").find(".product-pirce").html("￥"+result.price);
                        $_this.parents(".g-dialog-content").find(".product-infos p.product-store span").html(result.store+"件");
    	                $_this.parents(".g-dialog-content").find(".product-infos p.product-standard span").html(result.text);
    					$_this.siblings('.active2').removeClass('active2');
    					$_this.addClass('active2');
    					
    					//如果已选数量大于库存就改为库存
    	                var selectNum=_this.$productSelectStandard.find('.num-value')[0].value;
    	                if(selectNum*1>result.store*1){
    	                	_this.$productSelectStandard.find('.num-value')[0].value=result.store;
    	                }
                        _this.$productSelectStandard.find('.js-reduce-num').addClass('no-active');


                        addSubtract({
                            noActiveClass:'no-active',
                            add:_this.$productSelectStandard.find('.js-add-num')[0],
                            substract:_this.$productSelectStandard.find('.js-reduce-num')[0],
                            input:_this.$productSelectStandard.find('.num-value')[0],
                            inventoryNum:buyNum
                        });
                        
            			$('body').find('.price big').html(result.price);

                        //秒杀产品改变对应规格的秒杀价格
                        if(result.param.price){
                            $('body').find('.seckill .seckill-price span').html(result.param.price);
                        }
    	            }
    	        });
            }

        });
        //加入购物车
        this.$productSelectStandard.on('click', '.join-cart-js', function(){
        	if(!$(this).hasClass('bg-grey')){
        		if(!product_pid){
	                product_pid=$('.standards .active2').attr('product-pid');
	            }
	            var cartAdd=api.cartAdd;
	        	var value=_this.$productSelectStandard.find('.num-value')[0].value;
	        	_this.choose.qdNum=value;
                if(_this.choose.store <= 0){     //一开始库存数
                    _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                    Dialog.dialogPrompt1({
                        content:'商品已抢光'
                    });
                    return false;
                }
	        	base.ajax({
		            url: cartAdd.url,
	                type:cartAdd.type,
		            data: {
		                [cartAdd.data.name]: product_pid,
	                    [cartAdd.data.num]: _this.choose.qdNum
		            },
		            dataType: 'json',
		            success: function(result){
		                //购物车小红点
		                $('body').find('.js-my b').removeClass('none');
		                $('body').find('.js-dian-carts b').removeClass('none');
		                //加完购物车关闭弹层
                        Dialog.dialogPrompt1({content:'已加入购物车'});
		                _this.dialog.remove();
		            }
		        });
        	}
            
        });
        //立即购买
        this.$productSelectStandard.on('click', '.buy-now-js', function(){
            if(!$(this).hasClass('bg-grey')){
                var value=_this.$productSelectStandard.find('.num-value')[0].value;
                _this.choose.qdNum=value;
                if(!$(this).hasClass('group')){
                    if(_this.choose.store <= 0){     //一开始库存数
                        _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                        Dialog.dialogPrompt1({
                            content:'商品已抢光'
                        });
                        return false;
                    }
                }
                if($(this).hasClass('normal')){//普通商品
                    location.href='index.php?ctl=orders&act=checkout&goods['+ _this.choose.pid +']='+_this.choose.qdNum;
                }else{
                    if($(this).hasClass('seckill')){    //秒杀
                        $.ajax({
                            url:"openapi.php?act=getGoodsInfos&goods_id=" + _this.opts.goods_id,
                            dataType:'json',
                            success:function(v){
                                if(v.result.param[0].countDown>0){
                                    location.href='index.php?ctl=orders&act=checkout&type=seckill&goods['+_this.choose.pid +']='+_this.choose.qdNum;
                                }else{
                                    Dialog.dialogPrompt1({content:'活动已结束'});
                                    _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                                    _this.$productSelectStandard.find('.bottom-btns .buy-now-js').removeClass('buy-now-js');
                                }
                            }
                        });
                    }
                    if($(this).hasClass('group')){ //拼团--开团
                        location.href='index.php?ctl=orders&act=checkout&type=groupbuy&goods['+_this.opts.goods_id +']='+_this.choose.qdNum;
                    }
                    if($(this).hasClass('group-jointeam')){ //拼团--参团
                        var $goodsInfo = $('.group-goods-info');
                        var teamId = $goodsInfo.attr('team-id');
                        location.href='index.php?ctl=orders&act=checkout&type=groupbuy&goods['+_this.opts.goods_id +']='+_this.choose.qdNum+'&team_id='+teamId;
                    }
                }
        	}
        });
        //送礼
        this.$productSelectStandard.on('click', '.send-gift-js', function(){
        	if(!$(this).hasClass('bg-grey')){
	        	var value = _this.$productSelectStandard.find('.num-value')[0].value;
	        	_this.choose.qdNum=value;
				window.location.href='index.php?ctl=orders&type=gifts&act=checkout&goods['+_this.choose.pid+']='+_this.choose.qdNum;
			}
		})
        //拼团--库存为0
        // var bottomBtnsGroup = $('body').find('.group');
        // var bottomBtnsGroupJointeam = $('body').find('.group-jointeam');
        // function groupSetGrey(){
        //     var _groupInventory = _this.$productSelectStandard.find('.product-store span');
        //     var _groupInventoryText = _groupInventory&&_groupInventory.html();
        //     var _groupInventoryLen = _groupInventoryText.length || 0;
        //     var _groupInventoryVal = _groupInventoryText.substring(0,_groupInventoryLen-1);
            
        //     if((_groupInventoryVal*1) == 0){
        //         Dialog.dialogPrompt1({
        //             content:'库存为0，不能购买'
        //         });
        //         return false;
        //     }
        // }
        // if(bottomBtnsGroup || bottomBtnsGroupJointeam){
        //     this.$productSelectStandard.on('click', '.group', function(){
        //         groupSetGrey();
        //     })
        //     this.$productSelectStandard.on('click','.group-jointeam', function(){
        //         groupSetGrey();
        //     })
        // }
    };
    ProductSelectStandard.prototype.ajax = function(){
        var _this = this;
        base.ajax({
            url: 'openapi.php?act=getGoodsInfos',
            data: {
                goods_id: this.opts.goods_id
            },
            dataType: 'json',
            success: function(result){
                _this.data = result || {};
                _this.data.result = _this.data.result || {};
                _this.data.result.product = _this.data.result.product || [];     
                var data=base.jsonToArray(_this.data.result.product);

                _this.choose=data[0];  //默认第一个数据
                _this.choose.qdNum=1;

                var index=0;		//假设第一个规格
                var store=0;  		//假设第一个规格库存
                var datav=data[0];
                data.forEach(function(v,i){
                    if(v.store*1>0&&store*1<=0){
                        store=v.store*1;
                        index=i;
                        _this.choose=v;
                        _this.choose.qdNum=1;
                        datav=v;
                    }
                });

                _this.$productSelectStandard.html(_this.render());
                //秒杀--如果默认规格限购
                if(datav.limitBuy == 'on'){
                    var limitNum = datav.limit_num;
                    if(limitNum*1>datav.store*1){
                        limitNum=datav.store;
                    }
                    _this.$productSelectStandard.find('.limit-buy').removeClass('none').find('span').html(limitNum);

                    if(limitNum*1<=0){
                        _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                        _this.$productSelectStandard.find('.bottom-btns .join-cart-js').removeClass('join-cart-js');
                        _this.$productSelectStandard.find('.bottom-btns .buy-now-js').removeClass('buy-now-js');
                    }
                }

                //渲染完结构
                $('.standards li').removeClass('active2');
                $('.standards li').eq(index).addClass('active2');

                if(_this.choose.store<=0){
                    _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                    // _this.$productSelectStandard.find('.bottom-btns .join-cart-js').removeClass('join-cart-js');
                    // _this.$productSelectStandard.find('.bottom-btns .buy-now-js').removeClass('buy-now-js');
                }

                addSubtract({
                    noActiveClass:'no-active',
                    add:_this.$productSelectStandard.find('.js-add-num')[0],
                    substract:_this.$productSelectStandard.find('.js-reduce-num')[0],
                    input:_this.$productSelectStandard.find('.num-value')[0],
                    inventoryNum:limitNum
                });
                //拼团--限购
                var groupLimitDiv = _this.$productSelectStandard.find('.group-limit')[0];
                var groupLimitNum = _this.$productSelectStandard.find('.group-limit-num').html();
                if(groupLimitDiv){
                    addSubtract({
                        noActiveClass:'no-active',
                        add:_this.$productSelectStandard.find('.js-add-num')[0],
                        substract:_this.$productSelectStandard.find('.js-reduce-num')[0],
                        input:_this.$productSelectStandard.find('.num-value')[0],
                        inventoryNum:groupLimitNum*1
                    });
                }
                //拼团--库存为0-添加灰色
                var groupInventory = document.querySelector('.product-store span');
                var groupInventoryText = groupInventory&&groupInventory.innerHTML;
                var groupInventoryLen = groupInventoryText.length;
                var groupInventoryVal = groupInventoryText.substring(0,groupInventoryLen-1);
                if((groupInventoryVal*1) == 0){
                    _this.$productSelectStandard.find('.bottom-btns div').addClass('bg-grey');
                }else {
                    _this.$productSelectStandard.find('.bottom-btns div').removeClass('bg-grey');

                }
            }
        });
    };
    module.exports = ProductSelectStandard;
});
