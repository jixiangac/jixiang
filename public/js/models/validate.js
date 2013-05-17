/**
 * @Description     表单验证类
 * @Author          jixiangac
 * @Email           jixiangac@gmail.com
 */
define(function(require,exports,module){

  var jixiang = require('./base');

  /**
   * 验证规则
   */
  var pattern = {
    'realname' :{
       name : '真实姓名'
      ,rex : '^[\u4e00-\u9fa5]{2,}$'
      ,tips : '请输入真实姓名！'
      ,error : '真实姓名由中文组成！'
    }
   ,'username':{
       name :　'用户名'
      ,rex : '^[\\w]{3,10}'
      ,tips : '请输入用户名！'
      ,error : '用户名由字母、数字、下划线组成！'
    }
   ,'email' : {
      name : '邮箱'
     ,rex : '^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]{2,3}$'
     ,tips : '请输入邮箱'
     ,error : '邮箱格式出错！'
   }
   ,'password' : {
      name : '密码'
     ,rex : '^[\\w]{6,12}$'
     ,tips : '请输入6位以上的密码'
     ,error : '请输入6位以上的密码！'
   }
   ,'repassword' :{
      name : '重复密码'
     ,rex : '^[\\w]{6,12}$'
     ,tips : '请重复输入密码'
     ,error : '请输入6位以上的密码！'
   }
   ,'website' : {
     name : '网站名称'
    ,rex : '^[^\\s]+$'
    ,tips : '请输入网站名称'
    ,error : '网站名称至少两个字！'
   }
   ,'url' : {
     name : '网站地址'
    ,rex : '^[a-zA-z]+:\/\/[^\\s]*$'
    ,tips : '请输入网站地址'
    ,error : '网站地址出错！'
   }
   ,'q' : {
     name : '问题'
    ,rex : '^[^\\s]+$'
    ,tips : '请输入问题！'
    ,error :'问题不能为空哦！'
   }
  }  
  
  /**
   * 必填字段
   * 全部通过return true
   */
  exports.require = function(){
    var name = this.name,
        value = jixiang.trim(this.value);
    //不为空的判断
    if(value.length === 0){
      alert(pattern[name].name + '不能为空！');
      return false;
    }
    //重复密码判断
    if(name === 'repassword'){
       var pass = this.parentNode.previousSibling.getElementsByTagName('input')[0].value;
       if( value !== jixiang.trim(pass) ){
         alert('两次密码不一致！')
         return false;
       }
    }
    
    //根据验证规则来判断
    var rex = new RegExp(pattern[name].rex,'gi');

    if( !rex.test(value) ){
      alert(pattern[name].error);
      return false;
    }

    return true;
  } 

  /**
   * 
   */

})