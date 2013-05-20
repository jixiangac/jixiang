/**
 *  @Description 服务类
 *  @Author      jixiangac
 *  @E-mail      jixiangac@gmail.com
 *
 *
 *  服务包括： 线上问诊，问诊预约，药品购买，家政服务
 *  
 */
define(function(require,exports,module){
   var jixiang = require('./models/base')
      ,ajax = require('./models/ajax');
   
   /**
    *  wen-form相关预约的提交表单
    *  问诊/家政预约
    */
   if(document.getElementById('wen-form')){
      jixiang.addHandler(jixiang.$('wen-form'),'submit',ajax.ajaxForm);
   }

});

// (function(){
//   /*--------------
//     -- 问诊预约 --
//    --------------*/
//   //数据提交
//   var handler = function(event){
//     var pself = this;
//     var e = event || window.event;
//     defaultEvent(e);
//     var self = e.target || e.srcElement;
//     if(self.id !== 'wen-form')return;
//     var result = function(data){
//       if(data.flg == 1){
//         pjax(self,self.getAttribute('action'),'pjax-container');
//       }
//     }
//     if(self.tagName.toLowerCase() == 'form'){
//       ajax(self.getAttribute('action'),'post',serialize(self),result);
//     }
//   }
//   Utils.addHandler(jixiang.$('pjax-container'),'submit',handler);
// })()