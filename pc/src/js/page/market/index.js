define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $page = $('.page-market-index');
    var $listWrap = $page.find('.list-wrap');

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'渠道名称' },
                { text:'渠道识别码' },
                { text:'更新时间' },
                { text:'操作', width:'200px'}
            ]
        },
        ajaxData:{ model: 'market/promotiontype' },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var id = item.market_id || '';
                var title = item.title || '';
                var referer = item.referer || '';
                arr1.push(title);
                arr1.push(referer);
                arr1.push(item.update_time || '');
                arr1.push('<a class="mr20" href="index.php?ctl=market/promotiontype&act=addMarketData&p[0]=' + id + '">生成推广链接</a><a class="mr20 js-add-link" data-referer="' + referer + '" data-title="' + title + '" data-id="' + id + '" href="javascript:;">编辑</a><a class="js-del" data-id="' + id + '" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //新增拼团
    $page.on('click', '.js-add-link', function(){
        var id = $(this).data('id') || '';
        var title = $(this).data('title') || '';
        var referer = $(this).data('referer') || '';

        if(!id){
            base.ajax({
                url:'openapi.php?act=get_promotiontype_referer',
                type:'post',
                success: function(result1){
                    result1 = result1 || {};
                    if(result1.res == 'succ'){
                        referer = (result1.result && result1.result.referer) || '';
                        create();
                    }
                }
            })
        } else {
            create();
        }

        function create(){
            var htmls = [];
            htmls.push('<div class="p30 f12 g-add-link">');
            htmls.push('<div class="ui-block ui-block-align-c pb5 pl50"><p class="w100 tr">渠道名称：</p><input class="ui-input" name="title" value="' + title + '" type="text" placeholder="请添加渠道" maxlength="10" /></div>');
            htmls.push('<div class="ui-block ui-block-align-c pb5 pl50"><p class="w100 tr"></p><p class="ui-color2">最多10个字</p></div>');
            htmls.push('<div class="ui-block ui-block-align-c pb5 pl50"><p class="w100 tr">渠道识别码：</p><input class="ui-input" name="referer" value="' + referer + '" type="text" maxlength="8" /></div>');
            htmls.push('<div class="ui-block ui-block-align-c pl50"><p class="w100 tr"></p><p class="ui-color2 tl">已随机生成识别码，可自定义修改，<br />仅限于数字和字母，最多8个字</p></div>');
            htmls.push('</div>');

            var dialog = new base.Dialog({
                content:htmls.join(''),
                style:{ padding:'0'},
                headerTxt:'新增 / 编辑推广渠道',
                btnOkTxt:'保存',
                okCallback: function(){
                    dialog.saveThrough = false;
                    var data = {
                        title: ($('.g-add-link').find('input[name=title]').val()),
                        referer: ($('.g-add-link').find('input[name=referer]').val())
                    };
                    if(data.title == ''){
                        new base.promptDialog({str:'请填写渠道名称', time:2000});
                        return false;
                    }
                    if(data.referer == ''){
                        new base.promptDialog({str:'请填写渠道识别码', time:2000});
                        return false;
                    }

                    base.ajax({
                        url:('openapi.php?act=' + (id ? 'update' : 'save')),
                        type:'post',
                        data:{id:id, model: 'market/promotiontype', data: data},
                        success: function(result){
                            result = result || {};
                            if(result.res == 'succ'){
                                new base.promptDialog({str:(result.msg || '成功'), time:2000});
                                dialog.remove();
                                table.ajax({refresh: true});
                            } else {
                                new base.promptDialog({str:(result.msg || '失败'), time:2000});
                            }
                        }
                    })

                }
            });
        }
    });

    //删除
    $listWrap.on('click', '.js-del', function(){
        var id = $(this).data('id') || '';
        ajaxFn(id, '确定删除吗？');
    });

    function ajaxFn(id, content){
        var dialog = new base.Dialog({
            content:content,
            okCallback: function(){
                dialog.saveThrough = false;
                base.ajax({
                    url:'openapi.php?act=delete',
                    type:'post',
                    data:{ id:id,  model: 'market/promotiontype'  },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '成功'), time:2000});
                            dialog.remove();
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '失败'), time:2000});
                        }
                    }
                })
            }
        })
    }

    module.exports = {
        init: function(){}
    }
});

