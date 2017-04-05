define(function (require, exports, module) {
    var $ = MJQ;

    //模版名称、模版分享描述的操作
    function EditorTplName(opts){
        var $parent = opts.parent || null;
        var $btnOk = $parent.find('.btn-ok');
        var $input = $parent.find('input');
        var timer = null;
        var isSave = false;
        var pageAttr = opts.pageAttr || '';
        var postData = {
            html_tpl_id: (opts.htmlTplId||'')
        };

        $.each($input, function(){
            var name = $(this).attr('name');
            var val = $(this).val();
            var inputLen = $(this).data('len');
            var valLen = Math.ceil(base.utils.strlen( val )/2);
            $(this).siblings('.num').html('<span>' + valLen + '</span>/' + inputLen);

            postData[name] = val;
        });

        $input.on('input', function(){
            clearTimeout(timer);
            var text = $(this).data('text');
            var name = $(this).attr('name');
            var val = $(this).val();
            var inputLen = $(this).data('len');
            var valLen = Math.ceil(base.utils.strlen( val )/2);
            var $parent = $(this).parent();

            $(this).siblings('.num').html('<span>' + valLen + '</span>/' + inputLen);

            if(valLen > inputLen){
                $(this).css({'border': '1px solid #e75c45'});
                $parent.find('.t-error, .t-succ').remove();
                $parent.append('<p class="tip t-error" style="padding-top: 5px;"><span>字数超出限制</span></p>');
            } else {
                var $this = $(this);
                if(name == 'name'){
                    timer = setTimeout(function(){
                        base.ajax({
                            type: 'get',
                            url: 'index.php?ctl=template/module&act=checkName',
                            data: {name: val, pageAttr:pageAttr},
                            success: function(result){
                                if(result && result.res && result.res == 'succ'){
                                    $this.css({'border': '1px solid #ddd'});
                                    $parent.find('.t-error, .t-succ').remove();
                                    //$parent.append('<p class="tip t-succ"><i class="icons-tick2"></i><span>真棒！这个' + text + '可以使用～</span></p>');
                                } else {
                                    $this.css({'border': '1px solid #e75c45'});
                                    $parent.find('.t-error, .t-succ').remove();
                                    $parent.append('<p class="tip t-error"><i class="icons-error"></i><span>' + text + '已存在，请修改！</span></p>');
                                }
                            }
                        });
                    }, 500);
                } else {
                    $(this).css({'border': '1px solid #ddd'});
                    $parent.find('.t-error, .t-succ').remove();
                    //$parent.append('<p class="tip t-succ"><i class="icons-tick2"></i><span>真棒！这个' + text + '可以使用～</span></p>');
                };
            }

            postData[name] = val;
        });

        function post(fn){
            if($parent.find('.t-error').length>0){
                return false;
            };

            if(isSave){
                return false;
            }

            isSave = true;
            base.ajax({
                type:'post',
                url: 'index.php?ctl=template/module&act=updateHtmlTpl',
                data: postData,
                success: function(result){
                    result = result || {};
                    if(result && result.res){
                        var str = (result.res == 'succ') ? (result.msg || '保存成功') : (result.msg || '保存失败');
                        base.promptDialog({
                            str:str,
                            time:2000,
                            callback: function(){
                                isSave = false;
                                //$input.attr('disabled', true);
                                fn && fn();
                            }
                        })
                    }
                },
                error: function(){
                    isSave = false;
                }
            })
        };

        $btnOk.on('click', function(){
            post()
        });

        return {
            post: post
        }
    };

    module.exports = EditorTplName;
});
