
define(function (require, exports, module) {
	var ProductSelectStandard = require('js/modules/product-select-standard.js'); //一键参团弹框

    module.exports = {
        init: function(){
    		var doc = document;

        	//倒计时-拼团距结束
        	var countDownEle = doc.querySelector('.group-info-time');
	    	var countDown = countDownEle&&countDownEle.dataset.remainsecond;
            base.timeCountDown({
            	seconds:countDown,
            	runCallback:function(data){
            		var countDownDay = doc.querySelector('.group-info-time-day');
            		var countDownHour = doc.querySelector('.group-info-time-hour');
            		var countDownMinute = doc.querySelector('.group-info-time-minute');
            		var countDownSecond = doc.querySelector('.group-info-time-second');

            		countDownDay&&(countDownDay.innerHTML = data.d + '天');
            		countDownHour&&(countDownHour.innerHTML = data.h);
            		countDownMinute&&(countDownMinute.innerHTML = data.m);
            		countDownSecond&&(countDownSecond.innerHTML = data.s);
            		if((data.d*1) == 0){
            			countDownDay.classList.add('on');
            		}
         	  	},
         	  	overCallback:function(){

         	  	}
        	});

    		//倒计时-拼团距结束
	    	var countDownPaymentEle = doc.querySelector('.group-info-time-payment');
	    	var countDownPayment = countDownPaymentEle&&countDownPaymentEle.dataset.second;
    	    base.timeCountDown({
    	    	seconds:countDownPayment,
    	    	runCallback:function(data){
    	    		var countDownPaymentMinute = doc.querySelector('.group-info-time-payment-minute');
    	    		var countDownPaymentSecond = doc.querySelector('.group-info-time-payment-second');

    	    		countDownPaymentMinute&&(countDownPaymentMinute.innerHTML = data.m);
    	    		countDownPaymentSecond&&(countDownPaymentSecond.innerHTML = data.s);
    	 	  	},
    	 	  	overCallback:function(){

    	 	  	}
    		});

    		//一键参团
    		$('.group-info-join').on('click',function(){
				var $goodsInfo = $('.group-goods-info');
				var $goodsId = $goodsInfo.attr('goods-id');
				var actId = $goodsInfo.attr('act-id');
				var teamId = $goodsInfo.attr('team-id');
				var showSendGift=false,showHowToGiftTip=false,showJoinCart=false,showBuyNow=false,seckill=false,group=false,groupJoinTeam=false;

				showBuyNow = true;
				groupJoinTeam = true;
				
				new ProductSelectStandard({
					goods_id:$goodsId,
					act_id:actId,
					team_id:teamId,
					showBuyNow:showBuyNow,
					groupJoinTeam:groupJoinTeam
				})
			});
    		//分享弹框
		    wxCallbackJson.shareDialog = function(){
		        var Dialog = require('js/common/plug/dialog.js'); //分享完后弹框
		        //分享后弹框
		        var shareDialog = new Dialog.Dialog({
		            showHeader:true,
		            headerTxt:'分享成功',
		            showBtn:false,
		            type:'confirm',
		            content: '<div class="group-share-word">继续分享才能大大提高成团率哦！</div><div class="group-share-goon">继续分享</div><div class="group-share-more">发现更多好货</div><a  class="group-share-index" href="?groups-3-groupsList.html">前往拼团首页</a>',
		        });

		        var $goon = document.querySelector('.group-share-goon');
		        $goon&&$goon.addEventListener('click',function(){
		            shareDialog.remove();
		        });
		    }

        }
    }
});