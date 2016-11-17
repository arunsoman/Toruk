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
    },
    noteBook: {
      type: Object
    },
    noteBookName: {
      type: String
    }
  },

  simpleView: function() {
    this.set('editor', null);
  },

  editorView: function() {
    this.set('editor', 'true');
  },

  runAllParas: function() {
    if (this.noteBook) {
      noteBook.runAllParas();
    }
  },

  attached: function() {
    this.async(function() {
      this.noteBook = this.$$('zeppelin-notebook');
    }.bind(this));
  },

  exportNotebook: function() {
    if (this.noteBook) {
      this.noteBook.exportParagraph();
    }
  }
});
