define(function (require, exports, module) {
    function Export(opts){
        var data = $.extend(true, {
            filter:{
                checkboxData: [], allData:[], name:''
            },
            form: {
                action:'', data:{}
            }
        }, opts||{});

        var result = data.filter.checkboxData;
        if(result.length <= 0) {
            new base.promptDialog({str:'请先选择需要操作的数据', time:2000});
            return false;
        }
        var exportData = [];
        if(result.length == 1 && result[0] == 'all'){
            //全部导出
            exportData = result;
        } else {
            $.each(result, function(i, item){
                exportData.push(data.filter.allData[item][data.filter.name] || '');
            });
        }
        var form = $("<form></form>");
        form.attr("action", data.form.action);
        form.attr("method", "post");
        form.append($("<input type='text' name='" + data.filter.name + "' value='" + exportData + "' />"));
        for(var i in data.form.data){
            form.append($("<input type='text' name='" + i + "' value='" + (base.utils.isJson(data.form.data[i]) ? (JSON.stringify(data.form.data[i])) : data.form.data[i]) + "' />"));
        }

        form.appendTo(document.body).submit();
    };
    module.exports = Export;
});
