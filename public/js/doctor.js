/**
 *  @Description 问医JS
 *  @Author      jixiangac
 *  @E-mail      jixiangac@gmail.com
 *  @Date        2013/02/03 23:59
 */
(function(){
  /*--------------
    -- 问诊预约 --
   --------------*/
  //数据提交
  var handler = function(event){
    var pself = this;
    var e = event || window.event;
    defaultEvent(e);
    var self = e.target || e.srcElement;
    if(self.id !== 'wen-form')return;
    var result = function(data){
      if(data.flg == 1){
        pjax(self,self.getAttribute('action'),'pjax-container');
      }
    }
    if(self.tagName.toLowerCase() == 'form'){
      ajax(self.getAttribute('action'),'post',serialize(self),result);
    }
  }
  Utils.addHandler(jixiang.$('pjax-container'),'submit',handler);
})()