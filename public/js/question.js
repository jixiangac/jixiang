/**
 * 问题JS
 */
var qForm = jixiang.$('question');
if(!!qForm){
  var q = jixiang.$('q');
  var sub = jixiang.$('qsub');
  var cat = parseInt(qForm.name,10);
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
    if(cat == 1){//问医类问题
      question = '@问医：'+ question;
    }else if(cat == 2){//养老政策类问题
      question = '#政策#' + question;
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
                           +'<a name="'+data._id+'" class="useless-btn" id="useless-btn">没用</a>'
                           +'<em>'+data.useless+'</em>'
                      +'</span>'
                      +'<span class="useful">'
                        +'<a name="'+data._id+'" class="useful-btn" id="useful-btn">有用</a>'
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