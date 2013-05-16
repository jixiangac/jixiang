基于Web的社区居家养老服务平台的设计与实现
=========================================


居家养老服务平台主要是实现订餐、服务预约、问题咨询等功能。


## 用户模块

  + 登陆&注册

  + 普通用户
  
    + 个人资料
     
    + 密码修改
  
  + 管理员 （不可注册）
  
    + 密码修改

## 信息发布和反馈

  + 公告
  
  + 养老政策的发布
  
  + 用户可在正文下进行评论
 
  + 对内容的加1减1的操作


## 服务预约

  + 订餐

    +  考虑商家入住的形式
       
       比如沙县小吃，列举全部沙县小吃的类目

                行为流程： 商家类目发布 -->  用户订餐 -->  订餐配送
    
    +  购物清单
 
       +  生成订单，未提交
       
       +  生成订单，提交，未配送

       +  生成订单，已配送，等待确认

       +  完成订单，配送确认 

  + 问诊

    +  网上问诊
    
               行为流程：用户发布一条信息 -->  医生回复
    
    +  线下预约

               行为流程：用户发起预约 -->  后台审核是否通过
                    
                 通过  ---->  按照约定时间会诊  ---> 用户不可再申请

                 未通过  ---->  不通过理由  ---->  用户可再申请

  + 药品购买

                行为流程：管理员发布库存药品 -->  用户申请购买 

  + 家政服务
   
    + 分类：
     
      - 家电维修
      - 搬运服务
      - 保姆服务
      - 居室打扫
      - 其他服务
    
                 行为流程：用户发起预约 -->  后台审核是否通过
                
                 通过  ---->  按照约定时间会诊  ---> 用户不可再申请

                 未通过  ---->  不通过理由  ---->  用户可再申请

## 问题咨询

   + 常见问题  
   
     - 医学
     - 养老政策

   + 新问题  -->  可以把新问题归类成常见问题 

   + 机器人问题  -->  加1减1操作（有用没用）
   
   + 豆瓣类回答（调用豆瓣接口）
   
## 健康记录

   + 用户提交当日健康状况
   
     - 提交每日健康状况，从简，可以提供几个状态点击提交
     - 汇总生成一周，一月，三月等的健康图表
     - 构建个小组讨论，交流健康分享

