define(function (require, exports, module) {
    module.exports = {
        init: function(){
            var UiTable=require("../../module/ui-table");
            var listData = [];//所有处理成列表的ajax数据
            var topListData = [];//所有ajax数据
            var oneTwoListData = [];//一级菜单数据和二级菜单数据
            var isRender=false;//是否进行了一次渲染
            var $pageTable=$('.page-goods-classify-table');
            var del_parent_id=0;//用来存储删除时的顶层父级id

            /*
             *
             *
             * 获取分类
             * openapi.php?act=weixin_customeMenu
             * cid=0
             *
             *
             * 删除子分类
             * openapi.php?act=delete&model=goods/productCat
             *
             * 添加一级分类index.php?ctl=weixin/weixin&act=levelOne
             * 添加二级分类index.php?ctl=weixin/weixin&act=levelTwo&id=90
             *
             * 添加子菜单的链接   index.php?ctl=weixin/weixin&act=levelTwo&id=10775
             * 编辑菜单的链接     index.php?ctl=weixin/weixin&act=cunstome_detail&id=10775
             * 删除菜单的链接(这里应该是个接口)    index.php?ctl=weixin/weixin&act=del_cunstome&id=10776
             *
             *
             * */



            //两个弹窗
            //new base.Dialog({content:'内容',okCallback:function(){}});
            //base.promptDialog({str:`删除失败:${json.msg}`,time:2000});


            var game={
                //初始化
                init:function(){
                    //全部展开
                    this.allOpen();
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
                //删除
                del:function(json){
                    var opt=json||{};
                    var data=opt.data||{};
                    var callback=opt.callback||function(){console.log('添加分类的回调')};
                    $.ajax({
                        url:'openapi.php?act=weixin_del_cunstome',
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
                //事件
                events:function(){
                    var self=this;
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
                    //点击删除  待续1   待续2(默认全部展开,因为菜单比较少)
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
                                self.del({data:data,callback:function(json){
                                    //console.log(json);
                                    var res=json.res;
                                    if(res=='succ'){
                                        base.promptDialog({str:`删除成功`});
                                        render();
                                    }else{
                                        base.promptDialog({str:`删除失败:${json.msg}`,time:2000});
                                    }
                                }});
                            }
                        });
                    });
                    //添加一级分类
                    $('.page-goods-classify').on('click','.add-classify a',function(ev){
                        ev.preventDefault();
                        var len=topListData.length;
                        if(len>=3){
                            base.promptDialog({str:`添加失败:一级菜单最多添加3个`,time:2000});
                        }else{
                            window.location.href=this.getAttribute('href');
                        }
                    });
                    //添加二级分类
                    $pageTable.on('click','.page-classify-add a',function(ev){
                        ev.preventDefault();
                        var index=$(this).parents('.ui-table-body-item').data('index');
                        var len=listData[index].child&&listData[index].child.length||0;
                        if(len>=5){
                            base.promptDialog({str:`添加失败:二级菜单最多添加5个`,time:2000});
                        }else{
                            window.location.href=this.getAttribute('href');
                        }
                    })
                }
            };
            function render(callback){
                listData=[];
                topListData=[];
                oneTwoListData=[];
                $pageTable.html('');
                $.ajax({
                    url:'openapi.php?act=weixin_customeMenu',
                    type:'post',
                    dataType:'json',
                    success:function(result){
                        //console.log(result);
                        var data=result.result;
                        topListData=JSON.parse(JSON.stringify(data));
                        //topListData.unshift({text:'--- 无 ---',id:'0'});
                        //console.log(topListData);
                        //oneTwoListData.unshift({text:'--- 无 ---',id:'0',deep:0});
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
                            var htmlAddClassify=`<div class="page-classify-add"><a href="index.php?ctl=weixin/weixin&act=levelTwo&id=${obj.id}">+添加子菜单</a></div>`;
                            if(deep>=1){
                                htmlIconClassify=``;
                                htmlAddClassify=``;
                            }
                            var deepLine=`deep-line`;
                            if(deep==0){
                                deepLine=``;
                            }
                            bodyHtml.push([
                                `
                                    <div class="${deepLine} page-classify page-classify-pl${deep}" data-deep="${deep}" data-id="${obj.id}">
                                        ${htmlIconClassify}
                                        <div class="page-classify-name">${obj.m_name}</div>
                                        ${htmlAddClassify}
                                    </div>
                                `,
                                `
                                    <div>${obj.m_type}</div>
                                `,
                                `
                                    ${obj.obj_bind}
                                `,
                                `
                                    ${obj.modifed}
                                `,
                                `
                                    <div class="page-option">
                                        <div class="page-option-edit"><a href="index.php?ctl=weixin/weixin&act=cunstome_detail&id=${obj.id}">编辑</a></div>
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
                            getDeep.deep = {
                                index: 0,
                                isTrue:true,
                            };
                            getDeep(v);
                        });
                        new UiTable({
                            parent:$pageTable,
                            headConfig:[
                                {
                                    text:'分类名称'
                                },
                                {
                                    text:'等级'
                                },
                                {
                                    text:'绑定对象'
                                },
                                {
                                    text:'最后修改时间'
                                },
                                {
                                    text:'操作'
                                }
                            ],
                            bodyHtml:bodyHtml,
                        });
                        if(!isRender){
                            game.init();
                        }else{
                            game.allOpen();
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