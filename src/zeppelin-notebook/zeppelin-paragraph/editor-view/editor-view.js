Polymer({
  is: 'editor-view',
  properties: {
    // paragrahp object
    paragraph: {
      type: function() {
        return {};
      }
    },

    settings: {
      type: function() {
        return {};
      }
    },

    // Instance of ACE editor
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
    me.editor = window.ace.edit(me.paragraph.id);
    me.editor.setValue(me.paragraph.text || '', 1);
    me.editor.setTheme('ace/theme/eclipse');
    me.editor.getSession().setMode('ace/mode/scala');
    me.editor.getSession().setUseWrapMode(true);
    me.editor.on('change', function(a, b) {
      me.set('me.paragraph.text', me.editor.getSession().getValue());
    });
  },
  getText: function() {
    return this.editor.getSession().getValue();
  }

});
