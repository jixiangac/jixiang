/**
*  后台JS
*/
define(function (require) {

  var jixiang = require('./models/base')
    , ajax = require('./models/ajax');
  /**
   * 公告管理
   * @return {[type]}
   */
  if(document.getElementById('notice')){
    //发布公告操作
    var form = jixiang.$('issue-form');
    jixiang.addHandler(form, 'submit', ajax.ajaxForm);
    //丢弃公告的操作
    jixiang.addHandler(jixiang.$('throw-notice'), 'click', function (event) {
      jixiang.defaultEvent(event);
      var options = {
         url : this.getAttribute('href')
        ,callback : function(res){
          if(res.success){
            window.location.reload();
          }
        }
      }
      jixiang.ajax(options);
    });
  }
  /**
   *  人员管理
   */
  if(document.getElementById('people')){
     //删除操作
     jixiang.addHandler(jixiang.$('people-list'), 'click', function (event) {
       var e = event || windwo.event;
       var target = e.target || e.srcElement;
       while(target.tagName.toLowerCase() !== 'a'){
          if(target.id === 'people-list')return;
          target = target.parentNode;
       }
       if(target.getAttribute('role') !== 'del')return;
       e.preventDefault();
       if(!confirm('确认删除吗？删除后不可恢复！'))return;
       var options = {
          url : target.getAttribute('href')
         ,type : 'get'
         ,callback : function(res){
           if(res.success){
              var tr = target.parentNode.parentNode;
              tr.parentNode.removeChild(tr);
           }else{
             alert(res.msg);
           }
         }
       }
       jixiang.ajax(options);
     });
  }
  
  /**-------------------------
  *  订餐管理
  *  增加一条，保存，取消
  *  修改一条数据，保存取消
  *  删除一条数据
  *----------------------------/
 
  /**
   *  新记录的保存模型
   *  需要传递一个对象
   */
  function createTr(obj) {//新记录的保存模型

    return  '<td class="med-item">' + obj.name + '</td>'
           + '<td class="med-item">' + obj.price + '</td>'
           + '<td class="med-item">' + obj.des + '</td>'
           + '<td class="reply btn-control">'
              + '<a class="btn-reply" role="modify">修改</a>'
              + '<a class="btn-reply ml10" role="delete">删除</a>'
            + '</td>';
  }
  /**
   * 保存一条数据
   * @return {[type]} [description]
   */
  function saveOneData(target) {
    var tr = target.parentNode.parentNode;
    var datas = jixiang.getByClass('meal-item', tr);
    var newMeal = {};
    for (var i = 0, len = datas.length;i < len;i++) {
      newMeal[datas[i].name] = datas[i].value;
    }
    if (tr.getAttribute('role') === 'modify') {
       
    } else {//新增
      newMeal.id = + jixiang.$('meal-table').getAttribute('data-shop');
      var options = {
          url : '/admin/meal/editshop?id=' + newMeal.id
        , data : jixiang.serializeData(newMeal)
        , callback : function (res) {
            if (res.success) {
              //显示保存的数据
              tr.innerHTML = createTr(newMeal);
            } else {
              alert(res.msg);
            }
          }
      };
      jixiang.ajax(options);          
    }
  }
  /**
   * 取消保存数据
   * @return {[type]} [description]
   */
  function cancelOneData(target) {
    var tr = target.parentNode.parentNode;
    if (tr.getAttribute('role') === 'modify') {
      //修改数据时候的保存行为
      tr.nextSibling.removeAttribute('style');
    }
    tr.parentNode.removeChild(tr);
  }
  /**
   * 修改一条数据
   * @return {[type]} [description]
   */
  function modifyOneData(target) {
    var tr = target.parentNode.parentNode;
    var meds = jixiang.getByClass('med-item', tr);

    //创建一个新内容来替换旧内容
    var newEl = document.createElement('tr');
    newEl.setAttribute('role', 'modify');//标记是修改行
    newEl.innerHTML = medModel;
    medBody.insertBefore(newEl, tr);
    
    var modifyModels = jixiang.getByClass('med-item', newEl);
    for (var i = 0 ; i < 3; i++) {
      var child = modifyModels[i];
      //当select时选择默认值，否则是input框置入取来的值
      if (child.tagName.toLowerCase() === 'select') {
        var options = child.getElementsByTagName('option');
        for (var j = 0, len = options.length;j < len;j++) {
          if (meds[i].innerHTML === options[j].value) {
            options[j].setAttribute('selected', 'selected');
            break;
          }
        }
      } else {
        child.value = meds[i].innerHTML;
      }
    }
    tr.style.display = 'none';
  }
  /**
   * 删除一条数据
   * @return {[type]} [description]
   */
  function deleteOneData(target) {

    if (confirm('确定删除吗？删除后不能恢复哦！')) {

      var tr = target.parentNode.parentNode;
      var list = jixiang.getByClass('med-item', tr);

      for (var i in medicines) {
        if (medicines[i].name === jixiang.trim(list[0].innerHTML)) {
          medicines.splice(i, 1);
          storage.setItem('medicines', JSON.stringify(medicines));
        }
      }
      tr.parentNode.removeChild(tr);
      //如果medicines里面数据为空时，从localstorage里删除
      if (medicines.length === 0) {
        initMed();
      }
    }

  }
  /**
  * 恢复没有数据的默认情况，从localstorage移除medicines数据
  * @return {[type]} [description]
  */
  function initMed() {
    storage.removeItem('medicines');
    medBody.innerHTML = '<tr id="no-med"><td colspan="4"><a>还没有托购信息，点击【增加一条】进行添加，全部添加完成后请点击【提交】</a></td></tr>';
    medSub.className = 'hide';
  }

  if (document.getElementById('meal-table')) {

    var mealTab = jixiang.$('meal-table')
      , mealBody = mealTab.getElementsByTagName('tbody')[0]
      , mealModel = jixiang.$('meal-model').innerHTML

    /**
     * 增加一条新纪录
     * 绑定#add-med操作
     */
    jixiang.addHandler(jixiang.$('add-meal'), 'click', function () {

      //创建一条新纪录
      var newEl = document.createElement('tr');
      newEl.innerHTML = mealModel;
      var targetEl = mealBody.getElementsByTagName('tr')[0];
      mealBody.insertBefore(newEl, targetEl);

      if (targetEl.id === 'no-meal') {
        targetEl.parentNode.removeChild(targetEl);
      }

    });

    /**
     * 保存、取消、修改记录事件委托给#meal-table来执行
     * 相应按钮赋予role角色
     */
      
    jixiang.addHandler(jixiang.$('meal-table'), 'click', function (event) {

      var e = event || window.event;
      var target = e.target || e.srcElement;

      while (target.tagName.toLowerCase() !== 'a') {
        if (target.id === 'meal-table') {
          return;
        }
        target = target.parentNode;
      }

      var role = target.getAttribute('role');

      //保存事件
      if (role === 'save') {
        saveOneData(target);
        return;
      }
      //取消事件
      if (role === 'cancel') {
        cancelOneData(target);
        return;
      }
      //修改事件
      if (role === 'modify') {
        modifyOneData(target);
        return;
      }
      //删除事件
      if (role === 'delete') {
        deleteOneData(target);
        return;
      }
    });
  }
})
