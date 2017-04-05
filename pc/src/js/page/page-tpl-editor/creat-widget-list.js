define(function (require, exports, module) {
    //  渲染右侧组件列表

    var $ = MJQ;
    var ComponentConfig = require('../../component/components.js').ComponentConfig;

    function render(){
        var htmlsInfinity = [], htmlsOne = [];
        $.each(ComponentConfig, function(i, item){
            if(!item.sign) return false;
            var useNum = item.useNum||'infinity';
            var name = item.name || item.sign;
            var tpl = '<div class="btn-drag btn-drag-default" data-class="icons-' + item.iconName + '" data-name="' + name + '" data-sign="' + item.sign + '" data-use-num="' + useNum + '"><span class="icons-' + item.iconName + '"></span></div>';
            useNum == 'infinity' ? htmlsInfinity.push(tpl) : htmlsOne.push(tpl);
        });
        return {
            htmlsInfinity: htmlsInfinity.join(' '),
            htmlsOne: htmlsOne.join(' ')
        };
    };

    function append($dragInfinity, $dragOne){
        var data = render();
        $dragInfinity.html(data.htmlsInfinity);
        $dragOne.html(data.htmlsOne);
    };

    module.exports = append;
});