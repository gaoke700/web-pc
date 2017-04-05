//店铺(模板)装修列表页面
define(function (require, exports, module) {
    module.exports = {
        init: function () {
            var pageParent = $('.page-shop-decoration-list');
            var tableParent = $('.page-mstore-list');
            var Table = require('../../module/table.js');
            var UiRadioSlide = require('../../module/ui-radio-slide.js');
            var renderTableObj=null;

            //两个弹窗
            //new base.Dialog({content:'内容',okCallback:function(){}});
            //base.promptDialog({str:`删除失败:${json.msg}`,time:2000});


            //待续...删除...搜索

            //渲染功能
            var renderPower={
                //初始化
                init:function(){
                    this.del();
                    this.search();
                    this.createPage();
                },
                //新建
                createPage:function(){
                    $('.page-new-temp').on('click',function(){
                        $.ajax({
                            url:'openapi.php?act=savePage',
                            type:'post',
                            data:{
                                type:'custom'
                            },
                            dataType:'json',
                            success:function(data){
                                if(data.res=='succ'){
                                    window.location.href=`index.php#ctl=template/module&act=toAddModule&page_id=${data.result.page_id}&surl=${pageShopdecorationlist.surl}`;
                                }else{
                                    base.promptDialog({str:`创建失败:${data.msg}`,time:2000});
                                }
                            }
                        })
                    });
                },
                //删除  index.php?ctl=template/module&act=deleteHtmlTpl   html_tpl_id
                del:function(){
                    tableParent.on('click','.page-table-del',function(){
                        var $this=$(this);
                        var html_tpl_id=$this.data('html_tpl_id');
                        new base.Dialog({
                            content:'删除后将无法恢复，是否继续删除?',
                            btnOkTxt:'删除',
                            okCallback:function(){
                                $.ajax({
                                    url:'index.php?ctl=template/module&act=deletePage',
                                    type:'post',
                                    data:{
                                        page_id:html_tpl_id
                                    },
                                    dataType:'json',
                                    success:function(json){
                                        if(json.res=='succ'){
                                            base.promptDialog({str:`删除成功`});
                                            renderTable();
                                        }else{
                                            base.promptDialog({str:`删除失败:${json.msg}`,time:2000});
                                        }
                                    }
                                })
                            },
                        });
                    })
                },
                //预览
                view:function(){
                    $('.page-table-view').each(function(i, item){
                        var src = $(this).data('view') || '';
                        var url = $(this).data('url') || '';
                        var html = '';
                        html += '<div class="p5">';
                        html += '<img style="display: block; width: 120px; height: 120px; margin: 0 auto 15px;" src="' + src + '" />';
                        html += '<div class="ui-block ui-block-align-c"><p class="pr10">扫一扫，手机预览</p><a class="ui-btn ui-btn-c-1" href="' + (url||'javascript:;') + '" target="_blank">PC预览</a></div>';
                        html += '</div>';

                        new base.Popover({
                            obj: $(item),
                            parent:pageParent,
                            content: html,
                            arrowPos: 'right',
                            placement:2,
                            event: 'hover'
                        });
                    });

/*
                    $('.page-table-view').each(function(i, item){
                        var src=$(this).data('view');
                        var html=`
                            <div style="width: 160px;height: 160px;"><img width="100%" height="100%" src="${src}" alt=""></div>
                        `;
                        new base.Popover({
                            obj: $(item),
                            parent:pageParent,
                            content: html,
                            arrowPos: 'right',
                            placement:2,
                            event: 'hover'
                        });
                    });
*/
                },
                //搜索
                search:function(){
                    pageParent.on('click','.page-btn-search',function(){
                        var val=$(this).parents('.ui-search').find('input').val();
                        renderTableObj.ajax({
                            select: {
                                name: val,
                            }
                        });
                    });
                }
            };
            //渲染表格
            function renderTable(){
                tableParent.html('');
                renderTableObj=new Table({
                    parent: tableParent,
                    tableConfig: {
                        headConfig: [
                            { text: '自定义页面ID', },
                            { text: '名称', },
                            { text: '描述', },
                            { text: '创建时间', },
                            { text: '更新时间', sort: true, name: 'update_time', },
                            { text: '操作', width:'150px' }
                        ]
                    },
                    ajaxData: {
                        model: 'template/page',
                    },
                    renderItemFn: function (data) {
                        console.log(data);
                        var arr=[];
                        data.forEach(function(v){
                            var delHTML=``;
                            var mr='';
                            if(!v.showDelete){//模板没有被使用
                                delHTML=`<a class="page-table-del" href="javascript:;" data-html_tpl_id="${v.page_id}">删除</a>`;
                                mr='mr20';
                            }
                            arr.push([
                                `${v.page_id}`,
                                `${v.name}`,
                                `${v.description}`,
                                `${v.create_time}`,
                                `${v.update_time}`,
                                `
                                    <div class="page-table-opt">
                                        <a class="page-table-view mr20" data-view="${v.preview}" data-url="${v.pcPreviewUrl}" href="javascript:;">预览</a>
                                        <a class="page-table-edit ${mr}" href="${v.edit}&surl=${pageShopdecorationlist.surl}">编辑</a>
                                        ${delHTML}
                                    </div>
                                `,
                            ])
                        });
                        return arr;
                    },
                    renderItemCallback:function(){
                        renderPower.view();
                    }
                });
            }
            renderTable();
            renderPower.init();
        }
    }
});