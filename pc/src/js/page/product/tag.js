define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $pageTag = $('.page-tag');
    var $tagWrap = $pageTag.find('.tag-wrap');

    //创建表格列表
    var tagTable = new Table({
        parent:$tagWrap,
        tableConfig:{
            //checkbox: true,
            //radio: true,
            //radioFn: function(data){
            //    console.log(data);
            //},
            headConfig:[
                {
                    text:'标签名称',
                    width:'40%',
                    change: true,
                    changeLen:'10',
                    //changeType: 'number',
                    changeFn: function(data){
                        changeTagName(data || {});
                    }
                },
                { text:'更新时间', sort:true, name:'modify', width:'40%'},
                { text:'操作', width:'20%' }
            ]
        },
        ajaxData:{
            model: 'goods/tag',
            data:{ tag_type:'goods' }
        },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                arr1.push(item.tag_name);
                arr1.push(`<div class="page-time">${item.modify}</div>`);
                arr1.push('<a class="js-remove-tag" data-id="' + (item.tag_id || '') + '" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        }
    });

    $tagWrap.on('click', '.js-remove-tag', function(){
        var id = $(this).data('id');
        if(!id){ return false; }
        new base.Dialog({
            content:'确定删除？',
            okCallback: function(){
                removeTag(id);
            }
        });
    });

    //添加标签
    $pageTag.on('click', '.js-add-tag', function(){
        addTagFn();
    });

    //修改标签名称
    function changeTagName(result){
        base.ajax({
            url:'openapi.php?act=update',
            type:'post',
            data:{
                model:'goods/tag',
                id: (result.data.tag_id || ''),
                data:{
                    tag_name: (result.newStr || '')
                }
            },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    result.succ(true);
                    changeTime(result);
                }
            }
        })
    }

    function changeTime(result){
        //console.log(result);
        base.ajax({
            url:'openapi.php?act=getItem',
            type:'post',
            data:{
                model:'goods/tag',
                id:result.data.id
            },
            success:function(json){
                if(json.res=='succ'){
                    $('.js-remove-tag[data-id='+result.data.id+']').parents('.ui-table-body-item').find('.page-time').html(json.result.modify)
                }
            }
        })
    }

    //删除标签
    function removeTag(id){
        base.ajax({
            url:'openapi.php?act=delete',
            type:'post',
            data:{
                model:'goods/tag',
                id: (id || '')
            },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    tagTable.ajax({refresh: true});
                }
            }
        })
    }

    //添加标签弹窗
    function addTagFn(){
        var addTagHtml = '<div class="g-dialog-add-category page-tag-add"><div class="input-style"><span class="before">标签名称：</span><input class="ui-input" name="add-name" type="text" maxlength="10" /><span class="after">最多10个字</span></div></div>';
        var addDialog = new base.Dialog({
            headerTxt: '添加标签',
            okCallback: function(){
                var value = $('.page-tag-add').find('input[name=add-name]').val();
                addDialog.saveThrough = false;
                base.ajax({
                    url:'openapi.php?act=save',
                    type:'post',
                    data:{
                        model:'goods/tag',
                        data:{
                            tag_name: value,
                            tag_type:'goods'
                        }
                    },
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            addDialog.remove();
                            new base.promptDialog({str:'添加成功'});
                            tagTable.ajax({refresh: true});
                        } else {
                            new base.promptDialog({str:(data.msg || '添加失败'), time:2000});
                        }
                    }
                })
            },
            content: addTagHtml
        });
    }

    module.exports = {
        init: function(){}
    }
});

