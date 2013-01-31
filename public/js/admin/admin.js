/**
 * @Description  管理后台JS
 * @Author       jixiangac
 * @E-mail       jixiangac@gmail.com
 */

//通用后台AJAX提交
var sub=jixiang.getByClass('sub');
if(!!sub){
  var subClick = function(event){
    var self = this;
    var e = event || window.event;
    e.preventDefault();
    var tips='确定删除吗？';
    if(jixiang.hasClass(self,'send')){
      tips='确定发送吗？'
    }
    if(!confirm(tips)){
      return false;
    }
    var id=parseInt(self.getAttribute('href').split('/')[4]);
    var url=self.getAttribute('href').replace(/\/[\d]{1,}/,'');
    var result = function(res){
      if(res.flg==1){
        var td = self.parentNode;  
        if(jixiang.hasClass(self,'delete')){
           var tr = td.parentNode;
           tr.parentNode.removeChild(tr);  
        }else{
           td.innerHTML='<a class="delete common-btn">订单已发</a>';
        }
      }else{
        alert('操作失败！')
      }
    }
    ajax(url,'post',serializeData({id:id}),result)
  }
  for(var i=0,len=sub.length;i<len;i++){
    sub[i].index=i;
    Utils.addHandler(sub[i],'click',subClick);
  }
}