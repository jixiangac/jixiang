/**
*  后台JS
*/
define(function (require) {

  var jixiang = require('./models/base')
    , ajax = require('./models/ajax')
    , popbox = require('./models/popbox');
  /**
   * 公告管理
   * @return {[type]}
   */
  if (document.getElementById('notice')) {
    //发布公告操作
    var form = jixiang.$('issue-form');
    jixiang.addHandler(form, 'submit', ajax.ajaxForm);
    //丢弃公告的操作
    jixiang.addHandler(jixiang.$('throw-notice'), 'click', function (event) {
      jixiang.defaultEvent(event);
      var options = {
          url : this.getAttribute('href')
        , callback : function (res) {
            if (res.success) {
              window.location.reload();
            }
          }
        };
      jixiang.ajax(options);
    });
  }
  /**
   *  人员管理
   */
  if (document.getElementById('people')) {
    //删除操作
    jixiang.addHandler(jixiang.$('people-list'), 'click', function (event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;

      while (target.tagName.toLowerCase() !== 'a') {
        if (target.id === 'people-list') {
          return;
        }
        target = target.parentNode;
      }

      if (target.getAttribute('role') !== 'del') {
        return;
      }
      e.preventDefault();

      if (!confirm('确认删除吗？删除后不可恢复！')) {
        return;
      }

      var options = {
          url : target.getAttribute('href')
        , type : 'get'
        , callback : function (res) {
            if (res.success) {
              var tr = target.parentNode.parentNode;
              tr.parentNode.removeChild(tr);
            } else {
              alert(res.msg);
            }
          }
        };
      jixiang.ajax(options);
    });
  }
  /**
   * 订单的状态改变
   * 配送订单，完成订单
   */
  if (document.getElementById('order-admin')) {
    jixiang.addHandler(jixiang.$('order-admin'), 'click', function (event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;
      while (target.tagName.toLowerCase() !== 'a') {
        if (target.id === 'order-admin') {
          return;
        }
        target = target.parentNode;
      }
      e.preventDefault();
      if (target.getAttribute('role') !== 'send') {
        return;
      }
      if (!confirm('确定配送该订单吗?')) {
        return;
      }
      var options = {
          url : target.href
        , callback : function (res) {
            var tbody = target.parentNode.parentNode.parentNode;
            tbody.style.display = 'none';
          }
        };
      jixiang.ajax(options);
    });
  }
  /**-------------------------
  *  商家菜单管理
  *  增加一条，保存，取消
  *  修改一条数据，保存取消
  *  删除一条数据
  *----------------------------/
 
  /**
   *  新记录的保存模型
   *  需要传递一个对象
   */
  function createTr(obj) {//新记录的保存模型

    return   '<td class="meal-item">' + obj.name + '</td>'
           + '<td class="meal-item">' + obj.price + '</td>'
           + '<td class="meal-item">' + obj.des + '</td>'
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
    var data = {};
    for (var i = 0, len = datas.length; i < len; i++) {
      newMeal[datas[i].name] = datas[i].value;
    }
    newMeal.id = + jixiang.$('meal-table').getAttribute('data-shop');
    var url = '/admin/meal/editshop?id=' + newMeal.id;
    if (tr.getAttribute('role') === 'modify') {
      url += '&modify=1';
      var oldDatas = jixiang.getByClass('meal-item', tr.nextSibling);
      var oldMeal = {};
      for (var i = 0, len = oldDatas.length; i < len; i++) {
        oldMeal[oldDatas[i].getAttribute('name')] = oldDatas[i].innerHTML;
      }
      data['old_meal'] = oldMeal;
    }
    data['new_meal'] = newMeal;
    var options = {
        url : url
      , data : jixiang.serializeData({data : JSON.stringify(data)})
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
    var meds = jixiang.getByClass('meal-item', tr);

    //创建一个新内容来替换旧内容
    var newEl = document.createElement('tr');
    newEl.setAttribute('role', 'modify');//标记是修改行
    newEl.innerHTML = mealModel;
    mealBody.insertBefore(newEl, tr);
    
    var modifyModels = jixiang.getByClass('meal-item', newEl);
    for (var i = 0 ; i < 3; i++) {
      modifyModels[i].value = meds[i].innerHTML;
    }
    tr.style.display = 'none';
  }
  /**
   * 删除一条数据
   * @return {[type]} [description]
   */
  function deleteOneData(target) {

    if (!confirm('确定删除吗？删除后不能恢复哦！')) {
      return;
    }

    var tr = target.parentNode.parentNode;
    var datas = jixiang.getByClass('meal-item', tr);
    var data = {};
    var newMeal = {};
    for (var i = 0, len = datas.length;i < len;i++) {
      newMeal[datas[i].getAttribute('name')] = datas[i].innerHTML;
    }
    newMeal.id = + jixiang.$('meal-table').getAttribute('data-shop');
    data['new_meal'] = newMeal;
    var options = {
        url : '/admin/meal/editshop?id=' + newMeal.id + '&delete=1'
      , data : jixiang.serializeData({data : JSON.stringify(data)})
      , callback : function (res) {
          if (res.success) {
            tr.parentNode.removeChild(tr);
          } else {
            alert(res.msg);
          }
        }
      };
    jixiang.ajax(options);
  }
  /**
  * 恢复没有数据的默认情况，从localstorage移除medicines数据
  * @return {[type]} [description]
  */
  // function initMed() {
  //   storage.removeItem('medicines');
  //   medBody.innerHTML = '<tr id="no-med"><td colspan="4"><a>还没有托购信息，点击【增加一条】进行添加，全部添加完成后请点击【提交】</a></td></tr>';
  //   medSub.className = 'hide';
  // }

  if (document.getElementById('meal-table')) {

    var mealTab = jixiang.$('meal-table')
      , mealBody = mealTab.getElementsByTagName('tbody')[0]
      , mealModel = jixiang.$('meal-model').innerHTML;
    
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

  /**
   *
   *  问诊预约
   *  答复 & 删除功能
   * 
   */
  function closeDenyBox(tbody) {
    var overlay = jixiang.getByClass('overlay')[0];
    tbody.parentNode.removeChild(tbody);//这里的tbody其实指的是popbox
    overlay.parentNode.removeChild(overlay);
  }
  if (document.getElementById('med-admin')) {
   /**
    * 答复
    */
    jixiang.addHandler(jixiang.$('med-admin'), 'click', function (event) {
      var e = event || window.event;
      var target = e.target || e.srcElement;
      while (target.tagName.toLowerCase() !== 'a') {
        if (target.id === 'med-admin') {
          return;
        }
        target = target.parentNode;
      }
      e.preventDefault();
      var role = target.getAttribute('role');
      var tbody = target.parentNode.parentNode.parentNode;
      if (role === 'sub' || role === 'cancel') {
        tbody = tbody.parentNode;
      }
      var trs = tbody.getElementsByTagName('tr')
        , lastTr = trs[trs.length - 1];
      /**
       * 显示回复表单
       * @type {[type]}
       */
      if (role === 'show-reply') {
        target.style.display = 'none';
        lastTr.className = '';
        return;
      }
      /**
       * 表单提交
       * @type {[type]}
       */
      if (role === 'sub') {
        var form = target.parentNode;
        var options = {
            url : form.getAttribute('action')
          , data : jixiang.serialize(form)
          , callback : function (res) {
              if (res.success) {
                var html = '<td>回复</td><td>' + res.msg + '</td>';
                lastTr.innerHTML = html;
              } else {
                alert(res.msg);
              }
            }
          };
        jixiang.ajax(options);
        return;
      }
      /**
       * 取消回复
       * @type {[type]}
       */
      if (role === 'cancel') {
        tbody.getElementsByTagName('tr')[1].getElementsByTagName('a')[1].style.display = 'block';
        lastTr.className = 'hide';
        return;
      }
      /**
       * 拒绝
       * @type {[type]}
       */
      if (role === 'deny') {
        var box = '<form><div class="mod-grey">'
                   + '<div class="mod-grey-hd"><h3>确定回绝该预约吗？</h3></div>'
                   + '<div class="mod-grey-bd mod-grey-bd-pd20">'
                      + '<label>回绝原因：<input type="text" name="replycontent" /></label>'
                   + '</div>'
                   + '<div class="mod-grey-ft">'
                     + '<a class="btn btn-info" data-url="' + target.getAttribute('data-url')
                          + '" role="deny-sub">提交</a>'
                     + '<a class="btn ml10" role="deny-cancel">取消</a>'
                   + '</div></div></form>';
        new popbox.init(box, jixiang.$('med-admin'));
        return;
      }
      /**
       * 拒绝的提交
       * @type {[type]}
       */
      if (role === 'deny-sub') {
        var options = {
            url : target.getAttribute('data-url')
          , data : jixiang.serialize(tbody)//这里的tbody就是拒绝表单了
          , callback : function (res) {
              if (res.success) {
                var html = '<td>回复</td><td>' + res.msg + '</td>';
                var theTrs = jixiang.$('med-admin').getElementsByTagName('tr');
                var last = theTrs[theTrs.length - 1];
                last.innerHTML = html;
                closeDenyBox(tbody.parentNode);
              } else {
                alert(res.msg);
              }
            }
          };
        jixiang.ajax(options);
        return;
      }
      /**
       * 拒绝的取消
       * @type {[type]}
       */
      if (role === 'deny-cancel') {
        closeDenyBox(tbody.parentNode);
        return;
      }
      /**
       * 药品的确认发放
       */
      if (role === 'med-done') {
        jixiang.ajax({
          url : target.getAttribute('href')
        , callback : function (res) {
            if (res.success) {
              window.location.reload();
            } else { 
              alert(res.msg);
            }
          }
        });
      }
      /**
       * 删除
       * @type {[type]}
       */
      if (role === 'delete') {
        var options = 'x';
      }
    });
  }

});
