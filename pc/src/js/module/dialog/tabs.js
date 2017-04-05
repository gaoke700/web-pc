// /**
//  * Created by tiangaoke on 2017/2/22.
//  */
define(function (require, exports, module) {

    function Tabs(opts){
        this.opts = $.extend(true, [{
                tabName:'标题1',
                tabContent:'',
                showBtn:false,
                okCallback:null,
                cancelCallback:null,
                tabClickFn:function(){
                    console.log('tab'+$(this).index());
                }
            },
            {
                tabName:'标题2'

            }], opts||[]);
        this.init();
    }

    Tabs.prototype.constructor = Tabs;

    Tabs.prototype.renderHtml= function(opts){
        opts = opts||{};
        var isNone = 'none';
        var isActive = '';
        var tabNames=``;
        var tabContents=``;
        var hasClicked = '';

        var okBtns = '';

        opts.forEach(function(e,i){
            // console.log($(e));
            if(i==0){
                isNone='';
                isActive = 'active';
                hasClicked = 'has-clicked';
            }else{
                isNone = 'none';
                isActive = '';
                hasClicked = '';
            }
            tabNames+=`<li class="tab tab${i} ${isActive} ${hasClicked}">${e.tabName}</li>`;
            tabContents+=`<li class="content content${i} ${isNone}">${e.tabContent||''}</li>`;
        });

        if(opts[0].showBtn){
            okBtns=`<div class="btns ui-flex ui-flex-pack-2">
                        <div class="ui-btn ui-btn-c-1 js-btn-save mr40">保存</div>
                        <div class="ui-btn js-btn-cancel">取消</div>
                    </div>`;
        }

        var html=`
            <div class="g-dialog-tabs">
                <div class="tabs">
                    <ul>${tabNames}</ul>
                    <span class="close-icon iconss iconss-close"></span>
                </div>
                <div class="contents">
                    <ul>${tabContents}</ul>
                </div>
                ${okBtns}
            </div>`.trim();
        this.parentHtml = new base.Dialog({
           showHeader: false,
           showBtn: false,
           content: html,
           customContent:true
        });
        this.event();
    };

    Tabs.prototype.init = function(){
        this.renderHtml(this.opts);
    };

    Tabs.prototype.event = function(){
        this.opts[0].tabClickFn && this.opts[0].tabClickFn();

        var _this=this;
        $('.g-dialog-tabs .tab').on('click',function(){

            $('.g-dialog-tabs .tab').removeClass('active');
            $(this).addClass('active');

            if(!$(this).hasClass('has-clicked')){
                $(this).addClass('has-clicked');
                _this.opts[$(this).index()].tabClickFn && _this.opts[$(this).index()].tabClickFn();
            }
            $('.g-dialog-tabs .content').addClass('none');
            $('.g-dialog-tabs .content'+$(this).index()).removeClass('none');

        });
        $('.g-dialog-tabs .close-icon').on('click',function(){
            _this.parentHtml.remove();
        });
        $('.g-dialog-tabs .js-btn-cancel').on('click',function(){
            _this.opts[0].cancelCallback && _this.opts[0].cancelCallback();
            _this.parentHtml.remove();
        });
        $('.g-dialog-tabs .js-btn-save').on('click',function(){
            _this.opts[0].okCallback && _this.opts[0].okCallback();
            _this.parentHtml.remove();
        });

    };

    module.exports = Tabs;
});
