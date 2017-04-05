define(function (require, exports, module) {
    module.exports = {
        init: function(){
            var UiTable=require("../module/ui-table");
            var listData = [];//所有处理成列表的ajax数据
            var topListData = [];//所有ajax数据
            var oneTwoListData = [];//一级菜单数据和二级菜单数据
            var isRender=false;//是否进行了一次渲染
            var $pageTable=$('.page-goods-classify-table');
            var $page=$('.page-goods-classify');
            var del_parent_id=0;//用来存储删除时的顶层父级id

            /*
             *
             * 获取分类
             * openapi.php?act=getSearchCat
             * cid=0
             *
             * 添加子分类
             * openapi.php?act=save&model=goods/productCat
             *
             *
             * 删除子分类
             * openapi.php?act=delete&model=goods/productCat
             *
             *
             * 更新分类(编辑,排序)
             * openapi.php?act=update&model=goods/productCat
             *
             *
             * */

            function pageDiaglog(json){
                var obj=$.extend(true,{
                    //渲染完的回调
                    renderCallback:function(){

                    },
                    //确认的回调
                    okCallback:function(data){
                        console.log(data);
                    },
                    dataConfig:{
                        isModificationDeep:false,//是否可以选择层级归属
                    },
                    dataOption:[],
                    id:0,
                    classifyName:'',
                    sort:0,
                    src:'',//图片的链接
                    //上传图片改变时的回调
                    imageChangeCallback:function(){

                    },
                    //选择层级归属时的回调
                    selectDeepChangeCallback:function(){

                    }
                },json);
                var dataOption=obj.dataOption;
                var optionHtml=``;
                var classifyName=obj.classifyName;
                var sort=obj.sort;
                var src=obj.src||'undefined';
                var deep=obj.deep;
                //console.log(obj.id);
                dataOption.forEach(function(v){
                    var space=``;
                    //console.log(v,v.deep);
                    if(v.deep==1){
                        space=`&nbsp;&nbsp;&nbsp;&nbsp;`;
                    }
                    optionHtml+=`<option ${obj.id==v.id?'selected':''} value="${v.id}">${space}${v.text}</option>`;
                });
                var thumbnailClass=``;
                if(deep==0){
                    thumbnailClass='input-style-thumbnail-none';
                }
                var str = `
                    <div class="g-dialog-add-category">
                        <div class="input-style">
                            <span class="before">分类名称：</span>
                            <input class="ui-input" type="text" value="${classifyName}" id="parentdiv-classify">
                            <span class="after"></span>
                        </div>
                    <div class="input-style">
                        <span class="before">排序：</span>
                        <input class="ui-input" type="text" value="${sort}"  id="parentdiv-order">
                        <span class="after">数字越小越靠前</span>
                    </div>
                    <div class="input-style">
                        <span class="before">层级归属：</span>
                            <select ${!obj.dataConfig.isModificationDeep&&'disabled'} class="ui-select ui-select-w-1" id="parentdiv-deep">                               
                                ${optionHtml}
                            </select>
                        <span class="after">顶级分类请选择 “无”</span>
                    </div>
                    <div style="display: none;" class="input-style input-style-thumbnail ${thumbnailClass}">
                        <span class="before">分类缩略图：</span>
                        <div>
                            <div class="ui-upload-img page-upload-img ${src!='undefined'?'page-upload-img-active':''}">
                                <label>
                                    <div class="page-upload-img-url" style="${src!='undefined'&&'background-image: url('+src+')'}"></div>
                                    <input style="display: none;" type="file" hidden="">
                                </label>
                            </div>
                            <div>建议尺寸300*300</div> 
                        </div>                       
                    </div>
                `;
                var opt=$.extend(true,{
                    showMask: true,
                    showHeader: true,
                    showBtn: true,
                    btnOkTxt: '保存',
                    btnCancelTxt: '取消',
                    headerTxt: '添加分类',
                    type: 'confirm',   //alert, confirm
                    cancelCallback: null,
                    okCallback: null,
                    content: str,
                    customContent: false
                },obj);
                opt.okCallback=function(){
                    obj.okCallback({
                        text:$('#parentdiv-classify').val(),
                        p_order:$('#parentdiv-order').val(),
                        id:$('#parentdiv-deep').val()
                    });
                };
                new base.Dialog(opt);
                obj.renderCallback({
                    deep:deep
                });
                //图片改变
                var file=null;
                var div=document.querySelector('.page-upload-img');
                var input=div.querySelector('.page-upload-img input');
                input.onchange=function(){
                    file=input.files[0];
                    base.uploadImg({
                        url:'index.php?ctl=template/module&act=newPic',
                        img:file,
                        success:function(result){
                            document.querySelector('.page-upload-img-url').style.backgroundImage=`url(${result.data.img_source})`;
                            div.classList.add('page-upload-img-active');
                            obj.imageChangeCallback(result);
                        }
                    });
                };
                //选择层级归属时的回调
                document.querySelector('#parentdiv-deep').onchange=function(){
                    obj.selectDeepChangeCallback(this);
                }            }

            var game={
                //初始化
                init:function(){
                    //全部折叠
                    this.allFold();
                    //this.allOpen();
                    //折叠(展开)
                    this.foldOpen();
                    //事件
                    this.events();
                },
                //折叠(展开)
                foldOpen:function(){
                    var self=this;
                    $pageTable.on('click','.page-classify-icon',function(){
                        var $this=$(this);
                        var $html=$this.html();
                        var $parent=$this.parents('.ui-table-body-item');
                        var deep=$parent.find('.page-classify').data('deep');//小于下面那个
                        var nextAll=self.getNextAllDom($parent);
                        if($html=='-'){//折叠
                            $this.html('+');
                            $this.removeClass('page-classify-icon-fold');
                            $this.addClass('page-classify-icon-open');
                            nextAll.forEach(function(v){
                                v.css('display','none');
                            })
                        }else{//展开
                            $this.html('-');
                            $this.removeClass('page-classify-icon-open');
                            $this.addClass('page-classify-icon-fold');
                            nextAll.forEach(function(v){
                                v.find('.page-classify-icon').html('-');
                                v.find('.page-classify-icon').removeClass('page-classify-icon-open');
                                v.find('.page-classify-icon').addClass('page-classify-icon-fold');
                                v.css('display','');
                            })
                        }
                    })
                },
                //全部折叠
                allFold:function(){
                    var $parent=$('.ui-table-body-item');
                    $parent.each(function(){
                        var deep=$(this).find('.page-classify').data('deep');//小于下面那个
                        var nextDom=$(this).next();
                        var nextDeep=nextDom.find('.page-classify').data('deep');//大于上面那个
                        if(deep!=0){
                            $(this).css('display','none');
                        }
                        if(deep*1<nextDeep*1){//下一行是我的多级菜单
                            $(this).find('.page-classify-icon').html('+');
                            $(this).find('.page-classify-icon').removeClass('page-classify-icon-fold');
                            $(this).find('.page-classify-icon').addClass('page-classify-icon-open');
                        }else{
                            $(this).find('.page-classify-icon').html('-');
                            $(this).find('.page-classify-icon').removeClass('page-classify-icon-open');
                            $(this).find('.page-classify-icon').addClass('page-classify-icon-fold');
                        }
                    });
                },
                //全部展开
                allOpen:function(){
                    var $parent=$('.ui-table-body-item');
                    $parent.css('display','');
                    $parent.find('.page-classify-icon').html('-');
                    $parent.find('.page-classify-icon').removeClass('page-classify-icon-open');
                    $parent.find('.page-classify-icon').addClass('page-classify-icon-fold');
                },
                //添加分类
                add:function(json){
                    var opt=json||{};
                    var data=opt.data||{};
                    var callback=opt.callback||function(){console.log('添加分类的回调')};
                    $.ajax({
                        url:'openapi.php?act=save&model=goods/productCat',
                        type:'post',
                        data:data,
                        dataType:'json',
                        success:function(json){
                            callback(json);
                        }
                    });
                },
                //编辑
                edit:function(json){
                    var opt=json||{};
                    var data=opt.data||{};
                    var callback=opt.callback||function(){console.log('添加分类的回调')};
                    $.ajax({
                        url:'openapi.php?act=update&model=goods/productCat',
                        type:'post',
                        data:data,
                        dataType:'json',
                        success:function(json){
                            callback(json);
                        }
                    })
                },
                //删除
                del:function(json){
                    var opt=json||{};
                    var data=opt.data||{};
                    var callback=opt.callback||function(){console.log('添加分类的回调')};
                    $.ajax({
                        url:'openapi.php?act=delete&model=goods/productCat',
                        type:'post',
                        data:data,
                        dataType:'json',
                        success:function(json){
                            callback(json);
                        }
                    })
                },
                //获取上一层分类的父级id
                getPrevClassifyParentId:function(json){
                    var opt=json||{};
                    var id=opt.id;
                    var deep=opt.deep;
                    var parent_id=0;
                    var other_classify=[];
                    if(deep!=0){
                        listData.forEach(function(v,i){
                            if(id==v.id){
                                parent_id=v.id;
                                other_classify=listData.slice(0,i+1).reverse();
                            }
                        });
                        var isTrue=true;
                        other_classify.forEach(function(v){
                            if(v.deep<deep&&isTrue){
                                parent_id=v.id;
                                isTrue=false;
                            }
                        });
                    }
                    return {
                        parent_id:parent_id,
                        other_classify:other_classify,
                    }
                },
                //获取当前分类的顶层父级id
                getClassifyTopParentId:function(json){
                    var self=this;
                    var opt=json||{};
                    var id=opt.id;
                    var deep=opt.deep;
                    var classify=self.getPrevClassifyParentId({id:id,deep:deep});
                    var parent_id=classify.parent_id;
                    var other_classify=classify.other_classify;
                    var isTrue=true;
                    other_classify.forEach(function(v){
                        if(v.deep==0&&isTrue){
                            isTrue=false;
                            parent_id=v.id;
                        }
                    });
                    return {
                        parent_id:parent_id,
                    };
                },
                //获取当前第一层的所有子层节点
                getNextAllDom:function($parent){
                    var nextAll=[];//所有满足条件的DOM节点
                    var nextDom=$parent.next();
                    var nextFlag=true;//下一个的标识
                    var deep=$parent.find('.page-classify').data('deep');
                    while (nextFlag){
                        var nextDeep=nextDom.find('.page-classify').data('deep');//大于等于上面那个
                        if(nextDeep==undefined){break;}
                        if(deep*1<nextDeep*1){//下一行是我的多级菜单
                            nextAll.push(nextDom);
                            nextDom=nextDom.next();
                        }else{
                            nextFlag=false;
                            break;
                        }
                    }
                    return nextAll;
                },
                //单独展开
                openOne:function(json){
                    var self=this;
                    var opt=json||{};
                    var id=opt.id;
                    var deep=opt.deep;
                    var pageClassify=$('.page-classify[data-id='+id+']');
                    var parent=pageClassify.parents('.ui-table-body-item');
                    var topClassifyParent=null;
                    if(deep!=undefined&&pageClassify.length!=0){
                        deep=pageClassify.data('deep');
                    }
                    function show(parent){
                        parent.find('.page-classify-icon').html('-');
                        self.getNextAllDom(parent).forEach(function(v){
                            v.css('display','');
                            v.find('.page-classify-icon').html('-');
                        });
                    }
                    if(deep==0){
                        show(parent);
                    }
                    if(deep!=0){
                        var obj=self.getClassifyTopParentId({id:id,deep:deep});
                        var parent_id=obj.parent_id;
                        //console.log(parent_id);
                        topClassifyParent=$('.page-classify[data-id='+parent_id+']').parents('.ui-table-body-item');
                        show(topClassifyParent);
                    }
                },
                //排序
                editSort:function(result){
                    var self=this;
                    var id=result.data.id;
                    var pageClassify=$('.page-classify[data-id='+id+']');
                    var deep=pageClassify.data('deep');
                    var parent_id=this.getPrevClassifyParentId({id:id,deep:deep}).parent_id;
                    $.ajax({
                        url:'openapi.php?act=update&model=goods/productCat',
                        type:'post',
                        data:{
                            id:id,
                            data:{
                                parent_id:parent_id,
                                p_order:result.newStr,
                            }
                        },
                        dataType:'json',
                        success:function(json){
                            if(json.res=='succ'){
                                result.succ(true);
                                base.promptDialog({str:`保存成功`});
                                //console.log(result.data.id);
                                render(function(){
                                    self.openOne({id:id});
                                })
                            }else{
                                base.promptDialog({str:`保存失败`});
                            }
                        }
                    });
                },
                //事件
                events:function(){
                    var self=this;
                    //点击全部折叠
                    $('.all-fold').on('click',function(){
                        self.allFold();
                    });
                    //点击全部展开
                    $('.all-open').on('click',function(){
                        self.allOpen();
                    });
                    //点击展开(折叠)
                    $('.all-open-fold').on('click',function(){
                        if($(this).html()=='+ 全部展开'){
                            self.allOpen();
                            $(this).html('- 全部折叠');
                        }else{
                            self.allFold();
                            $(this).html('+ 全部展开');
                        }
                    });
                    //点击删除
                    $pageTable.on('click','.page-option-del',function(){
                        var $this=$(this);
                        var $parent=$this.parents('.ui-table-body-item');
                        var id=$parent.find('.page-classify').data('id');
                        var deep=$parent.find('.page-classify').data('deep');
                        var data={
                            id:id,
                        };
                        new base.Dialog({
                            content:'确认删除么？',
                            okCallback: function(){
                                del_parent_id=self.getClassifyTopParentId({id:id,deep:deep}).parent_id;
                                self.del({data:data,callback:function(json){
                                    //console.log(json);
                                    var res=json.res;
                                    if(res=='succ'){
                                        base.promptDialog({str:`删除成功`});
                                        render(function(){
                                            var parent=$('.page-classify[data-id='+del_parent_id+']').parents('.ui-table-body-item');
                                            var allDom=self.getNextAllDom(parent);
                                            parent.find('.page-classify-icon').html('-');
                                            allDom.forEach(function(v){
                                                console.log(v);
                                                v.css('display','');
                                                v.find('.page-classify-icon').html('-');
                                            });
                                            //删除的时候这里无法打开,因为节点被干掉了,获取不到数据了,解决方案,用一个全局变量存储删除的那个分类的顶级父层的id
                                        });
                                    }else{
                                        base.promptDialog({str:`删除失败:${json.msg}`,time:2000});
                                    }
                                }});
                            }
                        });
                    });
                    //添加分类
                    $page.on('click','.add-classify',function(){
                        var image_id=null;
                        pageDiaglog({
                            selectDeepChangeCallback:function(obj){
                                if(obj.value==0){
                                    document.querySelector('.input-style-thumbnail').classList.add('input-style-thumbnail-none');
                                }else{
                                    document.querySelector('.input-style-thumbnail').classList.remove('input-style-thumbnail-none');
                                }
                            },
                            imageChangeCallback:function(result){
                                image_id=result.data.image_id;
                            },
                            okCallback:function(data){
                                self.add({
                                    data:{
                                        id:data.id,
                                        data:{
                                            p_order:data.p_order,
                                            cat_name:data.text,
                                            image_id:image_id
                                        },
                                    },
                                    callback:function(json){
                                        //console.log(json);
                                        var res=json.res;
                                        if(res=='succ'){
                                            base.promptDialog({str:`添加成功`});
                                            render();
                                        }else{
                                            base.promptDialog({str:`添加失败:${json.msg}`,time:2000});
                                        }
                                    }
                                });
                            },
                            headerTxt:'添加分类',
                            dataOption:oneTwoListData,
                            dataConfig:{
                                isModificationDeep:true,
                            },
                            deep:0
                        });
                    });
                    //添加子分类
                    $pageTable.on('click','.page-classify-add',function(){
                        var id=$(this).parents('.ui-table-body-item').find('.page-classify').data('id');
                        var deep=$(this).parents('.ui-table-body-item').find('.page-classify').data('deep');
                        var image_id=null;
                        pageDiaglog({
                            selectDeepChangeCallback:function(obj){
                                if(obj.value==0){
                                    document.querySelector('.input-style-thumbnail').classList.add('input-style-thumbnail-none');
                                }else{
                                    document.querySelector('.input-style-thumbnail').classList.remove('input-style-thumbnail-none');
                                }
                            },
                            imageChangeCallback:function(result){
                                image_id=result.data.image_id;
                            },
                            okCallback:function(data){
                                //console.log(data);
                                self.add({
                                    data:{
                                        data:{
                                            parent_id:data.id,
                                            p_order:data.p_order,
                                            cat_name:data.text,
                                            image_id:image_id
                                        },
                                    },
                                    callback:function(json){
                                        //console.log(json);
                                        var res=json.res;
                                        if(res=='succ'){
                                            base.promptDialog({str:`添加成功`});
                                            render(function(){
                                                self.openOne({id:id});
                                            });
                                        }else{
                                            base.promptDialog({str:`添加失败:${json.msg}`,time:2000});
                                        }
                                    }
                                });
                            },
                            headerTxt:'添加分类',
                            dataOption:oneTwoListData,
                            dataConfig:{
                                isModificationDeep:true,
                            },
                            id:id,
                            deep:(deep*1+1)
                        });
                    });
                    //编辑分类
                    $pageTable.on('click','.page-option-edit',function(){
                        var $parent=$(this).parents('.ui-table-body-item');
                        var pageClassify=$parent.find('.page-classify');
                        var id=pageClassify.data('id');
                        var parent_id=0;//父级的id
                        var deep=pageClassify.data('deep');
                        var classifyName=$parent.find('.page-classify-name').html();
                        var sort=$parent.find('.page-classify-input').html();
                        var src=pageClassify.data('src');
                        var image_id=pageClassify.data('imageid');
                        if(deep!=0){
                            self.openOne({id:id});
                            parent_id=self.getPrevClassifyParentId({id:id,deep:deep}).parent_id;
                        }
                        //console.log('id:',id,'deep:',deep,'parent_id:',parent_id);
                        pageDiaglog({
                            //选择层级归属时的回调
                            selectDeepChangeCallback:function(obj){
                                if(obj.value==0){
                                    document.querySelector('.input-style-thumbnail').classList.add('input-style-thumbnail-none');
                                    //这里应该要把image_id清空
                                }else{
                                    document.querySelector('.input-style-thumbnail').classList.remove('input-style-thumbnail-none');
                                    //这里应该重新获取一次image_id
                                }
                                //虽然我没有做这个功能,但是没有影响,因为后台不接收这个数据,就相当于自动帮你清空了
                            },
                            //图片改变的回调
                            imageChangeCallback:function(result){
                                image_id=result.data.image_id;
                            },
                            //确认的回调
                            okCallback:function(data){
                                //console.log(data);
                                //console.log('id,当前点击的那个',id,'data.id,下拉框选择的那个',data.id,'parent_id,父级的id',parent_id);
                                if(data.id!=parent_id){//把一个一级菜单,嵌入另外一个一级菜单里
                                    parent_id=data.id;
                                }
                                self.edit({
                                    data:{
                                        id:id,
                                        data:{
                                            parent_id:parent_id,
                                            p_order:data.p_order,
                                            cat_name:data.text,
                                            image_id:image_id
                                        }
                                    },
                                    callback:function(json){
                                        //console.log(json);
                                        var res=json.res;
                                        if(res=='succ'){
                                            base.promptDialog({str:`编辑成功`});
                                            render(function(){
                                                self.openOne({id:id});
                                            });
                                        }else{
                                            base.promptDialog({str:`编辑失败:${json.msg}`,time:2000});
                                        }
                                    }
                                });
                            },
                            headerTxt:'编辑分类',
                            dataOption:oneTwoListData,
                            dataConfig:{
                                isModificationDeep:true,
                            },
                            id:parent_id,
                            classifyName:classifyName,
                            sort:sort,
                            src:src,
                            deep:deep
                        });
                    });
                }
            };
            function render(callback){
                listData=[];
                topListData=[];
                oneTwoListData=[];
                $pageTable.html('');
                $.ajax({
                    url:'openapi.php?act=getSearchCat',
                    data:{
                        cid:0,
                    },
                    type:'post',
                    dataType:'json',
                    success:function(result){
                        //console.log(result);
                        var data=result.result;
                        topListData=JSON.parse(JSON.stringify(data));
                        topListData.unshift({text:'--- 无 ---',id:'0'});
                        //console.log(topListData);
                        oneTwoListData.unshift({text:'--- 无 ---',id:'0',deep:0});
                        var bodyHtml=[];
                        //一行的内容
                        function bodyHtmlPush(json){
                            var opt=json||{};
                            var obj=opt.obj||{};
                            var deep=opt.deep||'undefined';
                            var foldOpen='-';
                            if(obj.child){
                                foldOpen='+';
                            }
                            var htmlIconClassify=`<div class="page-classify-icon">${foldOpen}</div>`;
                            var htmlAddClassify=`<div class="page-classify-add">+添加子分类</div>`;
                            if(deep==2){
                                htmlIconClassify=``;
                                htmlAddClassify=``;
                            }
                            var deepLine=`deep-line`;
                            if(deep==0){
                                deepLine=``;
                            }
                            bodyHtml.push([
                                `
                                    <div class="${deepLine} page-classify-input page-classify-ml${deep}">${obj.p_order}</div>
                                `,
                                `
                                    <div class="${deepLine} page-classify page-classify-pl${deep}" data-imageid="${obj.image_id}" data-src="${obj.src}" data-deep="${deep}" data-id="${obj.id}">
                                        ${htmlIconClassify}
                                        <div class="page-classify-name">${obj.text}</div>
                                        ${htmlAddClassify}
                                    </div>
                                `,
                                //`
                                //    <div>${deep}</div>
                                //`,
                                `
                                    <div class="page-option">
                                        <div class="page-option-edit">编辑</div>
                                        <div class="page-option-del">删除</div>
                                    </div>
                                `,
                            ]);
                        }
                        //递归层级
                        function getDeep(obj) {
                            if(getDeep.deep.isTrue){
                                getDeep.deep.isTrue=false;
                                //console.log(obj,'索引', 0,'层级',0);
                                bodyHtmlPush({obj:obj,deep:'0'});
                                listData.push(obj);
                                obj.deep=0;
                                oneTwoListData.push(obj);
                            }
                            if(obj.child){
                                getDeep.deep.index++;
                                obj.child.forEach(function (v, i) {
                                    //console.log(v,'索引', i,'层级',getDeep.deep.index);
                                    bodyHtmlPush({obj:v,deep:getDeep.deep.index});
                                    v.deep=getDeep.deep.index;
                                    listData.push(v);
                                    if(getDeep.deep.index!=2){
                                        oneTwoListData.push(v);
                                    }
                                    getDeep(v);
                                    if(v.child){
                                        getDeep.deep.index--;
                                    }
                                });
                            }
                        }
                        data.forEach(function(v){
                            getDeep.deep = { index: 0, isTrue:true };
                            getDeep(v);
                        });
                        //console.log(oneTwoListData);
                        //console.log(bodyHtml);
                        new UiTable({
                            parent:$pageTable,
                            headConfig:[
                                {
                                    text:'排序',
                                    width:'300px',
                                    change: true,
                                    changeType: 'number',
                                    changeFn: function(result){
                                        result.data=listData[result.index];
                                        game.editSort(result || {});
                                    }
                                },
                                { text:'分类名称' },
                                //{ text:'层级' },
                                { text:'操作', width:'120px' }
                            ],
                            bodyHtml:bodyHtml
                        });
                        //console.log(listData.length);
                        if(!isRender){
                            game.init();
                        }else{
                            //game.allOpen();
                            game.allFold();
                        }
                        isRender=true;
                        callback&&callback();
                    }
                });
            }
            render();
        }
    }
});