window.MJQ = window.MJQ || window.$;
(function(window, $){

    base.Popover = Popover;

    function Popover(opts){
        this.opts = $.extend(true, {
            parent:$('body'),
            obj:'',
            content:'',
            arrowPos:'up',  //up,down,right,left
            event:'click',  //click hover
            placement:'2'
        }, opts||{});
        this.timer = null;
        this.init();
    }

    Popover.prototype.init = function(){
        if(!this.opts.obj) { return false; }
        this.event();
    };

    Popover.prototype.render = function(){
        var opts = this.opts;
        var arrowPos = opts.arrowPos;
        var placement = opts.placement;
        this.$popover = $('<div class="ui-popover"></div>');
        this.$popover.html('<div class="ui-popover-inner">' + opts.content + '</div><div class="ui-popover-arrow ui-popover-arrow-' + arrowPos + ' ui-popover-arrow-' + arrowPos + '-' + placement + '"></div>');
        this.opts.parent.append(this.$popover);


        var objW = opts.obj.outerWidth();
        var objH = opts.obj.outerHeight();
        var popoverW = this.$popover.outerWidth();
        var popoverH = this.$popover.outerHeight();
        var iLeft = 0;
        var iTop = 0;

        if(arrowPos == 'left'){
            iLeft = objW + 10;
            iTop = -(popoverH - objH)/2;
        } else if(arrowPos == 'right'){
            iLeft = -(popoverW + 10);
            iTop = -(popoverH - objH)/2;
            if(placement == 1){
                iTop = objH/2 - 20;
            } else if(placement == 3){
                iTop = objH/2 - popoverH + 30;
            }

        } else if(arrowPos == 'down'){
            iLeft = -(popoverW - objW)/2;
            iTop = -(objH+20);
            if(placement == 1){
                iLeft = objW/2 - 30;
            } else if(placement == 3){
                iLeft = objW/2 - popoverW + 20;
            }
        } else {
            iTop = objH+10;
            iLeft = -(popoverW - objW)/2;
            if(placement == 1){
                iLeft = objW/2 - 30;
            } else if(placement == 3){
                iLeft = objW/2 - popoverW + 20;
            }
        }

        //if(arrowPos == 'left' || arrowPos == 'right'){
        //    iLeft = (arrowPos == 'left' ? (objW + 10) : -(popoverW + 10));
        //    iTop = -(popoverH - objH)/2;
        //} else {
        //    iLeft = -(popoverW - objW)/2;
        //    iTop = (arrowPos == 'down' ? -(objH+20) : (objH+10));
        //}

        this.$popover.css({left:(opts.obj.offset().left + iLeft), top:(opts.obj.offset().top + iTop)});
        $(this).trigger('createEnd');
    };

    Popover.prototype.event = function(){
        var _this = this;
        var opts = this.opts;
        if(opts.event == 'hover'){
            opts.obj[opts.event](function(){
                clearTimeout(_this.timer);
                if(!_this.$popover){
                    _this.render();
                }

                _this.$popover[opts.event](function(){
                    clearTimeout(_this.timer);
                }, function(){
                    _this.timer = setTimeout(function(){
                        _this.remove();
                    }, 100);
                });

            }, function(){
                _this.timer = setTimeout(function(){
                    _this.remove();
                }, 100);
            });


        } else {
            opts.obj.on(opts.event, function(e){
                _this.render();
                _this.$popover.on('click', function(e){
                    return false;
                });
                return false;
            });
            $(document).on('click', function(){
                _this.remove();
            });

            //opts.obj.on(opts.event, function(){
            //    if(!_this.$popover){
            //        _this.render();
            //    }
            //});
        }
    };

    Popover.prototype.remove = function(){
        if(this.$popover) {
            this.opts.parent.find(this.$popover).remove();
            this.$popover = null;
        }
        $(this).trigger('removeEnd');
    };

})(window, MJQ);
