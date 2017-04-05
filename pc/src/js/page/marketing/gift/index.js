define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    var UiRadioSlide = require('../../../module/ui-radio-slide.js');

    var $page = $('.page-gift-index');
    var $listWrap = $page.find('.list-wrap');
    var $bar = $page.find('.bar');

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text: ('<p class="tl w pl10">' + (pageGiftIndex.view ? '收礼人心意' : '送礼人心意') + '</p>') },
                { text:'操作', width:'120px'}
            ]
        },
        ajaxData:{
            data:{
                view:pageGiftIndex.view
            },
            model: 'promotion/giftWords'
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.id || '';
                var title = item.title || '';
                arr1.push('<p class="tl w pl10">' + title + '</p>');
                arr1.push('<a class="mr20 js-edit-one" data-title="' + title + '" data-id="' + id + '" href="javascript:;">编辑</a><a class="js-del-one" data-id="' + id + '" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    var uiRadioSlide = new UiRadioSlide({
        appendDom: $bar.find('.switch'),
        append: true,
        status:Number(pageGiftIndex.switch),
        clickCallback:function(obj){
            var status = obj.status2;
            new base.Dialog({
                content:(status ? '确定关闭吗？' : '确定开启吗？'),
                btnOkTxt:(status ? '确定关闭' : '确定开启'),
                okCallback: function(){
                    changeSwitch(Math.abs(status-1), function(){
                        status ? uiRadioSlide.off() : uiRadioSlide.on();
                    });
                }
            });
        }
    });

    //删除
    $listWrap.on('click', '.js-del-one', function(){
        var id = $(this).data('id') || '';
        var dialog = new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                dialog.saveThrough = false;
                changeListAjax('delete', {
                    model:'promotion/giftWords',
                    id:id
                }, function(){
                    dialog.remove();
                });
            }
        });
    });

    //编辑
    $listWrap.on('click', '.js-edit-one', function(){
        var id = $(this).data('id') || '';
        var title = $(this).data('title') || '';

        var type = pageGiftIndex.view || 0;
        var dialog = new base.Dialog({
            headerTxt:'添加 / 编辑心意',
            content:dialogHtml(type, title),
            style:{ padding: '0'},
            okCallback: function(){
                dialog.saveThrough = false;
                changeListAjax('update', {
                    model:'promotion/giftWords',
                    id:id,
                    data:{
                        title:dialog.containerEle.find('textarea[name=title]').val()
                    }
                }, function(){
                    dialog.remove();
                });
            }
        });
    });

    //添加
    $page.on('click', '.js-add', function(){
        var type = pageGiftIndex.view || 0;
        var dialog = new base.Dialog({
            headerTxt:'添加 / 编辑心意',
            content:dialogHtml(type, ''),
            style:{ padding: '0'},
            okCallback: function(){
                dialog.saveThrough = false;
                changeListAjax('save', {
                    model:'promotion/giftWords',
                    data:{
                        type:(type ? 'collect' : 'give'),
                        title:dialog.containerEle.find('textarea[name=title]').val()
                    }
                }, function(){
                    dialog.remove();
                });
            }
        });
    });

    function changeSwitch(val, callback){
        base.ajax({
            url:'openapi.php?act=giftWordsSetConfig',
            type:'post',
            data:{ status:val },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '成功'), time:2000});
                    callback(data);
                } else {
                    new base.promptDialog({str:(data.msg || '失败'), time:2000});
                }
            }
        })
    }

    function dialogHtml(type, val){
        var htmls = [];
        htmls.push('<div class="f12"><div class="p30">');
        htmls.push('<div class="ui-block"><p class="w80 pr10 tr">' + (type ? '收礼人心意：' : '送礼人心意：') + '</p>');
        htmls.push('<div class="ui-textarea-wrap"><textarea name="title" data-maxLen="20" class="ui-textarea w300 h100" placeholder="请填写心意">' + (val || '') + '</textarea><p class="ui-textarea-wrap-text">' + (base.utils.strlen(val)/2) + '/20</p></div>');
        htmls.push('</div>');
        htmls.push('</div></div>');
        return htmls.join('');
    };

    function changeListAjax(type, data, callback){
        base.ajax({
            url:('openapi.php?act=' + type),
            type:'post',
            data:data,
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:(data.msg || '成功'), time:2000});
                    table.ajax({refresh: true});
                    callback();
                } else {
                    new base.promptDialog({str:(data.msg || '失败'), time:2000});
                }
            }
        });
    };

    module.exports = {
        init: function(){}
    }
});

