define(function (require, exports, module) {
    var Table = require('../../module/table.js');
    var UiRadioSlide = require('../../module/ui-radio-slide.js');

    var $page = $('.page-admin-index');
    var $adminListWrap = $page.find('.admin-list-wrap');
    var $adminSearchWrap = $page.find('.admin-search-wrap');

    var searchData = { type:'', val:'' };
    var table;

    pageAdminIndex.view ? roleFn() : employeeFn();

    //员工列表
    function employeeFn(){
        table = new Table({
            parent:$adminListWrap,
            tableConfig:{
                headConfig:[
                    { text:'员工帐号' },
                    { text:'员工姓名' },
                    { text:'角色（数量）' },
                    { text:'开启状态'},
                    { text:'操作', width:'120px'}
                ]
            },
            ajaxData:{
                data:{ select:searchData },
                model: 'admin/employee'
            },
            renderItemFn: function(data){
                var arr = [];
                $.each(data, function(i, item){
                    var arr1 = [];
                    var id = item.id || '';
                    var isOpen = String(item.status || 0);
                    arr1.push(item.phone || '');
                    arr1.push(item.name || '');
                    arr1.push(item.role || '');
                    var payType = item.pay_type || '';
                    arr1.push('<div class="table-use" data-id="' + id + '" data-status="' + isOpen + '"></div>');
                    arr1.push('<a href="index.php#ctl=admin/employee&act=edit&p[0]=' + id + '">编辑</a><a data-type="employee" data-id="' + id + '" class="ml20 js-del-one" href="javascript:;">删除</a>');
                    arr.push(arr1);
                });
                return arr;
            },
            renderItemCallback: function(){
                $('.table-use').each(function(i,item){
                    var id = $(this).data('id') || '';
                    var uiRadioSlide = new UiRadioSlide({
                        status:($(item).data('status') == '1' ? 'on' : 'off'),
                        clickCallback:function(obj){
                            var value = obj.status == 'on' ? 0 : 1;
                            setStatus(id, value, function(result){
                                if(result.res && result.res == 'succ'){
                                    new base.promptDialog({str:(result.msg || '修改成功'), time:2000});
                                    table.ajax({refresh: true});
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

    //角色列表
    function roleFn(){
        table = new Table({
            parent:$adminListWrap,
            tableConfig:{
                headConfig:[
                    { text:'角色名称' },
                    { text:'操作'}
                ]
            },
            ajaxData:{
                data:{ select:searchData },
                model: 'admin/roles'
            },
            renderItemFn: function(data){
                var arr = [];
                $.each(data, function(i, item){
                    var arr1 = [];
                    var id = item.role_id || '';
                    arr1.push(item.role_name || '');
                    arr1.push('<a href="index.php#ctl=admin/roles&act=edit&p[0]=' + id + '">编辑</a><a data-type="role" data-id="' + id + '" class="ml20 js-del-one" href="javascript:;">删除</a>');
                    arr.push(arr1);
                });
                return arr;
            }
        });
    }

    //删除
    $adminListWrap.on('click', '.js-del-one', function(){
        var id = $(this).data('id') || '';
        var type = $(this).data('type') || 'employee';
        var data = {};
        var url = '';
        if(type == 'employee'){
            data.employee_id = id;
            url = 'employee_delete';
        } else {
            data.role_id = id;
            url = 'roles_delete';
        }
        new base.Dialog({
            content:'确定删除吗？',
            okCallback: function(){
                base.ajax({
                    url:('openapi.php?act=' + url),
                    type:'post',
                    data:data,
                    success: function(data){
                        data = data || {};
                        if(data.res == 'succ'){
                            table.ajax({refresh: true});
                            new base.promptDialog({str:(data.msg || '删除成功'), time:2000});
                        } else {
                            new base.promptDialog({str:(data.msg || '删除失败'), time:2000});
                        }
                    }
                })
            }
        })
    });

    //搜索
    $adminSearchWrap.on('click', '.js-search-btn', function(){
        getSearchData();
        table.ajax({ select:searchData });
    });

    //开启，关闭post
    function setStatus(id, value, callback){
        base.ajax({
            url:'openapi.php?act=set_employee_status',
            type:'post',
            data:{
                employee_id:id,
                status:value
            },
            success: function(data){
                data = data || {};
                callback(data);
            }
        })
    }

    //获取搜索字段
    function getSearchData(){
        searchData.type = pageAdminIndex.view ? 'role_name' : $adminSearchWrap.find('select[name=type]').val();
        searchData.val = $adminSearchWrap.find('input[name=val]').val();
    };

    module.exports = {
        init: function(){}
    }
});

