/**
 * [format_date 格式化日期格式]
 * @param  {[type]} date [日期参数]
 * @return {[type]}      [返回值]
 */
exports.format_date = function (date,flag) {//flag 为true返回时分秒
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var result ='';
  result+=year + '-' + month + '-' + day; 
  if(flag){
    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0': '') + second;
    result+=' '+hour + ':' + minute + ':' + second;
  }
  return result;
};
/**
 * 分页
 */
exports.pagenav = function(page,count,limit){
  var pages = parseInt(page,10) || 1;
  var condition = {
     skip : (pages-1)*limit
    ,limit : limit
  }
  var pageNum = {
     max : Math.ceil(count/7) ? Math.ceil(count/7) : 1
    ,cur : pages
    ,next : pages+1
    ,prev : pages-1
  }
  if(pageNum.cur > pageNum.max)return false;
  
  return {
     pageNum:pageNum
    ,condition:condition
  }
}
/**
 * 发送邮件
 */
var nodemailer = require('nodemailer');
exports.email = function(toemail,subject,text,html){
  var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
          user: "jixiangxx@gmail.com",
          pass: "asklili123456"
      }
  });
  var mailOptions = {
      from: "吉祥社区<jixiangxx@gmail.com>", // sender address
      to: toemail, // list of receivers
      subject: subject, // Subject line
      text: text, // plaintext body
      html: html // html body
  }
  //发邮件
  smtpTransport.sendMail(mailOptions, function(error, response){
  if(error){
      console.log(error);
  }else{
      console.log("Message sent: " + response.message);
   }
  });

}