/**
 *  @Description    Popbox(弹出框)
 *  @Author         jixiangac
 */
define(function(require,exports,module){

  var jixiang = require('./base');

  //遮罩层
  function overlay(obj,opacity,flag){//如果有flag表示不能点击空白关闭
     var self = this;
     opacity = (typeof opacity === 'number') ? opacity : 0;
     this.render(opacity);
     if(!arguments[arguments.length-1]){
       // this.el.on('click',function(){
       //   self.close();
       //   obj.hide();
       // });
     }
  }
  overlay.prototype.render = function(opacity){
    this.el = document.createElement('div');
    this.el.className = 'overlay';
    this.el.style.opacity = opacity;
    document.body.appendChild(this.el);
  }
  overlay.prototype.close = function(){
    var el = this.el;
    el.parentNode.removeChild(el);
  }
  exports.overlay = overlay;
  
  //弹出层
  function init(main, target){
    var self = this;
    this.render(main, target);
  }
  init.prototype.render = function(main,target){
    new overlay(null,0.5);
    this.el = document.createElement('div');
    this.el.className = 'popbox';
    this.el.innerHTML = main;
    var target = target || document.body;
    console.log(target)
    target.appendChild(this.el);
  }
  exports.init = init;
  
})