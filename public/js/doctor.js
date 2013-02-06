/**
 *  @Description 问医JS
 *  @Author      jixiangac
 *  @E-mail      jixiangac@gmail.com
 *  @Date        2013/02/03 23:59
 */
(function(){
  /*-----------
     问医首页
   -----------*/
  if(!!jixiang.$('doctor-wrap')){
    var doctor = jixiang.$('doctor-wrap');
    var navlist = jixiang.$('doctor-nav').getElementsByTagName('li');
    var content = jixiang.$('doctor-main')
    //导航切换
    for(var i=0,len=navlist.length;i<len;i++){
      (function(i){
         Utils.addHandler(navlist[i],'click',function(){
           for(var j=0;j<navlist.length;j++){
             navlist[j].getElementsByTagName('a')[0].className='';
           }
           this.getElementsByTagName('a')[0].className = 'cur';
           content.style.left = '-'+722*i+'px';
         });
      })(i)
    }
    //数据提交
    var form = document.getElementsByTagName('form');
    var handler = function(event){
      var e = event || window.event;
      e.preventDefault();
      var self = this;
      var url = self.getAttribute('action')
         ,type = self.getAttribute('method');
      Utils.removeHandler(self,'submit',handler);
      Utils.addHandler(self,'submit',defaultEvent);
      var result = function(data){
        if(data.flg == 1){
          alert(data.msg);
          setTimeout(function(){
            Utils.removeHandler(self,'submit',defaultEvent);
            Utils.addHandler(self,'submit',handler);            
          },1000);
        }else{
          alert(data.msg);
        }
      }
      ajax(url,type,serialize(self),result)
    }
    for(var i=0,len=form.length;i<len;i++){
      (function(i){
        Utils.addHandler(form[i],'submit',handler);
      })(i)
    }

    //问药
    if(!!jixiang.$('add-med')){
      //操作
      var add = jixiang.$('add-med')
         ,medTab = jixiang.$('med-table')
         ,medBody = medTab.getElementsByTagName('tbody')[0]
         ,medModel = jixiang.$('med-model').innerHTML
         ,medSub = jixiang.$('med-sub');
      //读取本地数据
      var storage = window.localStorage;
      var medicines = [];
      function hideSub(){
        storage.removeItem('medicines');
        medBody.innerHTML='<tr id="no-med"><td colspan="4"><a>还没有托购信息，点击【增加一条】进行添加，全部添加完成后请点击【提交】</a></td></tr>';
        medSub.className='hide';
      }
      //删除一条数据
      function deleteTr(){
        if(confirm('确定删除吗？删除后不能恢复。')){
          var delTr = this.parentNode.parentNode;
          var td = delTr.getElementsByTagName('td');
          for(var i in medicines){
            if(medicines[i].name == trim(td[0].innerHTML)){
                medicines.splice(i,1);
                storage.setItem('medicines',JSON.stringify(medicines));
            }
          }
          delTr.parentNode.removeChild(delTr);
          if(medicines.length === 0){
            hideSub();
          }
        }
      }
      //修改一条数据
      function modifyTr(){
        var modifyTr = this.parentNode.parentNode;
        var td = modifyTr.getElementsByTagName('td');
        var newEl = document.createElement('tr');
        newEl.innerHTML = medModel;
        medBody.insertBefore(newEl,modifyTr);
        var modifyTd = newEl.getElementsByTagName('td');
        var oldname = trim(td[0].innerHTML);
        modifyTd[0].getElementsByTagName('input')[0].value = oldname;
        modifyTd[2].getElementsByTagName('input')[0].value = trim(td[2].innerHTML);
        var opLen = modifyTd[1].getElementsByTagName('select')[0].getElementsByTagName('option');
        var opNum = parseInt(td[1].innerHTML,10);
        for(var i=0,len=opLen.length;i<len;i++){
          if(parseInt(opLen[i].value,10)==opNum){
            opLen[i].setAttribute('selected','selected');
          }
        }
        modifyTr.style.display = 'none';
        //绑定修改中的取消事件
        Utils.addHandler(jixiang.getByClass('med-cancel',newEl)[0],'click',function(){
          modifyTr.style.cssText = '';
          newEl.parentNode.removeChild(newEl);
        });
        //修改数据后进行保存
        Utils.addHandler(jixiang.getByClass('med-save',newEl)[0],'click',function(){
          var medinfo = jixiang.getByClass('med-item',newEl);
          var name = trim(medinfo[0].value);
          for(var i in medicines){
            if(name !== oldname && medicines[i].name == name){
              alert('已经有【'+name+'】这个药了！');
              break;
            }else if(medicines[i].name == oldname){
               medicines[i].name = name;
               medicines[i].num = medinfo[1].value;
               medicines[i].description=medinfo[2].value;
               storage.setItem('medicines',JSON.stringify(medicines));
               td[0].innerHTML = name;
               td[1].innerHTML = medinfo[1].value;
               td[2].innerHTML = medinfo[2].value;
               newEl.parentNode.removeChild(newEl);
               modifyTr.style.cssText = '';
            }
          }

        })
      }
      function createTr(obj){//新记录的保存模型
        return  '<td class="med-name">'+obj.name
                  +'</td><td class="reply">'+obj.num
                  +'</td><td>'+obj.description
                  +'</td><td class="reply btn-control">'
                  +'<a class="btn-reply med-modify">修改</a>'
                  +'<a class="btn-reply med-delete">删除</a>'
                  +'</td>';
      }
      if(storage.getItem('medicines')!== null){
        if(!!jixiang.$('no-med')){//隐藏无信息提示
          var nomed =jixiang.$('no-med');
          nomed.parentNode.removeChild(nomed);
        }
        medSub.className = '';//显示提交按钮
        medicines = JSON.parse(storage.getItem('medicines'));
        var html ='';
        for(var i=medicines.length-1;i>=0;i--){
            html += '<tr>'+createTr(medicines[i])+'</tr>';
        }
        medBody.innerHTML = html;
        var delLis = jixiang.getByClass('med-delete',medBody);
        for(var i=0,len=delLis.length;i<len;i++){
          Utils.addHandler(delLis[i],'click',deleteTr)
        }
        var modifyLis = jixiang.getByClass('med-modify',medBody);
        for(var i=0,len=modifyLis.length;i<len;i++){
          Utils.addHandler(modifyLis[i],'click',modifyTr)
        }
      }
      //增加一条记录
      var handler = function(){
        if(jixiang.hasClass(medSub,'hide')){
          medSub.className = '';
        }
        var newEl = document.createElement('tr');
        newEl.innerHTML = medModel;
        var targetEl = medBody.getElementsByTagName('tr')[0];
        //增加记录时的取消行为
        Utils.addHandler(jixiang.getByClass('med-cancel',newEl)[0],'click',function(){
           newEl.parentNode.removeChild(newEl);
          if(medicines.length === 0){
            hideSub()
          }
        });
        //增加记录时的保存操作
        Utils.addHandler(jixiang.getByClass('med-save',newEl)[0],'click',function(){
          var medinfo = jixiang.getByClass('med-item',newEl);
          var name = trim(medinfo[0].value);
          for(var i in medicines){
            if(medicines[i].name == name){
              alert('已经有【'+name+'】这个药了！');
              return;
            }
          }
          var newMed = {
             name : name
            ,num : parseInt(medinfo[1].value,10)
            ,description : medinfo[2].value
          }
          medicines.push(newMed);
          storage.setItem('medicines',JSON.stringify(medicines));
          var medsave = this.parentNode.parentNode;
          medsave.innerHTML = createTr(newMed);
          Utils.addHandler(jixiang.getByClass('med-delete',medsave)[0],'click',deleteTr);//绑定删除事件
          Utils.addHandler(jixiang.getByClass('med-modify',medsave)[0],'click',modifyTr);//绑定修改事件
        })
        medBody.insertBefore(newEl,targetEl);
        if(!!jixiang.$('no-med')){
          var nomed =jixiang.$('no-med');
          nomed.parentNode.removeChild(nomed);
        }
      }
      Utils.addHandler(add,'click',handler);
      //提交药品托购
      var subOrder = function(){
        if(!confirm('确定提交托购单吗？提交后不能修改，等待回复？'))return;
        var result = function(res){
          if(res.flg == 1){
            alert(res.msg);
            window.location.href = '/doctor/medicine';
            storage.removeItem('medicines');
          }
        }
        ajax('/doctor','post',serializeData({docType:2,list:JSON.stringify(medicines)}),result);       
      }
      Utils.addHandler(medSub,'click',subOrder);
    }


  }

})()