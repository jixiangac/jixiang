/**
 * @Description  后台问医JS
 * @Author       jixiangac
 * @Email        jixiangac@gmail.com
 * @Date         2013-2-4 16:00
 */
(function(){
  //显示回复
  if(!!jixiang.getByClass('doreply')){

    var replybtn = jixiang.getByClass('doreply');

    var subreply = function(event){//回复的提交
      defaultEvent(event);
      var form = this.parentNode;
      var type = form.getAttribute('method')
         ,url = form.getAttribute('action');
      var result = function(data){
        if(data.flg == 1){
          var tr =form.parentNode.parentNode;
          var html = '<td class="reply">回复</td><td><p>'+data.msg+'</p></td>';
          tr.innerHTML= html;
        }
      }
      var data = serialize(form);
      if(jixiang.hasClass(this,'disagree')){
         data += '&'+serializeData({disagree:true})
      }
      ajax(url,type,data,result); 
    }

    var handler = function(){//显示回复框
      this.style.display = 'none';
      var parent = this.parentNode.parentNode;
      var tfoot = parent.getElementsByTagName('tfoot')[0];
      tfoot.className = '';
      tfoot.getElementsByTagName('input')[0].focus();
      Utils.addHandler(tfoot.getElementsByTagName('button')[0],'click',subreply);
      Utils.addHandler(tfoot.getElementsByTagName('a')[0],'click',subreply);
    }

    for(var i=0,len=replybtn.length;i<len;i++){
      (function(i){
        Utils.addHandler(replybtn[i],'click',handler);
      })(i)
    }

  }
})()