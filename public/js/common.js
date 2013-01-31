/**
 * @Description Common.js
 * @Author      jixiangac
 * @Email       jixiangac@gmail.com
 */

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
/*------------------
     登录&注册验证
 -------------------*/
 if(jixiang.getByClass('form')[0]){
  var formA = jixiang.getByClass('form')[0];
  var formSub = formA.getElementsByTagName('button')[0];
  formSub.onclick = function(event){
    var e = event || window.event;
        e.preventDefault();
    var username = jixiang.$('username')
       ,password = jixiang.$('password');

    if(isEmpty(username)){
    	alert('请输入用户名！');
    	return false;
    }
    

    if(jixiang.$('re-password')!==null){//注册
    	var repassword = jixiang.$('re-password');
    	if(isEmpty(password) || isEmpty(repassword)){
    	   alert('请输入密码！');
    	   return false;
        }else{
    	  var rex = /^\w{6,20}$/;
    	  if(!rex.test(password.value) || !rex.test(repassword.value)){
            alert('请输入6-20位的密码！xxx')
            return false;
    	  }
    	
    	  if(repassword.value !== password.value){
    		alert('两次密码不一致！请重新输入！');
    		return false;
    	  }
       }
    }else{//登陆
      if(isEmpty(password)){
      	 alert('请输入密码！');
    	   return false;
      }else{
         var rex = /^\w{6,20}$/;
         if(!rex.test(password.value)){
         	alert('请输入6-20位的密码！')
            return false;
         }
      }
    }


    //ajax提交表单
      var xhr = new XMLHttpRequest();
      var url = formA.getAttribute('action');
      xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
        	if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
             var data = JSON.parse(xhr.responseText);
             if(data.flg===1){
             	 window.location.href=data.redirect;
             }else{
             	alert(data.msg);
             }
        	}else{
        		alert(xhr.status)
        	}
        }
      };
     xhr.open('post',url,true);
     xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
     xhr.send(serialize(formA));
  }
 }
 
/*--------------
     订餐模块
 ---------------*/
 //喜欢
 var like = jixiang.getByClass('like-gray');
 for(var i=0,len=like.length;i<len;i++){
    like[i].index=i;
    like[i].onclick = function(event){
      var e = event || window.event;
      e.preventDefault();
      var self = this;
      var href= self.getAttribute('href');
      var url=href.replace(/\/[\d]+/,'');
      var data={
        id : parseInt(href.split('/')[3],10)
      }
      var result = function(res){
         if(res.flg==1){
           self.className='like-red';
           var next=self.nextSibling;
           while(next.nodeType!==1){
             next=next.nextSibling;
           }
           next.innerHTML=(parseInt(next.innerHTML,10)+1);
           self.onclick=function(){return false;};
         }
      }
      ajax(url,'post',serializeData(data),result);
    }
 }
//我的订单
var orderlist =jixiang.$('orderlist');
if(!!orderlist){//获取订单
  var callback = function(res){
     orderlist.innerHTML=res;
     var script = document.createElement('script');
     script.type='text/javascript';
     script.src='/js/orderlist.js';
     document.body.appendChild(script);
  }
  ajax('/meal/orderlist','get',null,callback);
}
//点击收菜，完成订单交易
var orderDone = jixiang.getByClass('orderdone');
if(!!orderDone){
  var handler = function(){
    var self = this;
    if(!confirm('确定收菜吗？')){
       return false;
    }
    var mealid = parseInt(self.getAttribute('name'));
    var url = '/meal/order/done';
    var data = {
      mealid : mealid
    }
    var result = function(res){
      if(res.flg==1){
         var td = self.parentNode;
         td.innerHTML='<a class="common-btn grey-btn">已完成</a>';
      }
    }
    ajax(url,'post',serializeData(data),result);
  }
  for(var i=0,len=orderDone.length;i<len;i++){
    orderDone[i].index=i;
    Utils.addHandler(orderDone[i],'click',handler);
  }
}
/*------------
   问题咨询
  ------------*/
var qForm = jixiang.$('question');
if(!!qForm){
  var q = jixiang.$('q');
  var sub = jixiang.$('qsub');
  var hadQ = '';
  var handler = function(event){
    var e = event || window.event;
    e.preventDefault();
    var question=q.value.replace(/\s+/g,'');
    if(question.length===0){
       alert('写几个字吧？');
       q.value='';
       q.focus();
       return;
    }
    if(question == hadQ ){
      alert('这个问题的答案就在下面哦！');
      q.value='';
      q.focus();
      return;
    }
    sub.className = 'common-btn grey-btn';
    sub.innerHTML = '提交中..';
    Utils.removeHandler(sub,'click',handler);
    //发送
    var url = qForm.getAttribute('action');
    var type = qForm.getAttribute('method');
    var data = {
      question : question
    }
    var result = function(res){
       hadQ = question;
       var answer = jixiang.$('answer');
       if(res.flg==1){
          // console.log(res.answer)
          answer.innerHTML = res.answer;
       }else if(res.flg == 2){
          var data = res.answers;
          var a_title = '<h3>'+data.title+'</h3>';
          var a_content = '<p>'+data.content+'</p>';
          var btn = '<div class="review"><span class="useless">'
                           +'<a name="'+data.id+'" class="useless-btn" id="useless-btn">没用</a>'
                           +'<em>'+data.useless+'</em>'
                      +'</span>'
                      +'<span class="useful">'
                        +'<a name="'+data.id+'" class="useful-btn" id="useful-btn">有用</a>'
                        +'<em>'+data.useful+'</em>'
                    +'</div>';
          answer.innerHTML = a_title+a_content+btn;
          Utils.addHandler(jixiang.$('useless-btn'),'click',review);
          Utils.addHandler(jixiang.$('useful-btn'),'click',review);
       }else if(res.flg == 3){
         var info = res.answer;
         var html = '<div class="douban"><ul>';
         var list ='';
         if(res.subject == 1){
           for(var i=0,len=info.length;i<len;i++){
               var item='<li><h2>'+info[i].title+'</h2><div class="douban-img">'
                       +'<a target="_blank" href="'+info[i].alt+'"><img src="'+info[i].image+'" alt="'+info[i].title+'"></a></div>'
                     +'<div class="douban-info">'
                     +'<p>作者：'+info[i].author
                     +'</p><p>出版社：'+info[i].publisher
                     +'</p><p>出版年：'+info[i].pubdate
                     +'</p><p>页码：'+info[i].pages
                     +'</p><p>定价：'+info[i].price
                     +'</p><p>ISBN：'+info[i].isbn+'</p></div><div class="douban-summary"><h4>内容简介· · · · · ·</h4><p>'+info[i].summary
                     +'</p></div</li>';
               list+=item;
           }
         }else if(res.subject == 2){
           for(var i=0,len=info.length;i<len;i++){
             var item='<li><h2>'+info[i].title+'</h2><div class="douban-img">'
                       +'<a target="_blank" href="'+info[i].alt+'"><img src="'+info[i].image+'" alt="'+info[i].title+'"></a></div>'
                       +'<div class="douban-info">'
                       +'<p>发行年：'+info[i].pubdate+'</p></div></li>';
              list+=item;
           }
         }else if(res.subject == 3){
           for(var i=0,len=info.length;i<len;i++){
            var item = '<li><h2>'+info[i].title+'</h2><div class="douban-img">'
                       +'<a target="_blank" href="'+info[i].alt+'"><img src="'+info[i].image+'" alt="'+info[i].title+'"></a></div>'
                     +'<div class="douban-info">'
                     +'<p>歌手：'+info[i].singer
                     +'</p><p>出版年：'+info[i].pubdate+'</p></div><div class="douban-summary"><h4>曲目· · · · · ·</h4><div class="tracks">'+info[i].tracks
                     +'</div></div</li>';
             list+=item;
           }
         }
         html+=list+'</ul></div>';
         answer.innerHTML = html;
       }
      q.value='';
      sub.innerHTML = '1秒后可再提问';
      setTimeout(function(){
        sub.className = 'common-btn pink-btn';
        sub.innerHTML = '提交问题';
        Utils.addHandler(sub,'click',handler);            
      },1000);
    }
    var errorCallback = function(){
      var answer = jixiang.$('answer');
      answer.innerHTML = '这个问题让我好像崩溃了，要不你再问问其他的！';
      q.value='';
      sub.innerHTML = '1秒后可再提问';
      setTimeout(function(){
        sub.className = 'common-btn pink-btn';
        sub.innerHTML = '提交问题';
        Utils.addHandler(sub,'click',handler);            
      },1000);
    }
    ajax(url,type,serializeData(data),result,errorCallback);
  }

  Utils.addHandler(sub,'click',handler);

  var review = function(){
      var self = this;
      var id = parseInt(this.getAttribute('name'),10);
      var data = {
        id : id
      };
      if(self.id == 'useless-btn'){
         data.review = 0;
      }else if(self.id == 'useful-btn'){
         data.review = 1;
      }
      var result = function(res){
         if(res.flg == 1){
           var next = self.nextSibling;
           while(next.nodeType !==1){
             next=next.nextSibling;
           }
           next.innerHTML = (parseInt(next.innerHTML,10)+1);
           Utils.removeHandler(self,'click',review);
         }
      }
      ajax('/question/review','post',serializeData(data),result);
  }
}

