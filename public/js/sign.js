/**
 * 登陆&注册
 */
 if(!!jixiang.getByClass('form')[0]){
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
 