/**
*  后台JS
*/
define(function(require){

   var jixiang = require('./models/base')
      ,ajax = require('./models/ajax');
  /**
   * 公告管理
   * @return {[type]}
   */
  if(document.getElementById('notice')){
    //发布公告操作
    var form = jixiang.$('issue-form');
    jixiang.addHandler(form,'submit',ajax.ajaxForm);
    //丢弃公告的操作
    jixiang.addHandler(jixiang.$('throw-notice'),'click',function(event){
      jixiang.defaultEvent(event);
      var options = {
         url : this.getAttribute('href')
        ,callback : function(res){
          if(res.success){
            window.location.reload();
          }
        }
      }
      jixiang.ajax(options);
    });
  }
  /**
   *  人员管理
   */
  if(document.getElementById('people')){
     //删除操作
     jixiang.addHandler(jixiang.$('people-list'),'click',function(event){
       var e = event || windwo.event;
       var target = e.target || e.srcElement;
       while(target.tagName.toLowerCase() !== 'a'){
          target = target.parentNode;
          if(target.tagName.toLowerCase() === 'body')break;
       }
       if(target.getAttribute('role') !== 'del')return;
       e.preventDefault();
       var options = {
          url : target.getAttribute('href')
         ,type : 'get'
         ,callback : function(res){
           if(res.success){
              var tr = target.parentNode.parentNode;
              tr.parentNode.removeChild(tr);
           }else{
             alert(res.msg);
           }
         }
       }
       jixiang.ajax(options);
     });
  }

})
