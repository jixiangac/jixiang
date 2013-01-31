(function(){
    var issueForm = jixiang.getByClass('issue-form')[0];
    var issueSub = jixiang.getByClass('edit',issueForm)[0];
    var issueHistory =jixiang.getByClass('history',issueForm)[0];
    //发布&更新操作
    issueSub.onclick = function(event){
       var self = this;
       var e = event || window.event;
       e.preventDefault();
       var content = jixiang.$('issue-content').value;
       if(!content.length > 0){
          alert('请输入公告内容');
          return false;
       }
       ajax('/admin/notice','post',serialize(issueForm)+'&notice_id='+self.getAttribute('href').split('/')[3],callback);
    }
    //置入历史
    issueHistory.onclick = function(event){
      var e = event || window.event;
      e.preventDefault();
      var self = this;
      ajax('/admin/notice/history','post','notice_id='+self.getAttribute('href').split('/')[4],callback);
    }
    //AJAX成功后的动作
    function callback(result){
      if(result.flg == 1) {
        if(confirm(result.msg + '刷新页面吗？')) {
           window.location.reload();
        }
      }else {
        alert(result.msg);
      }
    }
})();