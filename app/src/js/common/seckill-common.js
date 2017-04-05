define(function (require, exports, module) {

    return {
    	//	倒计时
    	daojishi:function(selector){
			$(selector).each(function(){
				var $this=$(this);
				if(!$(this).hasClass('added')){
					base.timeCountDown({
						seconds:$this.data('time'),
						runCallback:function(opt){
							var arr=[opt.d,opt.h,opt.m,opt.s];
							$this.find('i').each(function(index){
								$(this).html(arr[index]);
							})
						},
						overCallback:function(){
							//倒计时结束...
							$this.parents('li').find('h2 span').remove();
							$this.parents('li').find('dt span').remove();
							$this.parents('li').find('dd a h3 i').remove();
							$this.parents('li').find('dd a span').remove('.msq');
							$this.parents('li').find('dd a h5').remove();
							$this.parents('li').find('dd a').append(`<h5><span class="icons icons-cart"></span></h5>`);
							$this.parents('li').find('dd a h6').remove();
						}
					})
				}
				$(this).addClass('added');
			})
		},
		//时间转换
	    dateTransform:function(millionSec){
	    	var killDate = new Date(millionSec*1000);
	    	var fen=(killDate.getMinutes()>9)? killDate.getMinutes():('0'+killDate.getMinutes());
	        return {
	            m:killDate.getMonth()+1,//月
	            h:killDate.getHours(),//小时
	            d:killDate.getDate(),//天
	            s:fen//分
	        }
	    },
		//	重置开枪时间
		rubTime:function(selector){
			var dateTransform=this.dateTransform;
			$(selector).each(function(v){
				if(!$(this).hasClass('added')){
					var tim = dateTransform($(this).data('time'));
					var arr = [tim.m,tim.d,tim.h,tim.s];
					$(this).find('i').each(function(index,b){
						$(this).html(arr[index]);
					})
				}
				$(this).addClass('added');
			})
		},
	//点击提醒我
		remindMe:function(ele,dialogSecondary,that){
			var $this = null;
			var act_id = null;
			if(that){
				$this=that;
				act_id = that.attr('act_id')
			}else{
				$this=$(this);
				act_id =$(this).attr('act_id');
			}
			$.ajax({
				type:"post",
				url:"index.php?seckill-doRemind.html",
				async:true,
				data:{act_id:act_id},
				dataType:'json',
				success:function(data){
					if(data.res=='succ'){

						dialogSecondary.dialogPrompt1({content:data.msg});

						$this.before(ele);
						$this.css({'display':'none'});
					}else{

						data.data?dialogSecondary.dialogCustom1({
							content:data.msg,
							okCallback:function() {
								//确认去绑手机号...
								window.location.href="index.php?member-verifyMobile.html";
							}
						}):dialogSecondary.dialogPrompt1({content:data.msg});

					}
				}
			});
		}
	
	}
});
