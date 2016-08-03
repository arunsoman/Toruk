Polymer({
  is: 'zeppelin-resizer',

  listeners: {
    'mousedown': 'regularTap'
  },
  properties:{
    grid:{
      type:Number,
      value:12,
      notify:true
    },
    col:{
      type:Number,
      value:12
    },
    parentNode:{
      type:Object
    }
  },
  _touchActive: true,
  ready: function() {
    // this.resize.bind(this);
    // this.resize.bind(this);
  },

  regularTap: function(e) {
    var me = this;
    me.set('resizeObj', me.resize.bind(me));
    document.addEventListener('mouseup', me.tapRelease.bind(this));
    document.addEventListener('mousemove', me.resizeObj);
    me.set('_touchActive',true);

  },

  tapRelease: function() {
    var me = this;
    document.removeEventListener('mousemove', me.resizeObj);
    document.removeEventListener('mouseup', me.tapRelease);
    if(me._touchActive){
      var gridSize = Math.round((parseInt(me.parentNode.style.width.split('px')[0])/window.outerWidth)*me.col);
      me.set('grid',gridSize);
      me.parentNode.style.width = '100%';
      me.set('_touchActive',false);
    }
  },
  resize: function(e) {
    var me = this;
    me.parentNode.style.width = (e.clientX - me.parentNode.parentNode.parentNode.offsetLeft) + 'px';
    // me.parentNode.style.height = (e.clientY - me.parentNode.offsetTop) + 'px';
  }

});
