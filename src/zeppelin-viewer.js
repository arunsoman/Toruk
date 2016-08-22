Polymer({

  is: 'zeppelin-viewer',

  properties: {

    // Websocket Url for zeppelin
    WS: {
      type: String,
      value: 'ws://localhost:8080/ws/'
    },
    editor: {
      type: Boolean,
      value: 'true',
      notify: true
    }
  },

  simpleView: function() {
    this.set('editor', null);
  },

  editorView: function() {
    this.set('editor', 'true');
  }

});
