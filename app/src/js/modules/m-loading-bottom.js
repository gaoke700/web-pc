/*加载更多的底部加载中*/
define(function (require, exports, module){
    function LoadingBottom(){
        this.render();
    }
    LoadingBottom.prototype.render=function(){
        this.parentDom=document.createElement('div');
        this.parentDom.classList.add('m-loading-bottom');
        document.body.appendChild(this.parentDom);
    };
    LoadingBottom.prototype.show=function(){
        this.parentDom.innerHTML=`
            <div class="m-loading-bottom-show">
                <div class="m-loading-bottom-tip">
                    <div class="m-loading-bottom-tip-line"></div>
                    <div class="m-loading-bottom-tip-txt">加载中</div>
                    <div class="m-loading-bottom-tip-line"></div>
                </div>
            </div>
        `;
        this.parentDom.classList.add('show');
    };
    LoadingBottom.prototype.hide=function(){
        this.parentDom.classList.remove('show');
    };
    LoadingBottom.prototype.over=function(){
        this.parentDom.innerHTML=`
            <div class="m-loading-bottom-over">
                <div class="m-loading-bottom-tip">
                    <div class="m-loading-bottom-tip-line"></div>
                    <div class="m-loading-bottom-tip-txt">没有更多数据</div>
                    <div class="m-loading-bottom-tip-line"></div>
                </div>
            </div>
        `;
        this.parentDom.classList.add('show');
    };
    module.exports = LoadingBottom;
});