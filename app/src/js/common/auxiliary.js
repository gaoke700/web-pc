define(function (require, exports, module) {
    var dialog=require('js/common/plug/dialog.js');
    var loading=base.loading();

    var isPc=base.utils.isPc();
    //如果是pc
    if(isPc){
        [].slice.call(document.querySelectorAll('.g-footer-nav a')).forEach(function(v,i){
            if(i!=0){
                v.removeAttribute('href');
                v.onclick=function(){
                    dialog.dialogPrompt1({content:'请在手机中扫码操作'});
                    return false;
                }
            }
        })
    }
    //客服
    function customService(){
        var btn=[].slice.call(document.querySelectorAll('.customer-server'));
        if(btn.length>0){
            btn.forEach(function(v){
                v.addEventListener('click',function(){
                    if(isPc){
                        return false;
                    }
                    if(this.dataset.set=='1'){
                        location.href=this.dataset.url;
                    }else if(this.dataset.set=='0'){
                        dialog.dialogPrompt1({content:'掌柜还未设置客服'});
                    }else{
                        require.async(['js/component/attached/CustomerService.js'],function(CustomerService){
                            new CustomerService();
                        })
                    }
                })
            });
        }
    }

    //开店
    function openStore(){
        var btn=[].slice.call(document.querySelectorAll('.open-store'));
        if(btn.length>0){
            btn.forEach(function(v){
                v.addEventListener('click',function(){
                    if(isPc){
                        return false;
                    }
                    loading.show();
                    require.async(['js/component/attached/DistributionShop.js'],function(DistributionShop){
                        new DistributionShop({success:function(){loading.hide();}});
                    })
                })
            });
        }
    }

    //微信相关
    function wxAbout(){
        var con=document.querySelector('#data-wx');
        if(!con){//如果没有开启微信模式
            console.log('没有开启微信分享模式');
            return false;
        }
        console.log('开启微信分享模式');
        var dataWX=JSON.parse(con.innerHTML);
        var wx_title=dataWX.wx_title;
        var wx_desc=dataWX.wx_desc;
        var wx_imgUrl=dataWX.wx_imgUrl;
        var wx_link=dataWX.wx_link;
        wx.config({
            debug:false,
            appId:dataWX.wx_appid,
            timestamp:dataWX.timestamp,
            nonceStr:dataWX.nonceStr,
            signature:dataWX.signature,
            jsApiList:[
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });
        wx.ready(function(){
            wx.onMenuShareAppMessage({
                title: wx_title,
                desc: wx_desc,
                link: wx_link,
                imgUrl: wx_imgUrl,
                success: function () {
                    share_count();
                }
            });
            // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareTimeline({
                title: wx_title,
                link: wx_link,
                imgUrl: wx_imgUrl,
                success: function () {
                    share_count();
                }
            });
            // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareQQ({
                title: wx_title,
                desc: wx_desc,
                link: wx_link,
                imgUrl: wx_imgUrl,
                success: function () {
                    share_count();
                }
            });
            // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
            wx.onMenuShareWeibo({
                title: wx_title,
                desc: wx_desc,
                link: wx_link,
                imgUrl: wx_imgUrl,
                success: function () {
                    share_count();
                }
            });
            //$('.storeHeader-poa').on('click', function(){
            //    wx.scanQRCode({
            //        needResult: 1,
            //        desc: 'scanQRCode desc',
            //        success: function (res) {
            //            $('body').html(JSON.stringify(res));
            //        }
            //    });
            //});
        });
        var share_count=function(){
            var url = dataWX.url;
            var params = {};
            $.ajax({
                url:url,
                type:'post',
                success:function(res){
                    console.log(res);
                }
            });
        }
    }

    //地理位置
    function positioning(){
        if(!base.utils.getCookie('S[position]')){
            var script=document.createElement('script');
            var arr=[
                '7GPBZ-QGBKR-7G4W2-WERUU-T5S3E-6ZBUW',
                'UWDBZ-VMBLK-FDIJZ-ABI6K-FC7CE-K4FIL',
                'YXQBZ-2PDWQ-PO65B-GHH4L-2WKQH-OBF4W',
                'UEOBZ-L2V3F-AJVJQ-JWVDA-YDKXQ-XZF3Q',
                'LNHBZ-VANW3-ZWS3U-3FYES-3AHOK-PHBBI',
                'MIABZ-LHKWQ-AO65F-GCBJK-MN7QK-G4B3Z',
                '2WHBZ-3RDKK-GKIJZ-ADY6D-B2TCE-H2BCD',
            ];
            var length=arr.length-1;
            var romdom=Math.round(Math.random()*length);
            var key=arr[romdom];
            script.src='https://3gimg.qq.com/lightmap/components/geolocation/geolocation.min.js';
            document.body.appendChild(script);
            script.addEventListener('load',function(){
                var geolocation = new qq.maps.Geolocation(key, "myapp");
                geolocation.getLocation(function(position){
                    var iPos = position.lat + ',' + position.lng;
                    base.utils.setCookie('S[position]', iPos);
                });
            });
        }
    }

    //页面性能统计
    function performanceFn(opts){
        window.addEventListener('load', function(){
            var data = {};
            data.siteUrl = window.location.href;
            data.phoneType = base.utils.getPhoneType();
            var performance = window.performance || {};
            var timing = performance.timing || {};
            for(var i in timing){
                if(typeof timing[i] != 'function'){
                    data[i] = timing[i];
                }
            }
            var getEntries = performance.getEntries() || [];
            data.getEntries = [];
            getEntries.forEach(function(value, index){
                data.getEntries.push({
                    name:(value.name || ''),
                    duration: (value.duration || '')
                });
            });

            if(base.utils.isWeixin()){
                wx.ready(function(){
                    wx.getNetworkType({
                        success: function (res) {
                            data.networkType = res.networkType || '';
                            base.ajax({
                                url:'openapi.php?act=mstore_front_visit',
                                type:'post',
                                data:data,
                                success: function(data){
                                }
                            });
                        }
                    });
                });
            } else {
                base.ajax({
                    url:'openapi.php?act=mstore_front_visit',
                    type:'post',
                    data:data,
                    success: function(data){
                    }
                });
            }
        });
    }

    exports.customService = customService;
    exports.openStore = openStore;
    exports.wxAbout = wxAbout;
    exports.positioning = positioning;
    exports.performance = performanceFn;
});
