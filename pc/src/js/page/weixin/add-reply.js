define(function (require, exports, module) {

    var AddKeyWord = require('../../module/dialog/add-key-word.js');
   
    var replyContent = document.querySelector('.reply-content');

    //选择素材
    $('.check-matter').on('click',function(){
        AddKeyWord({
            callback:function(id){
                var $id = id || '';
                $.ajax({
                    url:'openapi.php?act=weixin_material_info',
                    data:{
                        m_id:$id
                    },
                    type:'post',
                    dataType:"json",
                    success: function(data){
                        var result = data.result || {};
                        var type = result.type;
                        var doc = document;

                        replyContent.dataset.item = $id;

                        if(type == 'text'){ //文本
                            replyContent.innerHTML = result.params.txt;
                        }
                        if(type == 'image'){ //单图文
                            replyContent.innerHTML = '';

                            var danTitle = doc.createElement('div');      //标题
                            var danImg = doc.createElement('img');        //图片
                            var danText = doc.createElement('div');       //内容

                            danTitle.className = 'dan-title';
                            danImg.className = 'dan-img';
                            danText.className = 'dan-text';
                            
                            danTitle.innerHTML = result.params.title;
                            danImg.setAttribute('src',result.params.image);
                            danText.innerHTML = result.params.content;

                            replyContent.appendChild(danTitle);
                            replyContent.appendChild(danImg);
                            replyContent.appendChild(danText);
                        }
                        if(type == 'news'){ //多图文
                            replyContent.innerHTML = '';

                            var duoImg = doc.createElement('img');     
                            var duoUl = doc.createElement('ul');     
                            
                            duoImg.className = 'duo-img';
                            duoUl.className = 'duo-ul';
                            duoImg.setAttribute('src',result.params.image);

                            var arr = result.params.items;
                            for(var i in arr){
                                var duoLi = doc.createElement('li');          
                                var duoLiHead = doc.createElement('div');     
                                var duoLiImg = doc.createElement('img'); 

                                duoLi.className = 'duo-li';
                                duoLiHead.className = 'duo-li-head';
                                duoLiImg.className = 'duo-li-img';

                                duoLiHead.innerHTML = arr[i].title;
                                duoLiImg.setAttribute('src',arr[i].image);
                                duoLi.appendChild(duoLiHead);
                                duoLi.appendChild(duoLiImg);
                                duoUl.appendChild(duoLi);
                            }

                            replyContent.appendChild(duoImg);
                            replyContent.appendChild(duoUl);
                        }
                    }
                });
                
            }
        });
       
    });

    //保存
    $('.save').on('click',function(){
        var input = document.querySelector('.keywords-input').value;
        var inputOld = document.querySelector('.keywords-input-old').value;

        //判断关键词是否为空
        if(input == ''){
            alert('请输入关键词！');
            return false;
        }

        //回复内容是否为空
        if(replyContent.innerHTML == ''){
            alert('请选择素材');
            return false;
        }
        var dataItem = replyContent.getAttribute('data-item');

        $.ajax({
            url:'openapi.php?act=weixin_addReply',
            data:{
                keyword: input,
                up_keyword: inputOld,
                matchType:'clear',
                infoId: dataItem
            },
            type:'post',
            dataType:"json",
            success: function(data){

                window.location.href =  'index.php?ctl=weixin/keyword&act=index';
                
            }
        });
       
    });
    //取消
    $('.cancle').on('click',function(){
        window.location.href =  'index.php?ctl=weixin/keyword&act=index';
    });

    module.exports = {
        init: function(){

        }
    }
});