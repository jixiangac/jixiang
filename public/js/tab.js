/**
 * @Description  Tab.js
 * @Author       jixiangac
 * @E-mail       jixiangac@gmail.com
 * @Date         2013-02-08 12:12
 */
//tab
if(!!jixiang.$('tab')){
  var tab = jixiang.$('tab');
  var handler = function(event){
    var pself = this;
    var e = event || window.event;
    defaultEvent(e);
    var self = e.target || e.srcElement;
    while(self.tagName.toLowerCase() !== 'a'){
      self = self.parentNode;
    }
    if(jixiang.hasClass(self,'tab-title'))return;
    if(self.className.indexOf('pjax') == -1)return;
    pjax(self,self.getAttribute('href'),'pjax-container');
    for(var i=0,alis=pself.getElementsByTagName('a'),len=alis.length;i<len;i++){
       alis[i].className = 'pjax';
    }
    self.className = 'cur';
  }
  Utils.addHandler(tab,'click',handler)
}