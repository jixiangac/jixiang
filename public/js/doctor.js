/**
 * Œ “ΩJS
 */
(function(){
  var doctor = jixiang.$('doctor-wrap');
  if(!!doctor){
    var navlist = jixiang.$('doctor-nav').getElementsByTagName('li');
    var content = jixiang.$('doctor-main')
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
  }
})()