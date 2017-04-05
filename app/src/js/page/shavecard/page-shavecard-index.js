define(function (require, exports, module) {
    var Wipe = require('js/common/plug/wipe.js');
    var Dialog = require('js/common/plug/dialog.js');
    var $pageShavecardIndex = $('.page-shavecard-index');
    var $canvasWrap = $pageShavecardIndex.find('.canvas-wrap');
    var $ongoing = $pageShavecardIndex.find('.ongoing');
    var jiangliData = {};
    var jiangliStr = {
        score: '获得店铺积分',
        member_card: '获得一张会员卡',
        coupon: '获得一张优惠劵',
        score_error: '您的积分不足',
        times_error: '您的抽奖次数不足',
        lv_error: '等级不够',
        end: '无效活动',
        nologin: '没有登录'
    };

    //中奖名单滚动
    function zjScroll(){
        var $zjList = $pageShavecardIndex.find('.zj-list');
        var $zjListTextWrap = $zjList.find('.text-wrap');
        var $zjListUl1 = $zjList.find('.ul1');
        var $zjListUl2 = $zjList.find('.ul2');
        //$zjList.find('.text-wrap2').css({
        //    width:$zjListUl1.width()*2
        //});
        $zjListUl2.html($zjListUl1.html());
        setInterval(function(){
            var left = $zjListTextWrap.scrollLeft();
            if(left - $zjListUl2.offset().width >= 0){
                left-=$zjListUl1.offset().width;
                $zjListTextWrap.scrollLeft(left);
            }
            else{
                left++;
                $zjListTextWrap.scrollLeft(left);
            }
        },30);
    }

    //刮刮卡请求数据
    function wipeTouchStart(){
        /*
        * nologin：没有登录
        * end：无效活动
        * lv_error：等级不够
        * times_error：您的抽奖次数不足
        * score_error：您的积分不足
        * fail：很遗憾，您与奖品擦肩而过
        * score：中积分
        * member_card：中会员卡
        * coupon：中优惠券
        * */
        if(!actId){ return false; }
        var $num = $ongoing.find('.ongoing-tip .num');
        $num.html($num.html()-1);
        base.ajax({
            url: '?ctl=shaveCard&act=doLottery&act_id=' + actId,
            type:'get',
            dataType: 'json',
            success: function(result){
                result = result || {};
                if(result.res && result.res == 'succ'){
                    var data = result.result || {};
                    jiangliData = {
                        type:data.type || '',
                        data:data.data || {}
                    };
                    if(jiangliData.type == 'fail' || jiangliData.type == 'score' || jiangliData.type == 'member_card' || jiangliData.type == 'coupon'){
                        var htmls = '';
                        if(jiangliData.type == 'fail'){
                            htmls = '<p class="jx-text" style="color: #7f8285;">很遗憾，您与奖品擦肩而过</p><div class="btn btn2 js-refresh-page">继续玩</div>';
                        } else {
                            htmls = '<p class="jx-text">恭喜您！<span>' + jiangliStr[jiangliData.type] + '</span></p><div class="btn js-show-jiangli">立即查看</div>';
                        }
                        var $ongoingContent = $ongoing.find('.ongoing-content');
                        $ongoingContent.find('.text').remove();
                        $ongoingContent.find('.ongoing-content-jl').html(htmls);
                    } else {
                        window.location.href = window.location.href;
                    }
                }
            }
        });
    };

    //中奖弹窗
    function prizeDialog(jlType){
        var html = [];
        var type = jlType || jiangliData.type;
        var data = jiangliData.data || {};
        if(!type){ return false; }

        html.push('<div class="page-shavecard-index-dialog2">');
        html.push('<p class="p1">恭喜您' + jiangliStr[type] + '</p>');
        if(type == 'score'){
            html.push('<div class="jf-wrap"><p class="name">' + shopName + '</p><p class="jf-num"><span>' + data.nums + '</span>积分</p><p class="text">使用说明：积分可在订单中抵扣现金也可在积分商城兑换商品</p></div>');
        } else if(type == 'member_card'){
            html.push('<div class="hyk-wrap"><p>' + shopName + '</p></div>');
        } else if(type == 'coupon'){
            html.push('<div class="yhj-wrap">');
            html.push('<div class="num-wrap"><p class="name">' + shopName + '</p><p class="num">￥<span>' + data.price + '</span></p></div>');
            html.push('<p class="tj">使用时间：' + data.begin_time.substring(0,10).replace(/\-/g, '.') + '-' + data.end_time.substring(0,10).replace(/\-/g, '.') + '</p>');
            html.push('<p class="tj">使用条件：' + data.continue + '</p>');
            html.push('</div>');
        }
        html.push('</div>');

        new Dialog.Dialog({
            content:html.join(''),
            btnOkTxt: '再刮一次',
            btnCancelTxt: '立即使用',
            customContent: true,
            okCallback: function(){
                window.location.href = window.location.href;
            },
            cancelCallback: function(){
                window.location.href = data.url || '/';
            }
        });
    };

    //不能抽奖的
    function noWipeDialog(type){
        if(!type){ return false; }

        var htmls = [];
        var typeStr = {
            score_error: { img:'img-jf', btnText: '去赚积分' },
            times_error: { img:'img-num', btnText: '赢取机会' },
            lv_error: { img:'img-hy', btnText: '去升级' }
        };

        htmls.push('<div class="page-shavecard-index-dialog1">');
        htmls.push('<p class="p1">' + jiangliStr[type] + '</p>');
        htmls.push('<p class="name">' + shopName + '</p>');
        if(type == 'score_error' || type == 'times_error' || type == 'lv_error'){
            htmls.push('<div class="img ' + typeStr[type].img + '"></div>');
        }
        htmls.push('</div>');

        new Dialog.Dialog({
            content: htmls.join(''),
            btnOkTxt: (typeStr[type] && typeStr[type].btnText || '好的'),
            btnCancelTxt: '知道了',
            customContent: true,
            okCallback: function(){
                window.location.href = '/';
            }
        });

    }

    //刮刮卡操作
    function wipeFn(){
        new Wipe({
            id: 'canvas-wrap',
            cover: $pageShavecardIndex.find('.gjimg').attr('src'),
            width: $canvasWrap.width(),
            height: $canvasWrap.height(),
            drawPercentCallback: function(percent){
                if(percent && percent > 50){
                    $canvasWrap.css({opacity:0});
                    setTimeout(function(){
                        $canvasWrap.remove();
                    }, 600);
                }
            },
            eTouchstart: function(){
                wipeTouchStart();
            }
        });

        $pageShavecardIndex.on('click', '.js-refresh-page', function(){
            window.location.href = window.location.href;
        });

        $pageShavecardIndex.on('click', '.js-show-jiangli', function(){
            prizeDialog();
        });
    }

    zjScroll();
    if(jiangliStatus){
        noWipeDialog(jiangliStatus);
    } else {
        wipeFn();
    }

    module.exports = {
        init: function(){

        }
    }
});

