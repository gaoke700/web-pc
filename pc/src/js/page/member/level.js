define(function (require, exports, module) {
    var Table = require('../../module/table.js');

    var $pageMemberLevel = $('.page-member-level');
    var $levelWrap = $pageMemberLevel.find('.level-wrap');

    //创建表格列表
    var LevelTable = new Table({
        parent:$levelWrap,
        tableConfig:{
            headConfig:[
                { text:'', width:'100px' },
                { text:'会员卡名称'},
                { text:'基础权益'},
                { text:'卡片等级值'},
                { text:'领取条件'},
                { text:'领取人数'},
                { text:'更新时间'},
                { text:'操作', width:'120px'}
            ]
        },
        ajaxData:{ model: 'member/level' },
        renderItemFn: function(data){
            var arr = [];
            $.each(data, function(i, item){
                var arr1 = [];
                var morenStr = ['<a class="js-level-set-default" data-id="' + (item.member_lv_id || '') + '" href="javascript:;">设为默认</a>', '<span class="default mr10">默认</span><i style="cursor: pointer;" class="js-btn-preview ui-color1 iconss iconss-duoqudaotuiguang"></i>'];
                arr1.push(morenStr[(item.default_lv||0)]);
                arr1.push(item.name || '');
                arr1.push(item.dis_count || '');
                arr1.push(item.card_rate || 0);
                arr1.push(item.upfilter || '');
                arr1.push((item.member_num || 0) + '人<a class="ml10" href="index.php?ctl=member/member&act=index&_ajax&lvid=' + (item.id || '') + '">查看会员</a>');
                arr1.push(item.create_time || '');
                arr1.push('<a href="index.php?ctl=member/level&act=edit_level&member_lv_id=' + (item.member_lv_id || '') + '">编辑</a><a data-id="' + (item.id || '') + '" class="ml30 js-level-remove" href="javascript:;">删除</a>');
                arr.push(arr1);
            });
            return arr;
        },
        renderItemCallback: function(){
            var html = '';
            html += '<div class="level-list-preview">';
            html += '<p class="pb5 tc">扫一扫，分享页面领取会员卡</p>';
            html += '<img style="display: block; width: 120px; height: 120px; margin: 0 auto;" src="' + pageMemberLevel.qrCode + '" />';
            html += '<div class="ui-block ui-block-align-c pt20"><input type="text" class="ui-input " value="' + pageMemberLevel.cardUrl + '" /><div class="ui-btn ui-btn-c-1 ui-btn-w-1 ml10 js-copy-share-url">复制</div></div>';
            html += '</div>';
            var popover = new base.Popover({
                obj: $levelWrap.find('.js-btn-preview'),
                parent:$levelWrap,
                content: html,
                arrowPos: 'left',
                placement:1,
                event: 'hover'
            });
            $(popover).on('createEnd', function(){
                $levelWrap.one('click', '.level-list-preview .js-copy-share-url', function(){
                    var val = $levelWrap.find('.level-list-preview input').val();
                    if(val!==undefined&&val!==''){
                        $levelWrap.find('.level-list-preview input').select();
                        document.execCommand("Copy");
                        new base.promptDialog({str:'复制成功'});
                    }
                });

            });
        }
    });

    $levelWrap.on('click', '.js-level-remove', function(){
        var id = $(this).data('id');
        if(!id){ return false; }
        new base.Dialog({
            content:'确定删除？',
            okCallback: function(){
                removeCard(id);
            }
        });
    });

    $levelWrap.on('click', '.js-level-set-default', function(){
        setDefault($(this).data('id'));
    });

    //删除会员卡
    function removeCard(id){
        if(!id){ return false;}
        base.ajax({
            url:'openapi.php?act=delete',
            type:'post',
            data:{
                model:'member/level',
                id: id
            },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:'删除成功'});
                    LevelTable.ajax({refresh: true});
                } else {
                    new base.promptDialog({str:(data.msg||'删除失败')});
                }
            }
        })
    }

    //设为默认
    function setDefault(id){
        if(!id){ return false;}
        base.ajax({
            url:'openapi.php?act=set_defaultlv',
            type:'post',
            data:{
                model:'member/level',
                member_lv_id: id
            },
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    new base.promptDialog({str:'设为默认成功'});
                    LevelTable.ajax({refresh: true});
                } else {
                    new base.promptDialog({str:(data.msg||'设为默认失败')});
                }
            }
        })
    }

    module.exports = {
        init: function(){}
    }
});

