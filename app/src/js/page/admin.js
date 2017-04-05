/**
 * Created by zhangzhigang on 2016/9/12.
 */
define(function (require, exports, module) {

    module.exports = {
        init: function(opts){
            opts = opts || {};
            if(!opts.sign){
                console.log('缺少sign');
                return ;
            }

            var sign = opts.sign;

            var componentLoader = require('js/component/component-loader.js');
            var componentLoaderData = {
                signs:[sign],
                data:{}
            };
            componentLoaderData.data[sign] = [{data:opts}];
            componentLoader(componentLoaderData);
        }
    }
});