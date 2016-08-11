Polymer({

  is: 'editor-view',

  properties: {

    //paragrahp object
    paragraph: {
      type: Object
    },

    settings:{
      type:Object
    },

    //Instance of ACE editor
    editor: {
      type: Object
    }
  },
  observers: ['_editorChange(settings.*)'],

  _editorChange: function(settings) {
    // debugger;
      // this.appendContent();
  },  
  attached: function() {
    var me = this;
    if (me.paragraph.text) {
      me.editor = ace.edit(me.paragraph.id);
      me.editor.setValue(me.paragraph.text, 1);
      me.editor.setTheme('ace/theme/eclipse');
      me.editor.getSession().setMode('ace/mode/scala');
      me.editor.on("change", function(a, b) {
        me.set('me.paragraph.text', me.editor.getSession().getValue());
      })
    }
  }

});
