/**
 * 问题页面routes
 */
var Utils = require('../models/utils');
var jixiang = require('../models/base');
var https = require('https');

exports.index = function(req,res){
   res.render('./question',{
   	  title : '问题咨询'
   	 ,user : req.session.user
   	 ,cur : 'question'
     ,pjax : false
     ,jsflg : 'question'
   });
}
//回应
var helloAnswer = {
  'time3' : '好什么好，主人都睡觉了，我却还在岗位上！哼！'
 ,'time5' : '这才几点钟啊，您就又来咨询了？'
 ,'time7' : '早啊官人！您可起得真早呐~ 给你请安了！今天想问点什么呢？'
 ,'time9' : '好呀，新的一天又开始了！伊丽莎白说过，一天之始在于问！？'
 ,'time12' : '这个点了，别人都去吃饭了，你还有事问我？我看你日后必成大业！'
 ,'time15' : 'Afternoon,我在睡午觉呢!Zzzzz...问题我会托周公告诉你的！'
 ,'time18' : '我们主人说，如果这个点我还在回答你的问题，那么他一定在加班～唉，可怜的主人！'
 ,'time22' : '我想看会儿电视剧，但是主人吩咐过了，做一个好机器人就要顶的住诱惑~~'
 ,'time23' : '您还是早点睡吧...'
}
var FAQ = { //常见问题
   '^(help|帮助)$':'<h3>使用说明</h3><p>普通提问直接输入，比如“你好”，我会跟你互动，比如“时间”,我会告诉你现在时间，</p><p>指令式提问可以提高精准，比如“@电影：”+需要查询的电影，可以查询相关电影信息;</p><p>同理，还有“@电影：”，“@音乐：”</p><p>如果你问的问题有“有用”，“没用”的按钮，你也可以进行表态！</p>'
  ,'jixiangac':'这是我的主人哦，你们不要欺负他！'
  ,'吉祥社区':'这是主人正在开发的一个社区，我好期待的呢！'
  ,'帅' : '我能叫你蟋蟀哥哥吗？'
  ,'(美|漂亮)' : '给张照片我让主人给你鉴定鉴定^_^'
  ,'天气' : '天气无常，我不想谈= =！'
  ,'主人' : '我的主人只有一个，我不会背弃主人的，除非你给我棒棒糖！'
  ,'(傻逼|白痴|脑残|草|操|次奥|艹)' : '主人教育我，好孩子从来不说脏话!!'
  ,'擦':'我给您擦擦？'
  ,'(毛泽东|江泽民|胡锦涛|温家宝|习近平|李克强)':'根据相关法律法规，我不能告诉你～问点其他的吧！'
  ,'^(时间|几点)' : '现在的时间是：'+Utils.format_date(new Date(),true)
  ,'最后问你一个问题':'爱过'
  ,'是谁':'是谁有这么重要吗？如果你觉得重要的话你可以百度哦！'
}
exports.answer = function(req,res){
   var question = req.body.question;
   //问医类问题的回答
   if(/^@问医：/.test(question)){
     question = question.replace(/^@问医：/,'');
     var condition = {};
     condition.query = {
         cat : 1
        ,title : new RegExp(question,'gi')
     };
     // condition.limit = 5;
     jixiang.get(condition,'question',function(err,doc){
       if(err){
        doc = [];
       }
       if(!!doc.length){
         // var num = parseInt(Math.random()*doc.length,10);
          return res.json({flg:2,answers:doc[0]}); 
       }else{
         var item = {
            cat : 0
           ,subcat : 1
           ,uid : req.session.user._id
           ,username : req.session.user.username
           ,title : question
           ,reply : false
         }
         jixiang.save(item,'question',function(err,doc){});
       }
       return res.json({flg:1,answer:'这个问题我还不能回答你，但是我已经记录下来了，有了回复，你可以在【我的问题】中查看'});
     });
     return;
   }
   if(/^#政策#/.test(question)){
     question = question.replace(/^#政策#/,'');
     var condition = {};
     condition.query = {
        cat : 2
       ,title : new RegExp(question,'gi')
     };
     jixiang.get(condition,'question',function(err,doc){
       if(err){
         doc = [];
       }
       if(!!doc.length){
         return res.json({flg:2,answers:doc[0]});
       }
       return res.json({flg:1,answer:'不知道！'});
     });
     return;
   }
   //豆瓣API，apikey=0dd9395b7b5b1212298bac1272113636
   if(/^@(图书|电影|音乐)：/.test(question)){
      var douban,tips;
      if(/^@图书/.test(question)){
         douban = 'book';
         tips = '图书';
      }else if(/^@电影/.test(question)){
         douban = 'movie';
         tips = '电影';
      }else{
         douban = 'music';
         tips = '音乐';
      }
      var query = question.replace(/^@(图书|电影|音乐)：/,'');
      var options = {
         host : 'api.douban.com'
        ,path :'/v2/'+douban+'/search?q='+encodeURIComponent(query)+'&count=5&apikey=0dd9395b7b5b1212298bac1272113636'
      }
      https.get(options,function(resx){
          resx.setEncoding('utf8');
          resx.on('data', function (chunk) {
            try{
              var data = JSON.parse(chunk);
             }catch(e){
              return res.json({flg:1,answer:'出现'+e+'错误，不要慌，有主人在，你先问点其他的吧！'});
            }
            var ret = [];
            switch(tips){
              case '图书':
                if(!data.books.length){
                  return res.json({flg:1,answer:'没有找到相关'+tips+'！'});
                }else{
                  data.books.forEach(function(item,index){
                     var book={};
                      book.title = !!item.title ? item.title : '未知';
                      book.alt = item.alt;
                      book.image = item.image;
                      book.publisher = !!item.publisher?item.publisher:'未知';
                      book.pubdate = !!item.pubdate ? item.pubdate : '未知';
                      book.pages = !!item.pages ? item.pages : '未知';
                      book.price = !!item.price ? item.price : '未知';
                      book.isbn = !!item.isbn13 ? item.isbn13 : '未知';
                      book.summary = !!item.summary?item.summary : '点击图片看看吧';
                      book.author = (!!item.author && !!item.author.length)?item.author.join(' '):'佚名';
                      ret.push(book);
                  });
                  return res.json({flg:3,subject:1,answer:ret});
                }
              break;
              case '电影':
                if(!data.subjects.length){
                  return res.json({flg:1,answer:'没有找到相关'+tips+'！'});
                }else{
                   data.subjects.forEach(function(item,index){
                    var movie={};
                    movie.title = item.title;
                    movie.alt = item.alt;
                    movie.image = item.images.medium;
                    movie.pubdate = item.year;
                    ret.push(movie)
                  });
                  return res.json({flg:3,subject:2,answer:ret});                 
                }

              break;
              case '音乐':
                 if(!data.musics.length){
                   return res.json({flg:1,answer:'没有找到相关'+tips+'！'});
                 }else{
                   data.musics.forEach(function(item,index){
                     var music = {};
                     music.title = item.attrs.title.join(' ');
                     music.alt = item.alt;
                     music.image = item.image;
                     music.pubdate = !!item.attrs.pubdate ? item.attrs.pubdate[0]:'未知';
                     music.singer = !!item.author ? item.author[0].name:'未知';
                     music.tracks = !!item.attrs.tracks ? item.attrs.tracks[0].split('\n').join('<br />'):'点击图片看看吧！';
                     ret.push(music);
                   });
                 }
                 return res.json({flg:3,subject:3,answer:ret});
              break;
              default : 
                console.log(data)
            }
        }).on('error',function(e){
           return res.json({flg:1,msg:'出错了！问点其他的吧！！'});
        });
      });
      return;
   }
   //你好,没有分类的问题
   if(/^(你好|hello|hi)/i.test(question)){
     var answer = '';
     var h = new Date().getHours();
     switch(true){
      case h < 3 : 
        answer = helloAnswer['time3'];break;
      case h < 5 :
        answer = helloAnswer['time5'];break;
      case h < 7 :
        answer = helloAnswer['time7'];break;
      case h < 9 :
        answer = helloAnswer['time9'];break;
      case h < 12 :
        answer = helloAnswer['time12'];break;
      case h < 15 :
        answer = helloAnswer['time15'];break;
      case h < 18 :
        answer = helloAnswer['time18'];break;
      case h < 22 :
        answer = helloAnswer['time22'];break;
      case h >=22 :
        answer = helloAnswer['time23'];break;
      default:
        answer = '好呀，今天天气不错挺风和日丽的！';
     }
     return res.json({flg:1,answer:answer});
   }
   //轮询是否在常见问题中
   for(var key in FAQ){
      var pat = new RegExp(key,'i');
      if(pat.test(question)){
         return res.json({flg:1,answer:FAQ[key]}); 
      }
   }
   //查询数据库
   var condition = {};
   condition.query = {
      title : new RegExp(question,'gi')
   }
   jixiang.get(condition,'question',function(err,answers){
     if(err){
       answers = [];
     }
     if(!!answers.length){
      var num = parseInt(Math.random()*answers.length,10);
      return res.json({flg:2,answers:answers[num]});
     }
     return res.json({flg:1,answer:'这个问题不是我不会，我得先问问主人可说不可说！'});     
   });

}

//有用没用
exports.review = function(req,res){
  var id= parseInt(req.body.id,10);
  var re = parseInt(req.body.review,10);
  var condition = {};
  if(re == 0){
    condition.update = {
      useless : 1
    }
  }else{
    condition.update = {
      useful : 1
    }
  }
  jixiang.selfplus(id,condition,'question',function(err){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'操作成功！'});
  });
}

//问题列表
exports.qlist = function(req,res){
   var pjax = !!req.query.pjax;
   var cat = parseInt(req.query.cat,10) || 1;
   var condition = {};
   condition.query = {
      uid : req.session.user._id
     ,reply : cat !== 1
   }
   jixiang.get(condition,'question',function(err,doc){
     res.render('./question/list',{
        title : '我的问题'
       ,user : req.session.user
       ,cur : 'question'
       ,doc : doc
       ,pjax : pjax
     });

   })
}
/*------------------
    　　admin
-------------------*/

var admin = function(req,res){
  var condition = {};
  var cat;
  switch(parseInt(req.query.cat,10)){
    case 1 :
      cat = 1;
      break;
    case 2 :
      cat = 2;
      break;
    case 3 :
      cat = 3;
      break;
    case 4 :
      cat = 4;
      break;
    default :
      cat = {'$nin':[0]}
  }
  condition.query = {
    cat : cat
  };
  jixiang.get(condition,'question',function(err,answers){
    if(err){
      answers=[];
    }
    if(!!answers.length){
      answers.forEach(function(item){
        switch(item.cat){
          case 1 : 
            item.cat = '问医';
            break;
          case 2 :
            item.cat = '家政';
            break;
          case 3 :
            item.cat = '政策';
            break;
          default :
            item.cat = '其他';
        }
      });
    }
    res.render('./admin/question/index',{
       title : '问题管理'
      ,user : req.session.admin
      ,answers : answers
      ,cur : 'question'
      ,pagecat : cat
    });
  });
}

var newQ = function(req,res){
  if(req.method == 'GET'){
    res.render('./admin/question/new',{
       title : '添加新问题'
      ,user : req.session.admin
      ,cur : 'question'
    });      
  }else if(req.method == 'POST'){
     var q = {
        cat :　parseInt(req.body.q_cat,10)
       ,useful : 0
       ,useless : 0
       ,title : req.body.q_name
       ,content : req.body.q_answer
       ,reply : true
     };
     jixiang.save(q,'question',function(err){
       if(err){
         return res.json({flg:0,msg:err});
       }
       return res.redirect('/admin/question');
     });
  }

}
//修改问题
var editQ = function(req,res){
  var id = parseInt(req.query.id,10);
  if(req.method == 'GET'){
    jixiang.getOne({_id:id},'question',function(err,doc){
      res.render('./admin/question/edit',{
         title : '修改问题'
        ,user : req.session.admin
        ,cur : 'question'
        ,doc : doc
      });
    });

  }else if(req.method == 'POST'){
    var condition ={};
    condition.query = {
      _id : id
    }
    condition.modify = {
      '$set': {
        title : req.body.q_name
       ,cat : parseInt(req.body.q_cat,10)
       ,content : req.body.q_answer
      }
    }
    console.log(condition)
    jixiang.update(condition,'question',function(err){
      if(err){
        return res.json({flg:0,msg:err});
      }
      // return res.json({flg:1,msg:'修改成功！'});
      res.redirect('/admin/question');
    });
  }
}
var noreply = function(req,res){
  if(req.method == 'GET'){

    var condition = {};
    var cat;
    switch(parseInt(req.query.cat,10)){
      case 1 :
        cat = 1;
        break;
      case 2 :
        cat = 2;
        break;
      case 3 :
        cat = 3;
        break;
      case 4 :
        cat = 4;
        break;
      default :
        cat = {'$nin':[0]}
    }
    condition.query = {
       cat : 0
      ,subcat : cat
    };
    condition.sort = {
      replytime : -1
    }
    jixiang.get(condition,'question',function(err,answers){
      if(err){
        answers=[];
      }
      if(!!answers.length){
        answers.forEach(function(item){
          switch(item.subcat){
            case 1 : 
              item.subcat = '问医';
              break;
            case 2 :
              item.subcat = '家政';
              break;
            case 3 :
              item.subcat = '政策';
              break;
            default :
              item.subcat = '其他';
          }
        });
      }

      res.render('./admin/question/noreply',{
         title : '未回复的问题'
        ,user : req.session.admin
        ,answers : answers
        ,cur : 'question'
        ,pagecat : cat
      });
    });

  }
}
var reply = function(req,res){
  var id = parseInt(req.query.id,10);
  if(req.method == 'GET'){
    jixiang.getOne({_id:id},'question',function(err,doc){
      res.render('./admin/question/reply',{
         title : '回复问题'
        ,user : req.session.user
        ,cur : 'question'
        ,doc : doc
      });
    });
  }else if(req.method == 'POST'){
    var condition ={};
    condition.query ={
      _id : id
    }
    condition.modify = {
      '$set' : {
         title : req.body.q_name
        ,content : req.body.q_answer
        ,subcat : parseInt(req.body.q_cat,10)
        ,reply : true
        ,replyuser : req.session.admin.username
      }
    }
    if(!!req.body.add){
      condition.modify['$set'].cat = parseInt(req.body.q_cat,10);
      condition.modify['$set'].useless = 0;
      condition.modify['$set'].useful = 0;
    }
    jixiang.update(condition,'question',function(err){
      if(err){
        return res.json({flg:0,msg:err});
      }
      return res.redirect('/admin/question/noreply');
    })
  }
}
var del = function(req,res){
  var id = parseInt(req.body.id);
  jixiang.delById(id,'question',function(err){
    if(err){
      return res.json({flg:0,msg:err});
    }
    return res.json({flg:1,msg:'删除成功！'});
  });
}
exports.admin = admin;
exports.newQ = newQ;
exports.editQ = editQ;
exports.noreply = noreply;
exports.reply = reply;
exports.del = del;