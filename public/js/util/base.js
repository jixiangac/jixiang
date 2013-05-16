/**
 * @Description base.js
 * @Author      jixiangac
 * @Email       jixiangac@gmail.com
 */

define(function(require,exports,module){

  /*-----------------
       基本操作
   -----------------*/
  var jixiang = {
    $: function(obj) {
      return document.getElementById(obj);
    },
    hasClass: function(node, className) {
      var names = node.className.split(/\s+/);
      for(var i = 0, len = names.length; i < len; i++) {
        if(names[i] == className) return true;
      }
      return false;
    },
    getByClass: function(className, content) {
      var content = content || document;
      if(content.getElementsByClassName) {
        return content.getElementsByClassName(className);
      } else {
        var nodes = content.getElementsByTagName('*');
        var ret = [];
        for(var i = 0, len = nodes.length; i < len; i++) {
          if(jixiang.hasClass(nodes[i], className)) {
            ret.push(nodes[i]);
          }
          return ret;
        }
      }
    }
  }
  exports.$ = jixiang.$;
  exports.hasClass = jixiang.hasClass;
  exports.getByClass = jixiang.getByClass;

  //侦听事件
  var Utils = {
    addHandler : function(obj,type,handler){
      if(obj.addEventListener){
        obj.addEventListener(type,handler,false);
      }else if(obj.attachEvent){
        obj.attachEvent('on'+type,handler);
      }else{
        obj['on'+type]=handler;
      }
    }
   ,removeHandler : function(obj,type,handler){
     if(obj.removeEventListener){
        obj.removeEventListener(type,handler,false);
     }else if(obj.detachEvent){
        obj.detachEvent('on'+type,handler);
     }else{
       obj['on'+type]=null;
     }
   }
  }
  exports.addHandler = Utils.addHandler;
  exports.removeHandler = Utils.removeHandler;
  
  //表单序列化
  function serialize(form){
    var parts = []
     ,field = null
     ,optLen
     ,option
     ,optValue;
     for(var i=0,len=form.elements.length;i<len;i++){
        field = form.elements[i];
        switch(field.type){
          case 'select-one':
          case 'select-multiple':
            if(field.name.length){
              for(var j=0,optLen=field.options.length;j<optLen;j++){
                option = field.options[j];
                if(option.selected){
                  optValue = '';
                  if(option.hasAttribute){
                    optValue = (option.hasAttribute('value') ? 
                                option.value : option.text );
                  }else{
                    optValue = (option.attribute('value').specified ?
                              option.value : option.text );
                  }
                  parts.push(encodeURIComponent(field.name) + '=' + 
                           encodeURIComponent(optValue));
                }
              }
            }
            break;

          case undefined :
          case 'file' :
          case 'submit' :
          case 'reset' :
          case 'button' :
            break;

          case 'radio' :
          case 'checkbox' :
            if(!field.checked){
              break;
            }
          default : 
            if(field.name.length){
              parts.push(encodeURIComponent(field.name) + '=' + 
                       encodeURIComponent(field.value));
            }
        }
     }
     return parts.join('&');
  }
  //序列化
  function serializeData(data){
    var res = [];
    for(var key in data){
       res.push(encodeURIComponent(key) + '=' + 
                       encodeURIComponent(data[key]))
    }
    return res.join('&');
  }
  //判断填写是否为空
  function isEmpty(obj){
    return !!obj.value.replace(/\s+/,'').length === 0;
  }
  //去掉两边的空
  function trim(str){
    return str.replace(/\s+/g,'');
  }
  /*--------------
      Ajax封装
   --------------*/
  function ajax(url,type,data,callback,errorCallback) {
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
          if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
            if(type=='post'){
               var result = JSON.parse(xhr.responseText);
               callback(result);//成功后的回调
             }else{
               callback(xhr.responseText);
             }
          } else {
            if(errorCallback){
               errorCallback();
            }else{
              alert(xhr.status+'错误');
            }
          }
        }
      }
      xhr.open(type, url, true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(data);
  }
  //阻止默认行为
  function defaultEvent(event){
    var e = event || window.event;
    e.preventDefault();
  }
  /*--------------
    select选择跳转
   --------------*/
   (function(){
     if(!!jixiang.$('sel-cat')){
       var host = location.pathname;
       var selectCat = jixiang.$('sel-cat');
       Utils.addHandler(selectCat,'change',function(){
         if(parseInt(this.value,10) == 0){
            window.location.href = host;
         }else{
           window.location.href = host+'?cat='+this.value;       
         }

       });
      }
   })()

  /*-------------
    --- PJAX ---
   ------------*/
  var pjax = function(self,url,container,callback){
    var container = jixiang.$(container);
    var aniNum = 0;
    var ani = setInterval(function(){
      (aniNum += 40) > 800 ? sendPjax() : container.style.marginLeft = '-'+aniNum+'px';
    },10);

    var state = {
      url : url
     ,title : document.title
    }
    var purl = (url.indexOf('?') !== -1) ? url+'&pjax=1' : url+'?pjax=1';
    var result = function(res){
        container.innerHTML = res;
        ani = setInterval(function(){
          (aniNum -= 40) == -40 ? clearInterval(ani) : container.style.marginLeft = '-'+aniNum+'px';
        },10);
        window.history.pushState(state,document.title,url);
        if(callback)callback();
    };

    function sendPjax(){
      clearInterval(ani);
      ajax(purl,'get',null,result);
    }

  }

})