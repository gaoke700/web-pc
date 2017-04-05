define(function (require, exports, module) {
    var DragPlugin = {};

    //检测拖动元素是否在规定的范围内
    DragPlugin.isDivCoincidence = function(obj1, obj2){
        var L1 = obj1.offset().left;
        var R1 = obj1.offset().left + obj1.outerWidth();
        var T1 = obj1.offset().top;
        var B1 = obj1.offset().top + obj1.outerHeight();

        var L2 = obj2.offset().left;
        var R2 = obj2.offset().left + obj2.outerWidth();
        var T2 = obj2.offset().top;
        var B2 = obj2.offset().top + obj2.outerHeight();
        if( R1>L2&&L1<R2 && B1>T2&&T1<B2){
            return true;
        } else {
            return false;
        }
    };

    DragPlugin.isDivCoincidence2 = function(obj1, obj2){
        var L1 = obj1.offset().left;
        var R1 = obj1.offset().left + obj1.outerWidth();
        var T1 = obj1.offset().top;
        var B1 = obj1.offset().top + obj1.outerHeight();

        var L2 = obj2.offset().left;
        var R2 = obj2.offset().left + obj2.outerWidth();
        var T2 = obj2.offset().top + MJQ("#main").scrollTop();
        var B2 = obj2.offset().top + obj2.outerHeight() + MJQ("#main").scrollTop();
        if( R1>L2&&L1<R2 && B1>T2&&T1<B2){
            return true;
        } else {
            return false;
        }
    };

    //检测最近元素
    DragPlugin.findNearObj = function(obj, objArr){
        var value = 9999;
        var index = -1;
        for(var i=0; i<objArr.length; i++){
            if( DragPlugin.isDivCoincidence(obj, objArr.eq(i)) ){
                var c = DragPlugin.distance(obj, objArr.eq(i));
                if(c < value){
                    value = c;
                    index = i;
                }
            }
        }

        if(index != -1){
            return index;
        } else {
            return false;
        }
    };

    //求两点之间的距离
    DragPlugin.distance = function(obj1, obj2){
        var a = obj1.offset().left - obj2.offset().left;
        var b = obj1.offset().top - obj2.offset().top;
        return Math.sqrt(a*a + b*b);
    };

    module.exports = DragPlugin;
});