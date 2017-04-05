define(function (require, exports, module){
    function Search(){}
    Search.prototype.init=function(){
        $(this.parentDOM).on('click','.m-search-cancel,.m-search-return',function(){
            history.go(-1);
        })
    };
    Search.prototype.render=function(callback){
        this.parentDOM=document.createElement('div');
        this.parentDOM.classList.add('m-search');
        this.parentDOM.innerHTML=`<form action="index.php" method="post"><span class="m-search-return"></span><label><input type="text" name="search_keywords" value=""  ><em><button type="submit"><span class="icons icons-search"></span></button></em></label><span class="m-search-cancel">取消</span></form>`;
        this.init();
        callback&&callback(this.parentDOM);
    };
    module.exports = Search;
});