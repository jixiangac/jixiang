/**
 * Service.js
 */
//tab
(function(){
  var tab = jixiang.$('tab');
  var handler = function(event){
    var pself = this;
    var e = event || window.event;
    defaultEvent(e);
    var self = e.target || e.srcElement;
    if(self.tagName.toLowerCase() == 'button')return;
    while(self.tagName.toLowerCase() !== 'a'){
      self = self.parentNode;
    }

    if(self.className.indexOf('pjax') == -1)return;
    pjax(self,self.getAttribute('href'),'pjax-container',function(){
       var cat = self.getAttribute('href').replace('/service?cat=','')
       if(parseInt(cat,10) == 3){
         var script = document.createElement('script');
         var service_js = jixiang.$('service-js');
         script.src = '/js/question.js';
         if(!!service_js){
           service_js.innerHTML = '';
           service_js.appendChild(script);
         }else{
           var service_js = document.createElement('div');
           service_js.id = 'service_js';
           service_js.appendChild(script);
           document.appendChild(service_js);
         }
       }
    });

    if(pself.id == 'tab'){
      for(var i=0,alis=pself.getElementsByTagName('a'),len=alis.length;i<len;i++){
         alis[i].className = 'pjax';
      }
      self.className = 'cur';     
    }

  }
  Utils.addHandler(tab,'click',handler)
  Utils.addHandler(jixiang.$('pjax-container'),'click',handler);
})()