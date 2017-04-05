define(function (require, exports, module) {
    module.exports = {
        init: function(){
            var $ = MJQ;
            var $pageMuiltstoreEdit = $('.page-muiltstore-edit');
            var $hdBottom = $pageMuiltstoreEdit.find('.hd-bottom');
            var $formWrap = $pageMuiltstoreEdit.find('.form-wrap');
            var $province = $formWrap.find('select[name=province]');
            var $city = $formWrap.find('select[name=city]');
            var $district = $formWrap.find('select[name=district]');
            var mapData = {};
            var city22 = '';
            var ajaxAddressList = [];

            function renderSearchList(arr){
                if(!arr){ return false;}
                var htmls = [];
                $.each(arr, function(i, item){
                    var name = item.title || '';
                    var addr = item.address || '';
                    var location = item.location || {};
                    htmls.push('<div class="map-search-list" data-index="' + i + '">');
                    htmls.push('<p class="num">' + (i+1) + '</p>');
                    htmls.push('<p class="name">' + name + '</p>');
                    htmls.push('<p class="addr">' + addr + '</p>');
                    htmls.push('</div>');
                });
                return htmls.join('');
            };

            //输入的字数
            $formWrap.find('.limit-length').on('input', '.limit-length-node', function(){
                $(this).removeClass('v-error');
                var maxLength = $(this).attr('maxlength') || 9999;
                var value = $(this).val();
                var $tip = $(this).parent().find('.tip');
                $tip.html(value.length + '/' + maxLength);
            });

            $formWrap.find('.limit-length').on('blur', '.limit-length-node', function(){
                var maxLength = $(this).attr('maxlength') || 9999;
                var value = $(this).val();
                var $tip = $(this).parent().find('.tip');
                $tip.html(value.length + '/' + maxLength);
                if(value.length > maxLength){
                    $(this).addClass('v-error');
                }
            });

            //地区select
            $province.on('change', function(){
                selectAddrAjax($province.val(), $city, function(){
                    selectAddrAjax($city.val(), $district);
                });
            });
            $city.on('change', function(){
                selectAddrAjax($city.val(), $district);
            });

            function selectAddrAjax(id, obj, callback){
                if(mapData[id]){
                    render(mapData[id]);
                    return false;
                }
                base.ajax({
                    url: 'index.php?ctl=muiltStore/muiltStore&act=ajaxRegion',
                    data: {
                        region_id:id
                    },
                    success: function(result){
                        mapData[id] = result;
                        render(result);
                    }
                });
                function render(data){
                    var htmls = [];
                    $.each(data||{}, function(i,v){
                        htmls.push('<option value="' + (v.region_id || '') + '">' + (v.region_name || '') + '</option>');
                    });
                    obj.html(htmls.join(''));
                    if(callback) callback();
                }
            }

            //监听iframe
            window.addEventListener('message',function(e){
                var data = e.data;
                if(data.status && data.status == 'onLoad'){
                    if($formWrap.find('input[name=store_addr_lat]').val()){
                        var val = $formWrap.find('input[name=store_addr_lat]').val().split(',');
                        document.getElementById('map-iframe').contentWindow.postMessage({
                            lat:val[0],
                            lng:val[1],
                            source: 'parent'
                        }, '*');
                    }
                } else if(data.status && data.status == 'check'){
                    $formWrap.find('input[name=store_addr_lat]').val([(data.data.lat||''), (data.data.lng||'')]);
                    $formWrap.find('input[name=store_addr]').val(data.data.address);
                    $pageMuiltstoreEdit.find('#map-search').hide();
                } else if(data.status && data.status == 'markerUp'){
                    $formWrap.find('input[name=store_addr_lat]').val([(data.lat||''), (data.lng||'')]);
                } else {
                    city22 = data.city;
                }
            },false);

            //搜索,精确搜索
/*
            $formWrap.on('click', '.js-search-map', function(){
                var str1 = $province.find("option:selected").text() + $city.find("option:selected").text() + $district.find("option:selected").text();
                var str2 = $formWrap.find('input[name=store_addr]').val();
                str1 = str1.replace(/\全部/g, '') ? str1.replace(/\全部/g, '') : province22;
                if(!str2){
                    base.promptDialog({ str: '请输入详细地址', time: 2000 });
                    return false;
                }
                base.ajax({
                    type: 'post',
                    url: 'index.php?ctl=muiltStore/muiltStore&act=ajaxAddress',
                    data: {
                        address: str1 + str2
                    },
                    success: function(result){
                        result = result || {};
                        if(result.status && result.status != 1){
                            return false;
                        }
                        var data = result.data || {};
                        if(data.status == 347){
                            base.promptDialog({str:data.message || '查询无结果'});
                            return false;
                        }
                        data.location = data.location || data.result.location || {};
                        $formWrap.find('input[name=store_addr_lat]').val([(data.location.lat||''), (data.location.lng||'')]);
                        data.location.source = 'parent';
                        document.getElementById('map-iframe').contentWindow.postMessage(data.location, '*');
                    }
                });
            });
*/

            $formWrap.find('input[name=store_addr]').keydown(function(e){
                if(e.keyCode==13){
                    console.log(1);
                    $formWrap.find('.js-search-map').click();
                }
            });

            //搜索附近
            $formWrap.on('click', '.js-search-map', function(){
                var cityStr = $city.find("option:selected").text();
                var address = $formWrap.find('input[name=store_addr]').val().replace(/\s/g, "");
                cityStr = (cityStr == '全部') ? city22 : cityStr;

                if(!address){
                    base.promptDialog({ str: '请输入详细地址', time: 2000 });
                    return false;
                }

                base.ajax({
                    type: 'post',
                    url: 'index.php?ctl=muiltStore/muiltStore&act=ajaxAddressList',
                    data: {
                        city_name: cityStr,
                        address: address,
                        page_index:1,
                        page_size:50
                    },
                    success: function(result){
                        result = result || {};
                        if(result.status && result.status != 1){
                            base.promptDialog({str:result.msg || '查询无结果'});
                            return false;
                        }
                        ajaxAddressList = result.data || [];
                        $pageMuiltstoreEdit.find('#map-search').show();
                        $pageMuiltstoreEdit.find('#map-search .map-search-result').html(renderSearchList(ajaxAddressList));
                        document.getElementById('map-iframe').contentWindow.postMessage({
                            data:ajaxAddressList,
                            source:'marker'
                        }, '*');
                    }
                });
            }).trigger('click');

            $pageMuiltstoreEdit.on('click', '#map-search .map-search-list', function(){
                var index = $(this).index();
                document.getElementById('map-iframe').contentWindow.postMessage({
                    data:[ajaxAddressList[index]],
                    source:'marker2',
                    sourceIndex:index
                }, '*');
            });

            //上传图片
            $formWrap.on('change', '.js-btn-store-img', function(){
                //_this.uploadImg($imgWrap, this, $(this).parent());
                var img = this.files[0];
                var imgSize = img.size;
                var imgUrl = base.utils.getUploadUrl(img);
                var $parent = $(this).parent();
                if(Number(imgSize) > 2048000){
                    base.promptDialog({str:'上传图片不能大于2M', time:2000});
                    return false;
                }

                base.uploadImg({
                    img: img,
                    url: 'index.php?ctl=template/module&act=newPic',
                    success: function(result){
                        result = result || {};
                        result.res = result.res || '';
                        result.data = result.data || {};
                        var sImgUrl = result.data.img_source || '';
                        if(result.res == 'succ' && sImgUrl){
                            $formWrap.find('input[name=store_image]').val(sImgUrl);
                            if($parent.children('div').length > 0){
                                $parent.children('div').remove();
                            }
                            if($parent.find('img').length > 0){
                                $parent.find('img').attr('src', sImgUrl);
                            } else {
                                $parent.append('<img src="' + sImgUrl + '" />');
                            }
                        } else {
                            base.promptDialog({str:result.msg, time:2000});
                        }
                    },
                    error: function(result){
                        base.promptDialog({str:'上传失败'});
                    }
                });
            });

            //post form
            $hdBottom.on('click', '.js-save-form', function(){
                var errorLen = 0;
                $.each($('.yz-reg'), function(i, v){
                    if($(this).val() == ''){
                        if($(this).attr('name') == 'store_addr_lat'){
                            base.promptDialog({str: ('请搜索地址，并在地图内选择/标注为门店地址'), time:4000});
                        } else {
                            base.promptDialog({str: ('请填写' + $(this).data('name')), time:2000});
                        }
                        errorLen++;
                        return false;
                    }
                });

                if(errorLen > 0){
                    return false;
                }
                var data = $("#edit").serialize();
                base.ajax({
                    url: 'index.php?ctl=muiltStore/muiltStore&act=toEdit',
                    type: 'post',
                    //dataType: 'string',
                    data: data,
                    success: function (result) {
                        result = result || {};
                        result.status = result.status || 0;
                        if(result.status != 1){
                            base.promptDialog({str:(result.msg || '保存失败'), time:2000});
                        } else {
                            base.promptDialog({str:(result.msg || '保存成功'), time:2000, callback: function(){
                                window.location.href = 'index.php?ctl=muiltStore/muiltStore&act=index';
                            }});
                        }
                    }
                });
            });

            $hdBottom.on('click', '.js-go-list', function(){
                window.location.href = 'index.php?ctl=muiltStore/muiltStore&act=index';
            });

            //离开页面时触发弹框
            base.onunload();
        }
    }
});

