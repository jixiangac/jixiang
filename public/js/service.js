/**
 *  @Description 服务类
 *  @Author      jixiangac
 *  @E-mail      jixiangac@gmail.com
 *
 *
 *  服务包括： 线上问诊，问诊预约，药品购买，家政服务
 *  
 */
define(function(require,exports,module){
   var jixiang = require('./models/base')
      ,ajax = require('./models/ajax');
   
   /**
    *  wen-form相关预约的提交表单
    *  问诊/家政预约
    */
   if(document.getElementById('wen-form')){
      jixiang.addHandler(jixiang.$('wen-form'),'submit',function(event){
         jixiang.defaultEvent(event);

         var item = this.getElementsByTagName('select');
         var _now = new Date();
         var now = [+_now.getMonth()+1,+_now.getDate()];
         
         for(var i = 0,len = item.length-1;i < len;i++){
           if(+item[i].value < now[i]){
               alert('请选择一个未来的时间！？');
               return;
           }
         }

         ajax.ajaxForm.call(this,event);
      });
   }
   /**
    *  药品购买
    *  增加一条，保存，取消
    *  修改一条数据，保存取消
    *  删除一条数据
    */
   if(document.getElementById('med-table')){

        var medTab = jixiang.$('med-table')
           ,medBody = medTab.getElementsByTagName('tbody')[0]
           ,medModel = jixiang.$('med-model').innerHTML
           ,medSub = jixiang.$('med-sub');
        /**
         * 增加一条新纪录
         * 绑定#add-med操作
         */
        jixiang.addHandler(jixiang.$('add-med'),'click',function(){

           if(medSub.className.indexOf('hide') !== -1)medSub.className = '';//显示提交按钮
           //创建一条新纪录
           var newEl = document.createElement('tr');
           newEl.innerHTML = medModel;
           var targetEl = medBody.getElementsByTagName('tr')[0];
           medBody.insertBefore(newEl,targetEl);
           if(targetEl.id === 'no-med')targetEl.parentNode.removeChild(targetEl);

        });

        /**
         * 保存、取消、修改记录事件委托给#med-table来执行
         * 相应按钮赋予role角色
         */
        
        jixiang.addHandler(jixiang.$('med-table'),'click',function(event){
          var e = event || window.event;
          var target = e.target || e.srcElement;

          while(target.tagName.toLowerCase() !== 'a'){
            if(target.id === 'med-table')return;
            target = target.parentNode;
          }

          var role = target.getAttribute('role');

          //保存事件
          if( role === 'save' ){
            saveOneData(target);
            return;
          }
          //取消事件
          if( role === 'cancel' ){
            cancelOneData(target);
            return;
          }
          //修改事件
          if( role === 'modify' ){
            modifyOneData(target);
            return;
          }
          //删除事件
          if( role === 'delete' ){
            deleteOneData(target);
            return;
          }
          //提交订单操作
          if( role === 'sub'){
            if(!confirm('确定提交托购单吗？提交后不能修改，等待回复？'))return;
            var options = {
              url : '/doctor?cat=2'
             ,data : jixiang.serializeData({list:JSON.stringify(medicines)})
             ,callback : function(res){
               if(res.success){
                 storage.removeItem('medicines');
                 window.location.reload();
               }
             }
            }
            jixiang.ajax(options);
            return;
          }

        });
        /**
         *  新记录的保存模型
         *  需要传递一个对象
         */
        function createTr(obj){//新记录的保存模型
          return  '<td class="med-item">'+obj.name+'</td>'
                 +'<td class="med-item">'+obj.num+'</td>'
                 +'<td class="med-item">'+obj.description+'</td>'
                 +'<td class="reply btn-control">'
                    +'<a class="btn-reply" role="modify">修改</a>'
                    +'<a class="btn-reply ml10" role="delete">删除</a>'
                  +'</td>';
        }
        /**
         * 读取存在本地的localstorage的药品值
         */
        var storage = window.localStorage;
        var medicines = [];
        if(storage.getItem('medicines')!== null){
          //隐藏无药品的信息提示
          if(jixiang.$('no-med')){
            var nomed =jixiang.$('no-med');
            nomed.parentNode.removeChild(nomed);
          }
          //显示提交按钮
          medSub.className = '';
         
          medicines = JSON.parse(storage.getItem('medicines'));
          var html ='';
          for(var i=medicines.length-1;i>=0;i--){
              html += '<tr>'+createTr(medicines[i])+'</tr>';
          }
          medBody.innerHTML = html;
        }
        /**
         * 保存一条数据
         * @return {[type]} [description]
         */
        function saveOneData(target){
          var tr = target.parentNode.parentNode;
          var datas = jixiang.getByClass('med-item',tr);
          var newMed = {
             name : jixiang.trim(datas[0].value)
            ,num : parseInt(datas[1].value,10)
            ,description : jixiang.trim(datas[2].value)
          }
          if( tr.getAttribute('role') === 'modify'){
            for(var i in medicines){
              var med = medicines[i];
              if( med.name === newMed.name){
                for(var key in newMed){
                  med[key] = newMed[key];
                }
              }
            }
          }else{//存储到localstorage中
            medicines.push(newMed);           
          }
          storage.setItem('medicines',JSON.stringify(medicines));
          //显示保存的数据
          tr.innerHTML = createTr(newMed);
        }
        /**
         * 取消保存数据
         * @return {[type]} [description]
         */
        function cancelOneData(target){
           var tr = target.parentNode.parentNode;
           if( tr.getAttribute('role') === 'modify'){
             //修改数据时候的保存行为
             tr.nextSibling.removeAttribute('style');
           }
           tr.parentNode.removeChild(tr);
        }
        /**
         * 修改一条数据
         * @return {[type]} [description]
         */
        function modifyOneData(target){
          var tr = target.parentNode.parentNode;
          var meds = jixiang.getByClass('med-item',tr);

          //创建一个新内容来替换旧内容
          var newEl = document.createElement('tr');
          newEl.setAttribute('role','modify');//标记是修改行
          newEl.innerHTML = medModel;
          medBody.insertBefore(newEl,tr);
          
          var modifyModels = jixiang.getByClass('med-item',newEl);
          for(var i = 0 ; i < 3; i++){
            var child = modifyModels[i];
            //当select时选择默认值，否则是input框置入取来的值
            if(child.tagName.toLowerCase() === 'select'){
                var options = child.getElementsByTagName('option');
                for(var j = 0,len = options.length;j < len;j++){
                  if(meds[i].innerHTML === options[j].value){
                    options[j].setAttribute('selected','selected');
                    break;
                  }
                }
            }else{
              child.value = meds[i].innerHTML;
            }
          }
          tr.style.display = 'none';
        }
        /**
         * 删除一条数据
         * @return {[type]} [description]
         */
        function deleteOneData(target){

          if(confirm('确定删除吗？删除后不能恢复哦！')){

            var tr = target.parentNode.parentNode;
            var list = jixiang.getByClass('med-item',tr);

            for(var i in medicines){
              if( medicines[i].name === jixiang.trim(list[0].innerHTML) ){
                medicines.splice(i,1);
                storage.setItem('medicines',JSON.stringify(medicines))
              }
            }
            tr.parentNode.removeChild(tr);
            //如果medicines里面数据为空时，从localstorage里删除
            if(medicines.length === 0)initMed();
          }

        }
       /**
        * 恢复没有数据的默认情况，从localstorage移除medicines数据
        * @return {[type]} [description]
        */
        function initMed(){
          storage.removeItem('medicines');
          medBody.innerHTML='<tr id="no-med"><td colspan="4"><a>还没有托购信息，点击【增加一条】进行添加，全部添加完成后请点击【提交】</a></td></tr>';
          medSub.className='hide';
        }
   }
   
   /**
    * 
    */

});