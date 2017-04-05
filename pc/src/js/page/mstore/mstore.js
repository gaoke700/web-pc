define(function (require, exports, module) {
    module.exports = {
        init: function(){
			var $ = MJQ;
			var ChooseProduct = require('../../common/choose-product.js');
			var ChooseProductConditions = require('../../common/choose-product-conditions.js');


		//更换图片
			$('.logo-img input').on('change',function(){
				var img = this.files[0];
                var imgSize = img.size;
                var imgUrl = base.utils.getUploadUrl(img);
                var $parent = $(this).parent();
                if(Number(imgSize) > 2048000){
                    base.promptDialog({str:'上传图片不能大于2M', time:2000});
                    return false;
                }
                base.uploadImg({
                    img: img,
                    url: 'index.php?ctl=template/module&act=newPic',
                    success: function(result){
                        result = result || {};
                        result.res = result.res || '';
                        result.data = result.data || {};
                        var sImgUrl = result.data.img_source || '';
                        if(result.res == 'succ' && sImgUrl){ 
                            if($parent.find('img').length > 0){
                                $parent.find('img').attr('src', sImgUrl);
                            }
                        } else {
                            base.promptDialog({str:result.msg, time:2000});
                        }
                    },
                    error: function(result){
                        base.promptDialog({str:'上传失败'});
                    }
				})
            }) 
            
        //商品列表设置   
			var chooseData = [];
			
			$('.set-list ul').on('click','.select-by-condition,.select-by-hand', function(){
				$(this).find('input').prop('checked','checked');
				var _this = $(this);
				var index = $(this).parent().index();
				chooseData[index] = chooseData[index] || {};
				
				chooseData[index].datax = chooseData[index].datax || {};
				chooseData[index].datay = chooseData[index].datay || {};
				
				if(_this.hasClass('select-by-condition')){
					if(chooseData[index].datax){
						chooseData[index].objx = new ChooseProductConditions(chooseData[index].datax);
					}else{
						chooseData[index].objx = new ChooseProductConditions();
					}
				} else {
					if(chooseData[index].datay){
						chooseData[index].objy = new ChooseProduct({data:chooseData[index].datay||{}});
					}else{
						chooseData[index].objy = new ChooseProduct();
					}
				}

                $(chooseData[index].objx).on('saveEnd', function(){
					chooseData[index].datax = arguments[1].data;
					
					chooseData[index].type = 1;
					
                })
                $(chooseData[index].objy).on('saveEnd', function(){
					chooseData[index].datay = arguments[1].data;
					
					chooseData[index].type = 2;
                })
			})
			$('.set-list ul').on('blur','.list-name',function(){
				var index = $(this).parent().index();
				chooseData[index]=chooseData[index]||{};
				chooseData[index].name = $(this).val()||'';
			})

//			新建商品列表
			$('.create-new').on('click',function(){
				var liLength=$('.set-list ul li').length;
				if(liLength<4){
					renderDom(liLength)
				}
			})
			function renderDom(i){
				var dom =[];
				dom.push('<li>');
					dom.push('<em>列表名称</em><input class="list-name" type="text" maxlength="6" /><b>最多6个字</b><br/>');
					dom.push('<em>选取商品</em><strong class="select-by-condition" data-selectBy="1"><input type="radio" name="name'+i+'"/>按条件选取</strong>');
					dom.push('<strong class="select-by-hand" data-selectBy="2"><input type="radio" name="name'+i+'" checked="checked" />手动添加</strong>');
					dom.push('<div class="delete-this">x</div>');
				dom.push('</li>');
				$('.set-list ul').append(dom.join(''));
			}
        	//删除本列表
        	$('.set-list ul').on('click','.delete-this',function(){
        		chooseData.splice($(this).parent().index(),1);
        		$(this).parents('li').remove();
        		
        	})
        	
        	//商品列表接口获取
        	$.ajax({
        		url:"index.php?ctl=weixin/weixinMStore&act=ajaxMStoreGoods",
        		dataType:'json',
        		success:function(v){
        			if(v.res=='succ'){
        				var data = v.result.data ||'';
						if(data==''){
							renderDom(0);
							$('.set-list ul li .select-by-condition').find('input').prop('checked','checked');
							return;
						}else{
							data.each(function(v,i){
								renderDom(i);
								chooseData[i]={};
								if(v.data){
									if(v.type==2){
										chooseData[i].datay=v.data[2];
									}else{
										chooseData[i].datax=v.data[1];
										$('.set-list ul li').eq(i).find('.select-by-condition input').prop('checked','checked');
									}
								}
	        					chooseData[i].name=v.name;
	        					chooseData[i].type=v.type;
	        					$('.set-list ul li .list-name').eq(i).val(v.name);
	        				})
						}
        			}
        		}
        	})
        	//保存
        	$('.btns .save').click(function(){
				var saveInfo = true
				//列表名不能为空
				$('.set-list ul').find('.list-name').each(function(i,v){
					// console.log(v)
					if(v.value==''){
						base.promptDialog({str:'列表名不能为空', time:2000});
						saveInfo = false;
						return false;
					}
				})
				if(saveInfo){
					var shopName = $('.shop-name').find('input').val() ||　'';
					var logoUrl = $('.logo-img-container img').attr('src');
					var headerImgUrl = $('.header-img-container img').attr('src');
					var ajaxData = [];
					var num = 0;
					chooseData.each(function(v,i){
//					if(!v.datax||!v.datay||!v.name){
						var data1 = {
							'name':v.name || '',
							'type':v.type,
							data:{}
						}
						data1.data[v.type] = (v.type==1)?v.datax:v.datay;
						ajaxData[i]=data1
//						num++;
//					}
					})
					// console.log(ajaxData)
					//发送数据
					$.ajax({
						url:"index.php?ctl=weixin/weixinMStore&act=saveStore",
						type:"post",
						dataType:'json',
						data:{
							'store':[{store_name:shopName,logo:logoUrl,signage_pic:headerImgUrl}],
							'goodsChoose':ajaxData
						},
						success:function(v){
							base.promptDialog({str:v.msg, time:2000})
						}
					});
				}

        	})
        }
    }
});

