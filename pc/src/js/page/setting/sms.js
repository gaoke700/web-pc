define(function (require, exports, module) {
    var UiTable = require('../../module/ui-table.js');
    var UiRadioSlide = require('../../module/ui-radio-slide.js');

    var $page = $('.page-sms');
    var $smsList = $page.find('.sms-list');
    var $smsSet = $page.find('.sms-set');

    if(pageSms.view){
        $smsSet.show();
        smsSetFn();
    } else {
        $smsList.show();
        smsListFn();
    }

    function smsListFn(){
        var $smsListWrap = $smsList.find('.sms-list-wrap');

        function render(){
            base.ajax({
                url:'openapi.php?act=smsSetting',
                type:'post',
                success: function(data){
                    data = data || {};
                    var result = data.result || {};
                    if(data.res == 'succ'){
                        renderTable(result.smsTemplates || []);
                    }
                }
            });
        }
        render();

        function renderTable(data){
            $smsListWrap.html('');
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var isOpen = String(item.status || 0);
                var id = item.id || '';
                arr1.push(item.name || '');
                arr1.push(item.typeName || '');
                arr1.push(item.content || '');
                arr1.push('<div class="table-use" data-id="' + id + '" data-status="' + isOpen + '"></div>');
                arr.push(arr1);
            });
            var table = new UiTable({
                parent:$smsListWrap,
                headConfig:[
                    { text:'模版名称', width:'200px' },
                    { text:'发送对象', width:'100px' },
                    { text:'模版内容' },
                    { text:'是否开启', width:'130px' }
                ],
                bodyHtml: arr,
                renderItemCallback: function(){
                    $('.table-use').each(function(i,item){
                        var uiRadioSlide = new UiRadioSlide({
                            status:($(item).data('status') == '1' ? 'on' : 'off'),
                            clickCallback:function(obj){
                                var value = obj.status == 'on' ? 0 : 1;
                                var id=item.dataset.id;
                                setStatus(id, value, function(result){
                                   if(result.res && result.res == 'succ'){
                                       new base.promptDialog({str:(result.msg || '修改成功'), time:2000});
                                       render();
                                   } else {
                                       new base.promptDialog({str:(result.msg || '修改失败'), time:2000});
                                   }
                                });
                            }
                        });
                        $(this).append(uiRadioSlide.parent);
                    });
                }
            });
        }
    }

    function smsSetFn(){
        //短信签名设置
        (function(){
            var span=$('.sms-msg-name');
            $('.message-name').on('input',function(){
                span.html($(this).val());
            })
        })();

        //保存
        (function(){
            $('.btn-save').on('click',function(){
                $.ajax({
                    url:'openapi.php?act=setSmsContent',
                    type:'post',
                    data:{
                        smsSign:$('.message-name').val(),
                    },
                    dataType:'json',
                    success:function(json){
                        var res=json.res;
                        if(res=='succ'){
                            new base.promptDialog({str:(json.msg || '保存成功'), time:2000});
                        }else{
                            new base.promptDialog({str:(json.msg || '保存失败'), time:2000});
                        }
                    }
                })
            });
        })();
    }

    //开启，关闭post
    function setStatus(type, value, callback){
        base.ajax({
            url:'openapi.php?act=setSmsTemplateConfig',
            type:'post',
            data:{
                smsTemplateId: type,
                status: value
            },
            success: function(data){
                data = data || {};
                callback(data);
            }
        })
    }

    module.exports = {
        init: function(){}
    }
});

