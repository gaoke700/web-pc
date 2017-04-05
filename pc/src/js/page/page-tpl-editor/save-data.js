define(function (require, exports, module) {

    var $ = MJQ;

    var saveData = {};

    function post(opts){
        opts = opts || {};

        var defaultOpt = {
            type: 'post',
            url : '',
            async: true,
            data: {},
            success: null,
            error: null
        };

        $.extend(defaultOpt, opts);
        base.ajax({
            type:defaultOpt.type,
            url: defaultOpt.url,
            async: defaultOpt.async,
            data: defaultOpt.data,
            success: function(result){
                result = result || {};
                if(result.res && result.res == 'succ'){
                    if(defaultOpt.success && (typeof defaultOpt.success == 'function')) defaultOpt.success(result);
                } else {
                    if(defaultOpt.error && (typeof defaultOpt.error == 'function')) defaultOpt.error(result);
                }

            },
            error: function(result){
                result = result || {};
                if(defaultOpt.error && (typeof defaultOpt.error == 'function')) defaultOpt.error(result);
            }
        });
    };

    //保存单个组件数据
    saveData.widget = function(opts){
        opts = opts || {};
        var urlStr = ( opts.update || false ) ? 'updateModule' : 'saveModule';
        post({
            url: ('index.php?ctl=template/module&act=' + urlStr),
            data: opts.data||{},
            success: opts.success,
            error: opts.error
        });
    };

    //保存页面组件排序以及信息
    saveData.page = function(opts){
        opts = opts || {};
        post({
            url: 'index.php?ctl=template/module&act=updatePage',
            data: opts.data||{},
            async: false,
            success: opts.success,
            error: opts.error
        });
    };


    module.exports = saveData;
});