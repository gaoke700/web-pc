define(function (require, exports, module) {

    var $pageIndex = $('.page-index');
    var $shopBasicInfo = $pageIndex.find('.shop-basic-info');
    var $pageIndexL = $pageIndex.find('.page-index-l');
    var $pageIndexR = $pageIndex.find('.page-index-r');
    var $overview = $pageIndexL.find('.overview');

    //仪表盘块
    var $dashboardWrap = $pageIndex.find('.dashboard-wrap');

    //渲染图表
    function renderChart(){
        var $tubiao1 = document.querySelector('.page-index').querySelector('.tubiao1');
        var $tubiao2 = document.querySelector('.page-index').querySelector('.tubiao2');
        var $tubiao3 = document.querySelector('.page-index').querySelector('.tubiao3');
        var tubiao3Opt = { time:7, type:'' };

        function tubiaoSetOption1(data, color1, color2){
            var tubiaoSetOption1 = {
                tooltip: {
                    trigger: 'axis',
                    formatter: "星期{b}:{c}"
                },
                xAxis: [
                    {
                        show:false,
                        type: 'category',
                        boundaryGap: false,
                        data:['一','二','三','四','五','六','日']
                    }
                ],
                yAxis: [
                    {
                        show:false
                    }
                ],
                series: [
                    {
                        name: '订单金额',
                        type: 'line',
                        tooltip: {
                            trigger: 'axis'
                        },
                        smooth: true,
                        symbol: "circle",
                        itemStyle: {
                            normal: {
                                color: color1,
                                lineStyle: {
                                    color: color2
                                },
                                areaStyle: {
                                    color: 'rgba(0, 137, 255, 0)'
                                }
                            }
                        },
                        data: data
                    }
                ]
            };
            return tubiaoSetOption1;
        };

        var tubiao1 = echarts.init($tubiao1);
        var tubiao2 = echarts.init($tubiao2);
        // var tubiao3;
        tubiao1.setOption(tubiaoSetOption1(pageIndex.weeksOrderData, 'rgba(140, 196, 76, 1)', 'rgba(197, 225, 165, 1)'));
        tubiao2.setOption(tubiaoSetOption1(pageIndex.weeksMoneyData, 'rgba(255, 82, 82, 1)', 'rgba(255, 168, 168, 1)'));
        //仪表盘请求数据
        function renderTubiao3(){
            var tubiao3 = echarts.init($tubiao3);
            base.ajax({
                url:'index.php?ctl=report/report&act=getMemberChartData&dayRange=' + tubiao3Opt.time,
                success: function(result){
                    result = result || {};
                    var daily = result.daily || [];
                    $.each(daily, function(i, item){
                        daily[i] = item.substring(5);
                    });
/*
                    tubiao3.setOption({
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis:
                            {
                                splitLine: {
                                    show: true,
                                    interval: 'auto',
                                    lineStyle: {
                                        color: ['#f3f3f3']
                                    }
                                },
                                type: 'category',
                                boundaryGap: false,
                                data: daily,
                                axisLabel:{
                                    //X轴刻度配置
                                    interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                                }
                            },
                        yAxis: [
                            {
                                splitLine: {
                                    lineStyle: {
                                        color: ['#fff']
                                    }
                                },
                                name: '订单数（件）',
                                type: 'value',
                                min: 10,
                                axisLabel:{
                                    interval:0
                                }
                            },
                            {
                                splitLine: {
                                    lineStyle: {
                                        color: ['#f3f3f3']
                                    }
                                },
                                name: '用户数（个）',
                                type: 'value',
                                min: 10,
                                axisLabel:{
                                    interval:0
                                }
                            }
                        ],
                        series: [
                            {
                                name: '订单数',
                                type: 'line',
                                tooltip: {
                                    trigger: 'axis'
                                },
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(0, 137, 255, 1)',
                                        lineStyle: {
                                            color: 'rgba(0, 137, 255, 1)'
                                        },
                                        areaStyle: {
                                            color: 'rgba(0, 137, 255, 1)'
                                        }
                                    }
                                },
                                data: result.order_amount || []
                            },
                            {
                                name: '用户数',
                                type: 'line',
                                tooltip: {
                                    trigger: 'axis'
                                },
                                yAxisIndex: 1,
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(12, 241, 217, 1)',
                                        lineStyle: {
                                            color: 'rgba(12, 241, 217, 1)'
                                        },
                                        areaStyle: {
                                            color: 'rgba(12, 241, 217, 1)'
                                        }
                                    }
                                },
                                data: result.member_num || []
                            }
                        ]
                    });
*/
                    var setOption = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        xAxis: {
                                splitLine: {
                                    show: true,
                                    interval: 'auto',
                                    lineStyle: {
                                        color: ['#f3f3f3']
                                    }
                                },
                                type: 'category',
                                boundaryGap: false,
                                data: daily,
                                axisLabel:{
                                    //X轴刻度配置
                                    interval:0 //0：表示全部显示不间隔；auto:表示自动根据刻度个数和宽度自动设置间隔个数
                                }
                            }
                    };
                    if(tubiao3Opt.type == 'type1'){
                        setOption.yAxis = [
                            {
                                splitLine: {
                                    lineStyle: {
                                        color: ['#f3f3f3']
                                    }
                                },
                                name: '用户数（个）',
                                type: 'value',
                                min: 10,
                                axisLabel:{
                                    interval:0
                                }
                            }
                        ];
                        setOption.series = [
                            {
                                name: '用户数',
                                type: 'line',
                                tooltip: {
                                    trigger: 'axis'
                                },
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(12, 241, 217, 1)',
                                        lineStyle: {
                                            color: 'rgba(12, 241, 217, 1)'
                                        },
                                        areaStyle: {
                                            color: 'rgba(12, 241, 217, 1)'
                                        }
                                    }
                                },
                                data: result.member_num || []
                            }
                        ];
                    } else if(tubiao3Opt.type == 'type2'){
                        setOption.yAxis = [
                            {
                                splitLine: {
                                    lineStyle: {
                                        color: ['#fff']
                                    }
                                },
                                name: '订单金额（元）',
                                type: 'value',
                                min: 10,
                                axisLabel:{
                                    interval:0
                                }
                            }
                        ];
                        setOption.series = [
                            {
                                name: '订单金额',
                                type: 'line',
                                tooltip: {
                                    trigger: 'axis'
                                },
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(0, 137, 255, 1)',
                                        lineStyle: {
                                            color: 'rgba(0, 137, 255, 1)'
                                        },
                                        areaStyle: {
                                            color: 'rgba(0, 137, 255, 1)'
                                        }
                                    }
                                },
                                data: result.order_amount || []
                            }
                        ];
                    } else {
                        setOption.yAxis = [
                            {
                                splitLine: {
                                    lineStyle: {
                                        color: ['#fff']
                                    }
                                },
                                name: '订单金额（元）',
                                type: 'value',
                                min: 10,
                                axisLabel: {
                                    interval: 0
                                }
                            },
                            {
                                splitLine: {
                                    lineStyle: {
                                        color: ['#f3f3f3']
                                    }
                                },
                                name: '用户数（个）',
                                type: 'value',
                                min: 10,
                                axisLabel: {
                                    interval: 0
                                }
                            }
                        ];
                        setOption.series = [
                            {
                                name: '订单金额',
                                type: 'line',
                                tooltip: {
                                    trigger: 'axis'
                                },
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(0, 137, 255, 1)',
                                        lineStyle: {
                                            color: 'rgba(0, 137, 255, 1)'
                                        },
                                        areaStyle: {
                                            color: 'rgba(0, 137, 255, 1)'
                                        }
                                    }
                                },
                                data: result.order_amount || []
                            },
                            {
                                name: '用户数',
                                type: 'line',
                                tooltip: {
                                    trigger: 'axis'
                                },
                                yAxisIndex: 1,
                                smooth: true,
                                itemStyle: {
                                    normal: {
                                        color: 'rgba(12, 241, 217, 1)',
                                        lineStyle: {
                                            color: 'rgba(12, 241, 217, 1)'
                                        },
                                        areaStyle: {
                                            color: 'rgba(12, 241, 217, 1)'
                                        }
                                    }
                                },
                                data: result.member_num || []
                            }
                        ];
                    }
                    tubiao3.setOption(setOption);
                }
            });
        }
        renderTubiao3();

        $dashboardWrap.on('click', '.js-choose-time li', function(){
            $(this).siblings('li').removeClass('active');
            $(this).addClass('active');
            tubiao3Opt.time = $(this).data('len');
            renderTubiao3();
        });

        $dashboardWrap.on('click', '.js-choose-type p', function(){
            var type = $(this).data('type');
            var status = $(this).data('status');
            if(status == 1){
                $(this).data('status', '2');
                tubiao3Opt.type += type;
            } else {
                $(this).data('status', '1');
                tubiao3Opt.type = tubiao3Opt.type.replace(type, '');
            }
            renderTubiao3();
        });

        //短信超出预警
        new JustGage({
            id: "tubiao4",
            value: '45',
            min: 0,
            max: 100,
            width:'550',
            height:'350',
            symbol: "%",
            label: "超出预警数量",
            pointer: !0,
            relativeGaugeSize: !0,
            pointerOptions: {
                toplength: -15,
                bottomlength: 10,
                bottomwidth: 12,
                color: "#00A8C6",
                stroke: "#ffffff",
                stroke_width: 3,
                stroke_linecap: "round"
            },
            gaugeWidthScale: .6,
            customSectors: [{
                color: "#8167ff",
                lo: 0,
                hi: 100
            }]
        });

        window.addEventListener('resize', function(){
            tubiao1.resize();
            tubiao2.resize();
            renderTubiao3();
            // tubiao3.resize();
        }, false);
    }
    renderChart();

    function wResize(){
        var wWidth = $(window).width();
        var height = 0;
        if(wWidth < 1500){
            if($overview.find('.overview-item-wrap-1').find('.overview-item').length <2){
                $overview.find('.overview-item-wrap-1').append($overview.find('.overview-item-wrap-3').html());
            } else {
                $overview.find('.overview-item-wrap-1').find('.overview-item').eq(1).show();
            }
            if($overview.find('.overview-item-wrap-2').find('.overview-item').length <2){
                $overview.find('.overview-item-wrap-2').append($overview.find('.overview-item-wrap-4').html());
            } else {
                $overview.find('.overview-item-wrap-2').find('.overview-item').eq(1).show();
            }
            $overview.find('.overview-item-wrap-1').find('.overview-item').eq(0).css({'margin-bottom':'20px'});
            $overview.find('.overview-item-wrap-2').find('.overview-item').eq(0).css({'margin-bottom':'20px'});
            $overview.find('.overview-item-wrap-3').hide();
            $overview.find('.overview-item-wrap-4').hide();
            height = $overview.find('.overview-item-wrap-1').height();
        } else {
            $overview.find('.overview-item-wrap-3').show();
            $overview.find('.overview-item-wrap-4').show();
            $overview.find('.overview-item-wrap-1').find('.overview-item').eq(0).css({'margin-bottom':0});
            $overview.find('.overview-item-wrap-2').find('.overview-item').eq(0).css({'margin-bottom':0});
            $overview.find('.overview-item-wrap-1').find('.overview-item').eq(1).hide();
            $overview.find('.overview-item-wrap-2').find('.overview-item').eq(1).hide();
            height = $overview.find('.overview-item-wrap-3').height();
        }
        $overview.find('.overview-item-wrap-5').find('.overview-item').css({'height':height});
        var dashboardUserAssetsWidth = 0;
        if(wWidth < 1200){
            dashboardUserAssetsWidth = 0;
        } else {
            dashboardUserAssetsWidth = $overview.find('.overview-item-wrap-5').outerWidth();
        }
        $dashboardWrap.find('.dashboard-user-assets').css({width:dashboardUserAssetsWidth});
    }
    $(window).on('resize', function(){
        wResize();
    });
    wResize();

    $pageIndexR.on('click', '.js-get-more-notice', function(){
        base.showNotice();
    });

    $pageIndexR.on('click', '.js-get-notice', function(){
        var id = $(this).data('id') || '';
        if(!id){ return false;}
        base.showNotice(id);
    });

    if(pageIndex.openDialog == 0){
        var $upDataDialog = $('<div class="g-dialog-container"><div class="g-dialog-mask" style="background: rgba(0,0,0,0.5);"></div><div class="upDataDialog"><div class="img2"></div><div class="img3"></div><div class="img1"><a class="img-btn" href="javascript:;">朕知道了</a><a class="img-btn2" href="http://bbs.xyunqi.com/forum.php?mod=viewthread&tid=5167" target="_blank">如有问题，前往论坛获取帮助</a></div></div></div>');
        $('body').append($upDataDialog);
        $upDataDialog.on('click', '.img-btn', function () {
            $upDataDialog.remove();
        });
    }

    function shopPreview(){
        var $shopPreview = $shopBasicInfo.find('.shop-preview');
        var src = $shopPreview.data('src') || '';
        var url = $shopPreview.data('url') || '';
        var html = '';
        html += '<div class="p5 f12">';
        html += '<img style="display: block; width: 120px; height: 120px; margin: 0 auto 15px;" src="' + src + '" />';
        html += '<div class="ui-block ui-block-align-c"><p class="pr10">扫一扫，手机预览</p><a class="ui-btn ui-btn-c-1" href="' + (url||'javascript:;') + '" target="_blank">PC预览</a></div>';
        html += '</div>';

        new base.Popover({
            obj: $shopPreview,
            parent:$shopBasicInfo,
            content: html,
            arrowPos: 'left',
            placement:2,
            event: 'hover'
        });
    }
    shopPreview();

    module.exports = {
        init: function(){}
    }
});

