window.MJQ = window.MJQ || window.$;
(function (window, $) {
    var base = window.base = {};

    base.ajax = function (opts) {
        var options = {
            type: 'get',
            url: '',
            data: {},
            dataType: 'json',
            async: true,
            success: null,
            error: null,
            complete: null
        };
        
        $.extend(options, (opts || {}));
        if (!options.url) return false;
        var progress = setTimeout(function(){
            base.promptDialog({
                str:'<div class="g-loading g-loading2"><div></div><div></div><div></div><div></div><div></div></div>',
                time:100000,
                showTime:false
            });
        },100);
        var complete = options.complete;
        options.complete = function(data){
            clearTimeout(progress);
            if($('.g-dialog-container').length>0){
                $('.g-dialog-container').remove();
            }
            complete && complete();
        }
        $.ajax(options);
    };

    base.utils = {
        toFixed: function (value, num) {
            num = num || 2;
            var multiple = Math.pow(10, y);

            var f = Number(value);
            if (isNaN(f)) {
                return false;
            }
            var f = Math.floor(value * multiple) / multiple;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + num) {
                s += '0';
            }
            return s;
        },
        toArrary: function (obj) {
            if (!obj) return false;
            if (obj instanceof Array) {
                return obj;
            } else if (base.utils.isJson(obj)) {
                obj = base.jsonToArray(obj);
                return obj;
            } else {
                var arr = [];
                arr.push(obj);
                return arr;
            }
        },
        getUploadUrl: function (file) {
            var url = null;
            if (window.createObjectURL != undefined) {
                url = window.createObjectURL(file);
            } else if (window.URL != undefined) {
                url = window.URL.createObjectURL(file);
            } else if (window.webkitURL != undefined) {
                url = window.webkitURL.createObjectURL(file);
            }
            return url;
        },
        getImgSize: function (url, callback) {
            var img = new Image();
            img.src = url;

            // 如果图片被缓存，则直接返回缓存数据
            if (img.complete) {
                callback({w: img.width, h: img.height});
            } else {
                // 完全加载完毕的事件
                img.onload = function () {
                    callback({w: img.width, h: img.height});
                }
            }
        },
        parseUrl: function (str) {
            var arr, part, url = {};
            if (!(str || '').replace(/^\s+|\s+$/, '')) {
                return {};
            }
            str = str.substring(1, str.length);
            if (str) {
                arr = str.split('&');
                for (var i = 0; i < arr.length; i++) {
                    part = arr[i].split('=');
                    url[part[0]] = part[1];
                }
            }
            return url;
        },
        getUrlObj: function () {
            return base.utils.parseUrl(location.search || location.hash);
        },
        addParam: function (opts) {
            if (!opts || !opts.url || !opts.params || !(opts.params instanceof Array)) {
                console.log('出错');
                return false;
            }

            var url = opts.url, params = opts.params, paramStr = '';

            for (var i = 0; i < params.length; i++) {
                paramStr += '&' + (params[i].key || '') + '=' + (params[i].value || '');
            }

            url = url.indexOf('?') > -1 ? (url + paramStr) : (url + '?' + paramStr);
            return url;
        },
        setParam: function (opts) {
            if (!opts || !opts.url || !opts.param) {
                console.log('出错');
                return false;
            }

            var url = opts.url, param = opts.param, paramStr = '', urlSearch, urlArr, num = 0;

            var qIndex = url.indexOf('?');

            if (qIndex <= -1) {
                paramStr = base.utils.addParam({
                    url: url,
                    params: [{key: (param.key || ''), value: (param.value || '')}]
                });
                return paramStr;
            }

            urlSearch = url.substring(qIndex + 1);
            urlArr = urlSearch.split('&');

            for (var i = 0; i < urlArr.length; i++) {
                urlArr[i] = urlArr[i].split('=');
                if (urlArr[i][0] == (param.key || '')) {
                    num = 1;
                    urlArr[i][1] = param.value || '';
                }
            }

            if (num > 0) {
                for (var i = 0; i < urlArr.length; i++) {
                    urlArr[i] = urlArr[i].join('=');
                }
                return (url.substring(0, (qIndex + 1)) + urlArr.join('&'));
            }

            paramStr = base.utils.addParam({
                url: url,
                params: [{key: (param.key || ''), value: (param.value || '')}]
            });
            return paramStr;
        },
        appendScript: function (opts) {
            if (!opts && !opts.url) return false;
            var arr = opts.url || [];
            for (var i = 0; i < arr.length; i++) {
                var url = arr[i];
                var hasScript = [];
                var aScript = document.querySelectorAll('script');

                for (var j = 0; j < aScript.length; j++) {
                    hasScript.push(aScript[j].getAttribute('src'));
                }

                var scriptIndex = base.utils.inArray(url, hasScript);

                if (scriptIndex <= -1) {
                    var oScript = document.createElement('script');
                    oScript.src = url;
                    document.querySelector('body').appendChild(oScript);
                }
            }
        },
        inArray: function (str, arr) {
            if (!str || !arr) return false;
            var iIndex = -1;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == str) {
                    iIndex = [i];
                }
            }
            return iIndex;
        },
        strlen: function (str) {
            if (!str) return false;
            var len = 0;
            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) ? (len++) : (len += 2)
            }
            return len;
        },
        isJson: function (obj) {
            obj = obj || {};
            var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
            return isjson;
        },
        clearNoNum: function (obj) {
            if (!obj) return false;
            obj.value = obj.value.replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
            obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
            obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');//只能输入两个小数
            if (obj.value.indexOf(".") < 0 && obj.value != "") {//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
                obj.value = parseFloat(obj.value);
            }
        },
        arrayFindkey: function (arr, key, value) {
            //  value可不传，是查json值用的

            if (!(arr && arr instanceof Array && key)) return false;
            var index = -1;
            for (var i = 0; i < arr.length; i++) {
                if (value) {
                    if (arr[i][key] == value) {
                        index = i;
                    }
                } else {
                    if (arr[i] == key) {
                        index = i;
                    }
                }
            }
            return index;
        }
    };

    base.bus = {
        setSidebar3Num: function(opts){
            if(!(opts && opts.model)){ return false;}
            base.ajax({
                url:'openapi.php?act=getViewCount',
                type:'post',
                data:{ model:opts.model},
                success: function(data){
                    data = data || {};
                    if(data.res == 'succ'){
                        var viewCount = (data.result && data.result.viewCount) || [];
                        var $listDom = $('#g-sidebar-3').find('.style-2 a');
                        $listDom.each(function(index, item){
                            var num = viewCount[index] || 0;
                            if($(this).find('.num').length > 0){
                                $(this).find('.num').html(num)
                            } else {
                                $(this).append('<span class="num">' + num + '</span>');
                            }
                        });
                    }
                }
            });
        }
    };

    base.formatDate = function (format, timestamp) {
        var times = new Date(timestamp);
        var date = {
            "M+": times.getMonth() + 1,
            "d+": times.getDate(),
            "h+": times.getHours(),
            "m+": times.getMinutes(),
            "s+": times.getSeconds(),
            "q+": Math.floor((times.getMonth() + 3) / 3),
            "S+": times.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (times.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    };

    base.promptDialog = function (opts) {
        if (!(opts && opts.str)) return false;
        var options = {
            time: 1000,
            str: '',
            showTime: true,
            callback: null
        };
        $.extend(options, opts);
        var timer = null;
        var html = [];
        html.push('<div class="g-dialog-container">');
        html.push('<div class="g-dialog-mask"></div>');
        html.push('<div class="g-prompt-dialog">');
        html.push('<div>');
        html.push('<div>' + options.str + '</div>');
        if (options.showTime) {
            html.push('<p class="g-prompt-dialog-time">' + (options.time / 1000) + 'S后关闭</p>');
        }
        html.push('</div>');
        html.push('</div>');
        html.push('</div>');


        var $promptDialog = $(html.join(''));
        $('body').append($promptDialog);

        timer = setInterval(function () {
            options.time = options.time - 1000;
            $promptDialog.find('.g-prompt-dialog-time').html((options.time / 1000) + 'S后关闭');
            if (options.time <= 0) {
                clearInterval(timer);
                $promptDialog.remove();
                if (options.callback && typeof options.callback == 'function') {
                    options.callback();
                }
            }
        }, 1000);
        //
        //setTimeout(function(){
        //    $promptDialog.remove();
        //    if(options.callback && typeof options.callback == 'function'){
        //        options.callback();
        //    }
        //}, options.time)
    };

    base.loadingDialog = function () {

        var loading = new base.Dialog({
            content: '<div style="padding: 20px;">保存中</div>',
            showHeader: false,
            showBtn: false,
            customContent: true
        });

        return {
            off: function () {
                loading.remove();
            }
        }
    };

    base.uploadImg = function (opts) {
        if (!(opts && opts.img && opts.url)) return false;
        opts.success = opts.success || null;

        var oFormData = new FormData();
        oFormData.append('img', opts.img);
        $.ajax({
            url: opts.url,
            type: "POST",
            data: oFormData,
            processData: false,
            contentType: false,
            success: function (result) {
                result = result || {};
                try {
                    result = JSON.decode ? JSON.decode(result) : JSON.parse(result);
                } catch (e) {
                    result = e;
                }
                if (opts.success && (typeof opts.success == 'function')) {
                    opts.success(result);
                }
            }
        });
    };

    base.jsonToArray = function (opts) {
        opts = opts || {};
        var arr = [];

        for (var i in opts) {
            arr.push(opts[i]);
        }
        return arr;
    };

    base.loadCss = function (opts) {
        var url = opts.url || '';
        var fn = opts.callback || null;
        if (!url) {
            return false
        }
        ;
        if (!(fn && typeof fn == 'function')) return false;
        var $head = opts.parent || $('head');
        var node = document.createElement('link');
        node.rel = 'stylesheet';
        node.href = url;
        $head.append(node);
        if (node.attachEvent) {
            node.attachEvent('onload', function () {
                fn(null, node)
            });
        } else {
            setTimeout(function () {
                poll(node, fn);
            }, 0); // for cache
        }
        function poll(node, callback) {
            var isLoaded = false;
            if (/webkit/i.test(navigator.userAgent)) {//webkit
                if (node['sheet']) {
                    isLoaded = true;
                }
            } else if (node['sheet']) {// for Firefox
                try {
                    if (node['sheet'].cssRules) {
                        isLoaded = true;
                    }
                } catch (ex) {
                    // NS_ERROR_DOM_SECURITY_ERR
                    if (ex.code === 1000) {
                        isLoaded = true;
                    }
                }
            }
            if (isLoaded) {
                setTimeout(function () {
                    callback(null, node);
                }, 1);
            } else {
                setTimeout(function () {
                    poll(node, callback);
                }, 10);
            }
        }

        node.onLoad = function () {
            fn(null, node);
        }
    };

    base.Dialog = Dialog;

    function Dialog(options) {
        this.opts = {
            showMask: true,
            showHeader: true,
            showBtn: true,
            style: {},
            btnOkTxt: '确定',
            btnCancelTxt: '取消',
            headerTxt: '提示',
            type: 'confirm',   //alert, confirm
            cancelCallback: null,
            okCallback: null,
            content: '',
            customContent: false,
            closeCallback: function () {
            }
        };
        this.saveThrough = true;
        $.extend(this.opts, options);

        var scrollTop = $(window).scrollTop();
        this.isScroll = false;
        var _this = this;
        $(window).scroll(function () {
            !_this.isScroll && $(this).scrollTop(scrollTop);
        });

        this.createEle();
    }

    Dialog.prototype.createEle = function () {
        var htmls = [], showMask, showHeader, showBtn, btnHtml, contentHtml, _this = this;
        this.containerEle = $('<div class="g-dialog-container"></div>');

        showMask = this.opts.showMask ? '<div class="g-dialog-mask"></div>' : '';
        showHeader = this.opts.showHeader ? '<div class="g-dialog-header"><p class="title">' + this.opts.headerTxt + '</p><span class="close g-btn-cancel"><i class="iconss iconss-close"></i></span></div>' : '';

        if (this.opts.type == 'alert') {
            btnHtml = '<div class="g-btn-default g-btn-ok" style="margin-right: 0;">' + this.opts.btnOkTxt + '</div>';
        } else {
            btnHtml = '<div class="g-btn-default g-btn-cancel">' + this.opts.btnCancelTxt + '</div><div class="g-btn-default g-btn-ok">' + this.opts.btnOkTxt + '</div>';
        }

        showBtn = this.opts.showBtn ? ('<div class="g-dialog-btn">' + btnHtml + '</div>') : '';
        contentHtml = this.opts.customContent ? this.opts.content : ('<div class="g-dialog-content-default" style="' + (this.opts.style && this.opts.style.padding ? ('padding:' + this.opts.style.padding + ';' ) : '') + '">' + this.opts.content + '</div>');

        htmls.push(showMask);
        htmls.push('<div class="g-dialog-wrap">');
        htmls.push(showHeader);
        htmls.push('<div class="g-dialog-content"></div>');
        htmls.push(showBtn);
        htmls.push('</div>');

        this.containerEle.html(htmls.join(''));
        this.containerEle.find('.g-dialog-content').append(contentHtml);
        $('body').append(this.containerEle);
        this.containerEle.on('click', '.g-btn-cancel', function () {
            _this.remove();
            if (_this.opts.cancelCallback && (typeof _this.opts.cancelCallback == 'function')) {
                _this.opts.cancelCallback();
            }
        });

        this.containerEle.on('click', '.g-btn-ok', function () {
            if (_this.opts.okCallback && (typeof _this.opts.okCallback == 'function')) {
                _this.opts.okCallback();
            }
            if (!_this.saveThrough) {
                return false;
            }
            _this.remove();
        });
    };

    Dialog.prototype.remove = function () {
        this.isScroll = true;
        $(this.containerEle).remove();
        this.opts.closeCallback();
    };

    return base;

})(window, MJQ);

(function (window, $) {
    $(document).on('click', '.c-select', function (e) {
        var $that = $(this);
        var $title = $that.find('.c-select-title');
        var $optionsWrap = $that.find('.c-select-option-wrap');
        var $option = $that.find('.c-select-option');

        if ($optionsWrap.is(":hidden")) {
            $optionsWrap.show();
        }

        $option.on('click', function (e) {
            $(this).siblings('.active').removeClass('active');
            $(this).addClass('active');
            var value = $(this).data('value');
            $that.data('value', value);
            $title.find('p').html($(this).html());
            $optionsWrap.hide();
            e.stopPropagation();
        });

        $(document).one("click", function () {
            $optionsWrap.hide();
        });
        e.stopPropagation();
    });
    $('body').on('input', '.ui-textarea-wrap textarea, .ui-textarea-wrap input', function () {
        var _this = $(this);
        var maxLen = $(this).data('maxlen');
        var $p = $(this).next('p');
        var value = $(this).val();
        var len = Math.ceil(base.utils.strlen(value) / 2);
        $p.html((len > maxLen ? maxLen : len) + '/' + maxLen);
        $(this).on('blur', function () {
            if (len > maxLen) {
                _this.val(subStr(value, maxLen));
            }

            function subStr(str, len) {
                var xx = '';
                for (var i = 0; i < str.length; i++) {
                    xx = str.substr(0, str.length - i);
                    if (Math.ceil(base.utils.strlen(xx) / 2) <= len) {
                        break;
                    }
                }
                return xx;
            }
        });
    });

    if ($('body').find('#g-sidebar-2').length >= 1) {
        $('body').addClass('g-ui-body-bar-2');
        $('body').removeClass('g-ui-body-bar-1');
    } else {
        $('body').removeClass('g-ui-body-bar-2');
        $('body').addClass('g-ui-body-bar-1');
    }

})(window, MJQ);
