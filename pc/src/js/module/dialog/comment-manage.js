// /**
//  * Created by tiangaoke on 2017/2/22.
//  */
define(function (require, exports, module) {
//商品详情评论管理
    var UiRadioSlide = require('../ui-radio-slide.js');

    function CommentManage(opts){
        this.opts = $.extend(true, {
            commentId:''
        }, opts||{});
        this.init();
    }

    CommentManage.prototype.constructor = CommentManage;

    CommentManage.prototype.init = function(){

        var _this = this;
        this.ajax({
            url:'openapi.php?act=goodsCommentsDetail',
            data:{ id: _this.opts.commentId},
            callback:function(data){
                _this.renderHtml(data);
            }
        });

    };

    CommentManage.prototype.ajax = function(opts){
        opts = opts || {};
        base.ajax({
            url:opts.url,
            data:opts.data,
            type:'post',
            success: function(result){
                result = result || {};
                if(result.res == 'succ'){
                    opts.callback && opts.callback(result);
                }
            }
        });
    };

    CommentManage.prototype.renderHtml = function(data){
        var data = data.result || {}, _this = this;
        this.data = data;
        var htmls =[];
        this.$comments = $('<div class="g-dialog-goods-comments"></div>');
            htmls.push('<div class="comment-top">');
                htmls.push('<img class="top-left-img" src="'+data.image_default+'">');
                htmls.push('<div class="top-right">');
                    htmls.push('<div>商品名称：<span>'+data.goods_name+'</span></div>');
                    htmls.push('<div>商品编号：<span>'+data.bn+'</span></div>');
                    htmls.push('<div>规格：<span>'+data.addon+'</span></div>');
                    htmls.push('<div>售价：<span>'+data.price+'</span></div>');
                htmls.push('</div>');
            htmls.push('</div>');
            htmls.push('<div class="comment-middle">');

                htmls.push('<div class="comment-degree">好评度：');
                    for(var i=0;i<data.star_num*1;i++){
                        htmls.push('<span class="iconss iconss-star"></span>');
                    }
                htmls.push('</div>');

                htmls.push('<div class="comment-content">评价内容：<span>'+data.details+'</span></div>');
                htmls.push('<div>评价人：<span>'+data.member_name+'</span></div>');
                htmls.push('<div>评价时间：<span>'+data.create_time+'</span></div>');
                htmls.push('<div class="how-to-display">是否显示：<div class="switch pl10"></div></div>');
                // var isDisplay1 = '',isDisplay2 = '';
                // if(data.is_disabled=='0'){
                //     isDisplay1 = 'checked';
                // }else{
                //     isDisplay2 = 'checked';
                // }
                // htmls.push('<div class="how-to-display">是否显示：<label class="ui-radio"><input type="radio" name="radiox" value="0" '+isDisplay1+'><i></i>是</label><label class="ui-radio"><input type="radio" name="radiox" value="1" '+isDisplay2+'><i></i>否</label></div>');
            htmls.push('</div>');

            htmls.push('<div class="comment-bottom">');
                if(data.details_reply && data.details_reply != ''){
                    htmls.push('<div class="reply-content">已回复：<span>'+data.details_reply+'</span></div>');
                }else{
                    htmls.push('<div class="bottom-textarea">');
                        htmls.push('<div class="textarea-wrap"><textarea maxlength="120" class="ui-textarea" placeholder="回复此条评论"></textarea></div>');
                        htmls.push('<div class="number-limit"><span>0</span>/120</div>');
                    htmls.push('</div>');
                    htmls.push('<div class="reply-btn ui-btn ui-btn-c-1 ui-btn-w-1">回复</div>');
                }

            htmls.push('</div>');

        this.dialog = new base.Dialog({
            showBtn: false,
            headerTxt: '商品评论详情',
            content: this.$comments.html(htmls.join('')),
            customContent:true,
            closeCallback:this.opts.closeCallback
        });
        _this.event();
    };

    CommentManage.prototype.event = function(){
        var _this = this;
        this.$comments.on('input', 'textarea', function(){       //字数监控
            $(this).parents('.bottom-textarea').find('.number-limit span').html($(this).val().length);
        });

        var uiRadioSlide = new UiRadioSlide({
            appendDom: _this.$comments.find('.switch'),
            append: true,
            status:Number(_this.data.show || 0),
            clickCallback:function(obj){
                var status = Math.abs(obj.status2 - 1);
                _this.ajax({
                    url:'openapi.php?act=update',
                    data:{
                        model:'goods/comments',
                        id: _this.opts.commentId,
                        data: { show:status }
                    },
                    callback: function(){
                        status ? uiRadioSlide.on() : uiRadioSlide.off();
                    }
                });
            }
        });

        this.$comments.on('click', '.reply-btn', function(){     //回复

            var detailsReply = $(this).parent().find('textarea').val();
            _this.ajax({
                url:'openapi.php?act=update',
                data:{
                    model:'goods/comments',
                    id: _this.opts.commentId,
                    data: {
                        details_reply:detailsReply
                    }
                },
                callback:function (data) {
                    _this.$comments.find('.comment-bottom').html('<div class="reply-content">已回复：<span>'+detailsReply+'</span></div>')
                }
            });
        });
    };

    module.exports = CommentManage;



});
