Polymer({

  is: 'zeppelin-viewer',

  properties: {

    // URL for zeppelin
    zeppelinUrl: {
      type: String,
      value: 'http://localhost:8080/api/'
    },
    editor:{
    	type:Boolean,
    	value:"true",
    	notify:true
    }
  },
  
  simpleView:function(){
  	this.set('editor',null);
  },

  editorView:function(){
  	this.set('editor',"true");
  }

});
