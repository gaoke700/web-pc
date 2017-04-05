define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $page = $('.page-seller-tag');
    var $listWrap = $page.find('.list-wrap');
    var listData = [];

    var table = new Table({
        parent:$listWrap,
        tableConfig:{
            headConfig:[
                { text:'标签名称' },
                { text:'标签备注' },
                { text:'操作', width:'120px'}
            ]
        },
        ajaxData:{ model: 'member/tags' },
        renderItemFn: function(data){
            var arr = [];
            listData = data;
            $.each(data, function(i, item){
                var arr1 = [];
                var tagId = item.tag_id || '';

                arr1.push(item.tag_name || '');
                arr1.push(item.remark || '');
                arr1.push('<a data-id="' + tagId + '" class="mr20 js-edit" href="javascript:;">编辑</a><a class="js-del" data-id="' + tagId + '" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    //删除
    $listWrap.on('click', '.js-del', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false; }

        var dialog = new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                dialog.saveThrough = false;
                base.ajax({
                    url:'openapi.php?act=delete&model=member/tags',
                    type:'post',
                    data:{ id:id },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '删除成功'), time:2000});
                            dialog.remove();
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '删除失败'), time:2000});
                        }
                    }
                });
            }
        });
    });

    //编辑
    $listWrap.on('click', '.js-edit', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false; }
        var index = base.utils.arrayFindkey(listData, 'tag_id', id);
        var data = [];
        if(index > -1){
            data = listData[index];
        }
        addTag(2, data);
    });

    //新增
    $page.on('click', '.js-add', function(){
        addTag(1);
    });

    function addTag(type, data){
        //type :  1:新增， 2:编辑
        var postData = {
            tag_id:'',
            tag_name:'',
            remark:'',
            style_id:''
        };

        if(data){
            $.extend(postData, data);
        }

        var colorArr = ['#7bc172', '#499e75', '#20aff2', '#2e85db', '#8d499e', '#bc34ba', '#ffcc4e', '#faa346', '#ff7e5d', '#e6453a', '#e53973', '#ff0000'];
        var colorHtml = '';
        $.each(colorArr, function(i, item){
            colorHtml += '<span data-style="' + (i+1) + '" class="f12" style=" cursor: pointer; vertical-align:top; display: inline-block; width: 30px; height: 30px; margin: 0 15px 15px 0; color: #fff; text-align: center; line-height: 30px; background: ' + item + '">' + (i+1 == postData.style_id ? '<i class="iconss iconss-gou"></i>' : '') + '</span>';
        });

        var htmls = [];
        htmls.push('<div class="f12 w500 add-tag-dialog"><div class="p30">');
        htmls.push('<div class="ui-block ui-block-align-c pb20"><p class="w80 pr10 tr">标签名称：</p>');
        htmls.push('<div class="ui-textarea-wrap"><input name="tag_name" data-maxLen="5" class="ui-input w300" type="text" value="' + postData.tag_name + '" /><p class="ui-textarea-wrap-text">' + Math.ceil(base.utils.strlen(postData.val)/2) + '/5</p></div>');
        htmls.push('</div>');
        htmls.push('<div class="ui-block pb20"><p class="w80 pr10 tr pt5">标签备注：</p>');
        htmls.push('<div class="ui-textarea-wrap"><textarea name="remark" data-maxLen="50" class="ui-textarea w300 h100">' + postData.remark + '</textarea><p class="ui-textarea-wrap-text">' + Math.ceil(base.utils.strlen(postData.val2)/2) + '/50</p></div>');
        htmls.push('</div>');
        htmls.push('<div class="ui-block"><p class="w80 pr10 tr pt5">标签色：</p>');
        htmls.push('<div style="font-size: 0; width: 280px; vertical-align: top;" class="tl tag-color">');
        htmls.push(colorHtml);
        htmls.push('</div>');
        htmls.push('</div>');
        htmls.push('</div></div>');

        var dialog = new base.Dialog({
            content:htmls.join(''),
            headerTxt: (type == 1 ? '新增标签' : '编辑标签'),
            style:{ padding:'0'},
            okCallback: function(){
                dialog.saveThrough = false;
                postData.tag_name = $('.add-tag-dialog').find('input[name=tag_name]').val();
                postData.remark = $('.add-tag-dialog').find('textarea[name=remark]').val();

                base.ajax({
                    url:'openapi.php?act=tagSaveData',
                    type:'post',
                    data:postData,
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            new base.promptDialog({str:(data.msg || '操作成功'), time:2000});
                            dialog.remove();
                            table.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '操作失败'), time:2000});
                        }
                    }
                });
            }
        });

        $('.add-tag-dialog').on('click', '.tag-color span', function(){
            $(this).siblings('span').html('');
            $(this).html('<i class="iconss iconss-gou"></i>');
            postData.style_id = $(this).index() + 1;
        });
    };

    module.exports = {
        init: function(){}
    }
});

