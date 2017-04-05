define(function (require, exports, module){
    function CommentList(opts){
        this.opts={
        	showStars:true,
        	showUserName:true,
        	showCommentTime:true,
        	showContentText:true,
        	showContentImg:false,
        	showProductStandard:true,
        	showBuyTime:true,
        	showFavor:false,
        	showMessage:false,
        	showReply:true,
        	ajaxData:{}
        };
        $.extend(true, this.opts, opts||{});
        
        this.ajaxData={
            starsNum:this.opts.ajaxData.star_num,//星星数量
            userName:this.opts.ajaxData.member_name,//评论者名称
            commentTime:this.opts.ajaxData.create_time,//评论时间
            contentText:this.opts.ajaxData.details,//评论文字
            contentImg:this.opts.ajaxData.images,//评论图片
            standard:this.opts.ajaxData.addon,//商品规格
            buyTime:this.opts.ajaxData.order_create_time,//购买时间
            detailsReply:this.opts.ajaxData.details_reply,//购买时间
            favor:{
            	hasFavor:true,//是否点过赞
            	favorNum:22//点赞数
            },//点赞
            messageNum:44,//评论数
        };
        this.createEle(this.ajaxData);
    }
    CommentList.prototype.constructor = CommentList;
    
    //以下是渲染结构
    CommentList.prototype.createEle = function(v){
    	var $header=``,$content=``,$commentsFooter=``;
    	if(this.opts.showStar||this.opts.showUserName||this.opts.showCommentTime){
    		var $stars = ``;
    		if(this.opts.showStars){
    			var $star = ``;
    			for(var i=0; i<v.starsNum; i++){
    				$star += `<span class="icons icons-xingji"></span>`;
    			}
    			$stars = `<div class="stars">${$star}</div>`;
    		}
    		var $nameTime=``;
    		if(this.opts.showUserName||this.opts.showCommentTime){
    			
    			var $items =``;
    			if(this.opts.showUserName){
	    			$items +=`<strong class="user-name">${v.userName}</strong>`;
	    		}
    			if(this.opts.showUserName){
	    			$items += `<i class="comments-time">${v.commentTime}</i>`;
	    		}
    			$nameTime = `<div class="name-time">${$items}</div>`;
    		}
    		$header = `<div class="comments-header">${$stars}${$nameTime}</div>`;
    		
    	}
    	if(this.opts.showContentText||this.opts.showContentImg){
    		var $text=``;
    		if(this.opts.showContentText){
    			$text = `<p class="content-text">${v.contentText}</p>`;
    		}
    		var $contentImg=``;
    		if(this.opts.showContentImg&&v.contentImg.length>0){
    			var $imgs = ``;
    			for(var i=0;i<v.contentImg.length;i++){
    				$imgs += `<img src="${v.contentImg[i]}" />`;
    			}
    			$contentImg = `<div class="content-images">${$imgs}</div>`;
    		}
    		$content = `<div class="comments-content">${$text}${$contentImg}</div>`
    	}
    	if(this.opts.showProductStandard||this.opts.showBuyTime||this.opts.showFavor||this.opts.showMessage||this.opts.showReply){
    		var $standard=``,$tfc=``,$reply=``;
    		if(this.opts.showProductStandard){
    			$standard = `<div class="product-standard"><span>规格:</span><i>${v.standard}</i></div>`;
    		}
    		if(this.opts.showBuyTime||this.opts.showFavor||this.opts.showMessage){
    			var $buyTime=``,$favorComment=``;
    			if(this.opts.showBuyTime){
    				$buyTime = `<div class="buy-time"><span>购买日期:</span><i>${v.buyTime}</i></div>`;
    			}
    			if(this.opts.showFavor||this.opts.showMessage){
    				var $favor=``,$showMessage=``;
    				if(this.opts.showFavor){
    					$favor = `<span class="favor"><i class="icons icons-haoping"></i><b>${v.favor.favorNum}</b></span>`;
    				}
    				if(this.opts.showMessage){
    					$showMessage =`<span class="comment"><i class="icons icons-huifu"></i><b>${v.messageNum}</b></span>`;
    				}
    				$favorComment = `<div class="favor-comment">${$favor} ${$showMessage}</div>`;
    			}
    			$tfc = `<div class="time-favor-comment">${$buyTime}${$favorComment}</div>`;
    		}
            if(this.opts.showReply && v.detailsReply!=''){
                $reply = `<div class="reply"><span>商家回复:</span><i>${v.detailsReply||''}</i></div>`;
            }
    		$commentsFooter = `<div class="comments-footer">${$standard}${$tfc}${$reply}</div>`;
    	}
    	var $wrap = `<div class="comments-list">${$header}${$content}${$commentsFooter}</div>`.trim();
//console.log($wrap)
		this.parentDom=$wrap;
    }
    //点赞...
    //评论...
    module.exports = CommentList;
});