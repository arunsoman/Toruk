Polymer({

  is: 'editor-view',

  properties: {

    //Unique Id to be assigned to editor
    editorId: {
      type: String
    },
    content: {
      type: String,
      value: '0'
    },
    //Instance of ACE editor
    editor: Object
  },

  observers: ['_editorIdChange(editorId)'],

  _editorIdChange: function(editorId) {
    //initiantes a editor on reciving editor id
    if (!!editorId) {
      this.editor = ace.edit(this.editorId);
      this.editor.setTheme('ace/theme/eclipse');
      this.editor.getSession().setMode('ace/mode/scala');
    }
  },

  attached: function() {
    // var that = this;
    // that.async(function() {
    //   //Init editor
      
    // });
  }
});
