/**
 * Created by zhangzhigang on 2017/3/9.
 */
(function($){
    function showNotice(showId){
        var $notice = $('<div class="notice-wrap w800 h500 pl20 pr20 f12" style="overflow-y: auto;"></div>');
        var noticHtml = '';
        var noticeListData = [];

        new base.Dialog({
            headerTxt:'通知',
            showBtn: false,
            customContent: true,
            content:$notice
        });

        base.ajax({
            url:'openapi.php?act=notice_list',
            type:'post',
            success: function(data){
                data = data || {};
                if(data.res == 'succ'){
                    var result = data.result || {};
                    noticeListData = result.notices || [];
                    noticHtml = getList(result);
                    if(showId){
                        var showIdIndex = base.utils.arrayFindkey(noticeListData, 'id', showId);
                        if(showIdIndex > -1){
                            renderDetail(showIdIndex);
                        } else {
                            new base.promptDialog({str:'找不到该通知', time:2000, callback: function(){
                                $notice.html(noticHtml);
                            }});
                        }
                    } else {
                        $notice.html(noticHtml);
                    }
                } else {
                    new base.promptDialog({str:(data.msg || '加载失败'), time:2000});
                }
            }
        });

        $notice.on('click', '.js-notice-detail', function(){
            var id = $(this).data('id') || '';
            var index = $(this).data('index') || '';
            renderDetail(index);
        });

        $notice.on('click', '.js-return-list', function(){
            $notice.html(noticHtml);
        });

        function getList(data){
            var notices = data.notices || [];
            if( notices.length <= 0){
                return '<p class="tc pt50">暂无数据</p>';
            }
            var htmls = [];
            htmls.push('<div class="ui-block ui-border-b pt10 pb10 pr5 pl5">共<span class="pl5 pr5 ui-color3">' + (data.count || 0) + '</span>条信息</div>');
            $.each(notices, function(i, item){
                htmls.push('<div data-index="' + i + '" data-id="' + (item.id || '') + '" class="js-notice-detail ui-block ui-border-b pt10 pb10 pr5 pl5" style="cursor: pointer;">');
                htmls.push('<div class="pr30">' + (item.is_read ? '' : '<p class="ui-color3 pb5">NEW</p>') + '<p>' + base.formatDate('yyyy-MM-dd', (item.sendtime*1000)) + '</p></div>');
                htmls.push('<div style="-webkit-box-flex: 1;"><p class="ui-h2 pb5">' + (item.title || '') + '</p><p class="ui-ellipsis-1">' + (item.subContent || '') + '</p></div>');
                htmls.push('</div>');
            });

            return htmls.join('');
        }
        function renderDetail(index){
            var htmls = [];
            htmls.push('<div class="notice-detail pt20" style="height: 420px; overflow-y: auto;"><div><div><div><div>' + (noticeListData[index].content || '') + '</div></div></div></div></div>');
            htmls.push('<div class="pt20 pb10 ui-block ui-block-pack-2"><div class="mr20 ui-btn ui-btn-c-2 js-return-list">返回列表</div>');
            htmls.push('<div class="mr20 ui-btn ui-btn-c-2 ui-btn-w-1 js-notice-detail" data-index="' + (index-1) + '">上一条</div>');
            htmls.push('<div class="mr20 ui-btn ui-btn-c-2 ui-btn-w-1 js-notice-detail" data-index="' + (index+1) + '">下一条</div></div>');
            $notice.html(htmls.join(''));
        };
    };
    base.showNotice = showNotice;
    $('html').on('click', '#g-sidebar-1 .g-js-show-more-notice', function(){
        base.showNotice();
    })
})(MJQ);