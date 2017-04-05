define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var UiRadioSlide = require('../../module/ui-radio-slide.js');

    var $page = $('.page-muiltStore-index');
    var $ListWrap = $page.find('.muiltStore-index-wrap');
    var $bar = $page.find('.bar');
    var $muiltStoreListWrap = $page.find('.muiltStore-list-wrap');
    var $jsSearchParent = $page.find('.js-search-parent');

    //最顶部的开关
    var TopRadioSlide = new UiRadioSlide({
        checkTxt:{ on:'已开启门店', off:'已关闭门店' },
        status:(pageMuiltStoreIndex.switch == 1 ? 'on' : 'off'),
        clickCallback:function(obj){
            function change(){
                var value = obj.status == 'on' ? '1' : '0';

                setStatus('store', (Math.abs(value-1)) , '', function(result){
                    if(result.res && result.res == 'succ'){
                        window.location.href = window.location.href;
                    }
                });
            }
            if(obj.status == 'on'){
                new base.Dialog({
                    content:'关闭后，关闭后，微商城页面将不展示门店信息，<br />会员也无法到店自提订单，是否继续？',
                    okCallback: function(){
                        change();
                    }
                })
            } else {
                change();
            }
        }
    });
    $bar.find('.switch').append(TopRadioSlide.parent);

    showPage();

    function showPage(){
        if(pageMuiltStoreIndex.switch){
            //创建表格列表
            var table = new Table({
                parent:$ListWrap,
                tableConfig:{
                    headConfig:[
                        { text:'门店名称' },
                        { text:'门店地址' },
                        { text:'电话号码' },
                        { text:'门店自提' },
                        { text:'操作', width:'130px'}
                    ]
                },
                ajaxData:{
                    data:{ select:{} },
                    model: 'store/muiltStore'
                },
                renderItemFn: function(data){
                    var arr = [];
                    $.each(data, function(i, item){
                        var arr1 = [];
                        var id = item.store_id || '';
                        var isOpen = item.is_open || 0;

                        arr1.push(item.store_name || '');
                        arr1.push(item.store_addr || '');
                        arr1.push(item.store_phone || '');
                        arr1.push('<div class="table-use" data-id="' + id + '" data-status="' + isOpen + '"></div>');
                        arr1.push('<a href="index.php?ctl=muiltStore/muiltStore&act=edit&p[0]=' + id + '&pop=true">编辑</a><a class="ml20 btn-del-one" data-id="' + id + '" href="javascript:;">删除</a>');
                        arr.push(arr1);
                    });
                    return arr;
                },
                renderItemCallback: function(){
                    $('.table-use').each(function(i,item){
                        var id = $(this).data('id') || '';
                        var uiRadioSlide = new UiRadioSlide({
                            checkTxt:{ on:'已开启', off:'已关闭' },
                            status:($(item).data('status') == '1' ? 'on' : 'off'),
                            clickCallback:function(obj){
                                var value = obj.status == 'on' ? '0' : '1';
                                setStatus('take', value, id, function(result){
                                    if(result.res && result.res == 'succ'){
                                        value == '1' ? uiRadioSlide.on() : uiRadioSlide.off();
                                    }
                                });
                            }
                        });
                        $(this).append(uiRadioSlide.parent);
                    });
                }
            });

            //搜索
            $jsSearchParent.on('click', '.js-search-btn', function(){
                table.ajax({
                    select:{
                        store_name: $jsSearchParent.find('.js-search-val').val()
                    }
                });
            });

            //删除操作
            $ListWrap.on('click', '.btn-del-one', function(){
                var id = $(this).data('id') || '';
                new base.Dialog({
                    content:'确定删除吗？',
                    okCallback: function(){
                        base.ajax({
                            url:'openapi.php?act=delete',
                            type:'post',
                            data:{model: 'store/muiltStore', id:id},
                            success: function(data){
                                data = data || {};
                                if(data.res == 'succ'){
                                    new base.promptDialog({str:(data.msg || '删除成功'), time:2000});
                                    table.ajax({refresh: true});
                                } else {
                                    new base.promptDialog({str:(data.msg || '删除失败'), time:2000});
                                }
                            }
                        })
                    }
                })
            });

        } else {
            $muiltStoreListWrap.hide();
            $page.find('.off-text').show();
        }
    }

    //开启，关闭post
    function setStatus(type, value, id, callback){
        base.ajax({
            url:'openapi.php?act=setMuiltStoreStatus',
            type:'post',
            data:{
                set_type:type,      //store 【门店设置】  take【自提】
                set_value: value,       //开店、关闭
                store_id: id
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

