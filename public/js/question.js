/**
 * 问题JS
 */
define(function(require,exports,module){
  var jixiang = require('./models/base');

  var qInput = jixiang.$('q');
  var cat = parseInt(this.name,10) || 0;
  var hadQ = '';
  var answer = jixiang.$('answer');
  var hadClick = false;//是否点击过 +1,-1

  var handler = function(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    e.preventDefault();

    var question=q.value.replace(/\s+/g,'');
    //问题为空就阻止提交
    if(question.length===0){
       alert('写几个字吧？');
       q.value='';
       q.focus();
       return;
    }
    //提交的是上一个问题阻止掉
    if(question == hadQ ){
      alert('这个问题的答案就在下面哦！');
      q.value='';
      q.focus();
      return;
    }
    
    //问题分类
    if(cat == 1){
      question = '@问医：'+ question;
    }else if(cat == 2){
      question = '#政策#' + question;
    }

    var btns = target.getElementsByTagName('button')[0];
    btns.disabled = true;
    btns.innerHTML = '提交中..';
    //回调函数
    var callback = function(res){
       hadQ = question;
       if(res.flg==1){
          // console.log(res.answer)
          answer.innerHTML = res.answer;
       }else if(res.flg == 2){
          var data = res.answers;
          var a_title = '<h3>'+data.title+'</h3>';
          var a_content = '<p>'+data.content+'</p>';
          var btnText = '<div class="review"><span class="useless">'
                           +'<a name="'+data._id+'" class="useless-btn" id="useless-btn" role="btn">没用</a>'
                           +'<em>'+data.useless+'</em>'
                      +'</span>'
                      +'<span class="useful">'
                        +'<a name="'+data._id+'" class="useful-btn" id="useful-btn" role="btn">有用</a>'
                        +'<em>'+data.useful+'</em>'
                    +'</div>';
          answer.innerHTML = a_title+a_content+btnText;
          hadClick = false;
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
      btns.innerHTML = '1秒后可再提问';
      setTimeout(function(){
        btns.disabled = false;
        btns.innerHTML = '提交问题';            
      },1000);
    }
    //错误发生后的回调
    var errorCallback = function(){
      answer.innerHTML = '这个问题让我好像崩溃了，要不你再问问其他的！';
      q.value='';
      btns.innerHTML = '1秒后可再提问';
      setTimeout(function(){
        btns.disabled = false;
        btns.innerHTML = '提交问题';          
      },1000);
    }
    //提交的数据和回调参数
    var options = {
       url : this.getAttribute('action')
      ,data : jixiang.serializeData({question:question})
      ,callback : callback
      ,errorCallback : errorCallback
    }
    jixiang.ajax(options);
  }

  jixiang.addHandler(jixiang.$('question'),'submit',handler);

  //回应+1 -1操作
  function review(event){
    var e = event || window.event;
    var target = e.target || e.srcElement;
    e.preventDefault();

    while(target.tagName.toLowerCase() !== 'a'){
      target = target.parentNode;
      if(target.id === 'answer')break;
    }
    if(target.getAttribute('role') !== 'btn')return;
    if(hadClick)return;
    hadClick = true;

    var data = {
      id : parseInt(target.getAttribute('name'),10)
     ,review : (target.id === 'useful-btn') ? 1 : 0
    }

    var callback = function(res){
       if(res.flg == 1){
         var next = target.nextSibling;
         while(next.nodeType !==1){
           next=next.nextSibling;
         }
         next.innerHTML = (parseInt(next.innerHTML,10)+1);
       }
    }

    var options = {
      url : '/question/review'
     ,data : jixiang.serializeData(data)
     ,callback : callback
    }
    jixiang.ajax(options);
  }
 
  jixiang.addHandler(jixiang.$('answer'),'click',review);

});
