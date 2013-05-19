  /**
   * AJAX类
   * @jixiangac
   */
  
define(function(require,exports,module){
  var jixiang = require('./base');
  var validate = require('./validate');

  exports.ajaxForm = function(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    e.preventDefault();
    //验证必填字段
    var requires = jixiang.getByClass('require',target);
    var len = requires.length;
    var i = 0;
    while( i < len ){
      if( !validate.require.call(requires[i]) ){
        return false;
        break;
      }
      i++;
    }
    //禁用表单按钮
    var btn = target.getElementsByTagName('button')[0];
    btn.disabled = true;
    //提交表单数据
    var formId = target.id;
    var options = {
       url : target.getAttribute('action')
      ,type : target.getAttribute('method')
      ,data : jixiang.serialize(target)
      ,callback : function(res){
        btn.disabled = false;
        alert(res.msg);
        if(!res.success)return;
        if(res.redirect)window.location.href = res.redirect;
        if(res.reload)window.location.reload();
      }
    }
    jixiang.ajax(options);
  }

})