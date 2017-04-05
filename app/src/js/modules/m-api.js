/**
 * Created by zhouhuafei on 2017/1/9.
 */

define(function (require, exports, module){
    module.exports = {
        //加入购物车的接口
        cartAdd:{
            url:'index.php?ctl=carts&act=add',
            type:'post',
            data:{
                name:'product_id',
                num:'num'
            }
        },
        //图片上传
        inputUploadImg:{
            url:'index.php?ctl=module&act=newPic',
            type:'post'
        }
    };
});