define(function (require, exports, module) {
    var Table = require('../../../module/table.js');
    var UiRadioSlide = require('../../../module/ui-radio-slide.js');

    var $page = $('.page-scoremall-index');
    var $listWrap = $page.find('.list-wrap');
    var $bar = $page.find('.bar');

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'积分商品' },
                { text:'积分价格' },
                { text:'积分商品库存' },
                { text:'更新时间' },
                { text:'状态' },
                { text:'操作', width:'120px'}
            ]
        },
        ajaxData:{ model: 'promotion/scoreMallGoods' },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.goods_id || '';

                arr1.push('<p class="tl pl10 pr10 w ui-ellipsis-1">' + (item.goods_name || '') + '</p>');
                arr1.push(item.min_score_desc || '');
                arr1.push(item.max_buy_num || 0);
                arr1.push(item.last_time || '');
                arr1.push(item.marketable || '');
                arr1.push('<a class="mr20" href="index.php?ctl=promotion/scoreMall&act=integralGoods&p[0]=' + id + '">编辑</a><a data-id="' + id + '" class="js-del" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    var uiRadioSlide = new UiRadioSlide({
        appendDom: $bar.find('.switch'),
        append: true,
        status:Number(pageScoremallIndex.switch),
        clickCallback:function(obj){
            var status = obj.status2;
            if(status){
                new base.Dialog({
                    content:'确定关闭吗？',
                    btnOkTxt:'确定关闭',
                    okCallback: function(){
                        changeSwitch(Math.abs(status-1), function(){
                            uiRadioSlide.off();
                        });
                    }
                });
            } else {
                new base.Dialog({
                    content:'<p class="pb10">开启后，积分商城频道将展示在手机店铺“我的积分”中显示</p><p>建议您新增积分商品后再开启。</p>',
                    btnOkTxt:'确定开启',
                    okCallback: function(){
                        changeSwitch(Math.abs(status-1), function(){
                            uiRadioSlide.on();
                        });
                    }
                });
            }
        }
    });

    function changeSwitch(val, callback){
        base.ajax({
            url:'openapi.php?act=turnScoreConfig',
            type:'post',
            data:{
                key:'scoremall',
                status:val
            },
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

    //删除
    $listWrap.on('click', '.js-del', function(){
        var id = $(this).data('id') || '';
        if(!id) { return false; }
        new base.Dialog({
            content:'确定删除吗',
            okCallback: function(){
                base.ajax({
                    url:'openapi.php?act=delete',
                    type:'post',
                    data: { id:id, model:'promotion/scoreMallGoods' },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '操作成功'), time:2000});
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '操作失败'), time:2000});
                        }
                    }
                });
            }
        })
    });

    module.exports = {
        init: function(){}
    }
});

