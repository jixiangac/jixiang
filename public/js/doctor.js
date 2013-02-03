/**
 *  @Description 问医JS
 *  @Author      jixiangac
 *  @E-mail      jixiangac@gmail.com
 *  @Date        2013/02/03 23:59
 */
(function(){
  /*-----------
     问医首页
   -----------*/
  if(!!jixiang.$('doctor-wrap')){
    var doctor = jixiang.$('doctor-wrap');
    var navlist = jixiang.$('doctor-nav').getElementsByTagName('li');
    var content = jixiang.$('doctor-main')
    //导航切换
    for(var i=0,len=navlist.length;i<len;i++){
      (function(i){
         Utils.addHandler(navlist[i],'click',function(){
           for(var j=0;j<len;j++){
             navlist[j].getElementsByTagName('a')[0].className='';
           }
           this.getElementsByTagName('a')[0].className = 'cur';
           content.style.left = '-'+707*i+'px';
         });
      })(i)
    }
    //数据提交
    var form = document.getElementsByTagName('form');
    var handler = function(event){
      var e = event || window.event;
      e.preventDefault();
      var self = this;
      var url = self.getAttribute('action')
         ,type = self.getAttribute('method');
      Utils.removeHandler(self,'submit',handler);
      Utils.addHandler(self,'submit',defaultEvent);
      var result = function(data){
        if(data.flg == 1){
          alert(data.msg);
          setTimeout(function(){
            Utils.removeHandler(self,'submit',defaultEvent);
            Utils.addHandler(self,'submit',handler);            
          },1000);
        }else{
          alert(data.msg);
        }
      }
      ajax(url,type,serialize(self),result)
    }
    for(var i=0,len=form.length;i<len;i++){
      (function(i){
        Utils.addHandler(form[i],'submit',handler);
      })(i)
    }
  }

})()