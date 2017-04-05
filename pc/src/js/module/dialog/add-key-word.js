/**
 * Created by tiangaoke on 2017/2/22.
 */
define(function (require, exports, module) {
    var TabList = require('../table.js');
    var Tabs = require('./tabs');


    $('.level-one-name[name=firstId]').on('blur',function(){
        if($(this).val().length>5){
            $(this).val($(this).val().substring(0,5));
        }
    });

    $('.level-one-name[name=secondId]').on('blur',function(){
        if($(this).val().length>7){
            $(this).val($(this).val().substring(0,7));
        }
    });



    var AddKeyWord = function (opts) {
        opts = opts || {};
        var gkCallback = function(){
            var id= $('.contents').find('input:checked').data('id');
            opts.callback && opts.callback(id);
        };

        new Tabs([{
            tabName: '文本',
            content0: '',
            showBtn:true,
            okCallback:gkCallback,
            tabClickFn: function () {
                $('.content0').append('<div class="only-text"></div>');
                new TabList({
                    parent:$('.only-text'),
                    tableConfig:{
                        headConfig:[ { text:''} ],
                        isShowHeader:false
                    },
                    ajaxData:{
                        pageSize:6,
                        data:{ view:1 },
                        model:'interaction/material'
                    },
                    renderItemFn: function(data){
                        var arr = [];
                        $.each(data, function(i, item){
                            arr[i] = [];
                            arr[i].push('<div class="pl30 h" style="width: 100%; box-sizing: border-box;"><label class="ui-radio tl"><input type="radio" data-id="'+item.id+'" name="radiox" value="11"><i></i>'+item.params.title+'</label></div>');
                        });
                        return arr;
                    }
                });
            }
        }, {
            tabName: '单图文',
            content1: '',
            tabClickFn: function () {
                $('.content1').append('<div class="single-image-text"></div>');
                new TabList({
                    parent:$('.single-image-text'),
                    tableConfig:{
                        headConfig:[ { text:'1'},{ text:'2'} ],
                        isShowHeader:false
                    },
                    ajaxData:{
                        pageSize:6,
                        data:{ view:2 },
                        model:'interaction/material'
                    },
                    renderItemFn: function(data){
                        var arr = [];
                        $.each(data, function(i, item){
                            arr[i] = [];
                            arr[i].push('<div class="pl30 h" style="width: 100%; box-sizing: border-box;"><label class="ui-radio tl"><input type="radio" data-id="'+item.id+'" name="radiox" value="11"><i></i>'+item.params.title+'</label></div>');
                            arr[i].push('<div class="ui-flex ui-flex-pack-2 h"><img class="h50 w50" src="'+item.params.image+'" /></div>');
                        });
                        return arr;
                    }
                });
            }
        }, {
            tabName: '多图文',
            content2: '',
            tabClickFn: function () {
                $('.content2').append('<div class="muilt-image-text"></div>');
                new TabList({
                    parent:$('.muilt-image-text'),
                    tableConfig:{
                        headConfig:[ { text:'1'},{ text:'2'},{ text:'2'}],
                        isShowHeader:false
                    },
                    ajaxData:{
                        pageSize:6,
                        data:{ view:3 },
                        model:'interaction/material'
                    },
                    renderItemFn: function(data){
                        var arr = [];
                        $.each(data, function(i, item){
                            arr[i] = [];
                            arr[i].push('<div class="pl30 h" style="width: 100%; box-sizing: border-box;"><label class="ui-radio tl"><input type="radio" data-id="'+item.id+'" name="radiox" value="11"><i></i>'+item.params.title+'</label></div>');
                            arr[i].push('<div class="ui-flex ui-flex-pack-2 h"><img class="h50 w50" src="'+item.params.image+'" /></div>');
                        });
                        return arr;
                    }
                });
            }
        }]);
    };

    module.exports = AddKeyWord;
});
