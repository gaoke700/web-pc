define(function (require, exports, module) {

    //tab
    function tab(th,td){
      for(var i=0;i<th.length;i++){
        th[i].index = i;
        th[i].addEventListener('click',function(){
          for(var j=0;j<th.length;j++){
            th[j].classList.remove('on');
            td[j].classList.remove('on');
          }
          this.classList.add('on');
          td[this.index].classList.add('on');
        });
      };
    }

    var thLi = document.querySelectorAll('.bd-label li');
    var tdLi = document.querySelectorAll('.bd-content li');

    tab(thLi,tdLi);

    module.exports = {
        init: function(){

        }
    }
});

