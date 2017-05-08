Polymer({

  is: 'zeppelin-viewer',

  properties: {

    editor: {
      type: Boolean,
      value: true,
      notify: true
    },
    socketUrl: {
      type: String
        // value: 'ws://localhost:8080/ws'
    },
    noteBook: {
      type: Object
    },
    wsData: {
      type: Object
    },
    noteBookName: {
      type: String
    },
    notebooks: {
      type: Object
    },
    notebookId: {
      type: String,
      value: false
    },
    viewNotebook: {
      type: Boolean,
      value: false
    },
    viewMode: {
      type: Boolean,
      value: true
    }
  },
  observers: ['sendData(wsData)', 'authChange(authObj)'],
  connected: false,
  handleResponse: function(response) {
    this.set('authObj', response.detail.response.body);
  },
  authChange: function() {
    this.$.socket.open();
  },
  _onOpen: function() {
    this.pingSocket();
    this.set('socketEnable', true);
    this.getNoteList();
    this.set('connected', true);
  },
  getNoteList: function() {
    var dummyObj = {
      op: 'LIST_NOTES'
    };
    this.set('wsData', dummyObj);
  },
  pingSocket: function() {
    // for polling the server
    setInterval(function() {
      var dummyObj = {
        op: 'PING'
      };
      this.set('wsData', dummyObj);
    }.bind(this), 45000);
  },
  sendData: function(message) {
    var constructMessage = Object.assign(message, this.authObj);
    this.$.socket.send(constructMessage);
  },
  _onClose: function() {
    if (this.connected) {
      this.$.socket.open();
    }
  },
  _onError: function() {
    this.$.socket.close();
    this.set('connected', false);
  },
  handleSocketResponse: function(response) {
    var op = response.detail.op;
    var data = response.detail.data;
    switch (op) {
    case 'NOTE':
      this.set('notebook', data.note);
      this.set('notebookId', data.note.id);
      break;
    case 'NEW_NOTE':
      this.set('notebook', data.note);
      this.set('notebookId', data.note.id);
      this.set('viewMode', false);
      break;
    case 'NOTES_INFO':
      this.set('notebooks', data.notes);
      break;
    case 'GET_NOTE':
      this.set('notebookId', data.id);
      break;
    case 'PROGRESS':
      this.set('notebook.paragraphs.' + this.getObjectIndex(data.id) + '.status', 'PROGRESS');
      break;
    case 'PARAGRAPH_APPEND_OUTPUT':
      this.set('notebook.paragraphs.' + this.getObjectIndex(data.paragraphId) + '.progress', data);
      break;
    case 'PARAGRAPH':
      this.set('notebook.paragraphs.' + this.getObjectIndex(data.paragraph.id), data.paragraph);
      break;
    case 'PARAGRAPH_MOVED':
      var getObj = this.splice('notebook.paragraphs', this.getObjectIndex(data.id), 1);
      this.splice('notebook.paragraphs', data.index, 0, getObj[0]);
      break;
    case 'PARAGRAPH_REMOVED':
      this.splice('notebook.paragraphs', this.getObjectIndex(data.id), 1);
      break;
    case 'PARAGRAPH_ADDED':
      this.splice('notebook.paragraphs', data.index, 0, data.paragraph);
      break;
    case 'INTERPRETER_BINDINGS' :
      this.set('notebook.interpreters', data.interpreterBindings);
      break;
    default:
      break;
    }
  },
  getObjectIndex: function(id) {
    var getObj = this.notebook.paragraphs.find(function(item) {
      return item.id === id;
    });
    var getIndex = this.notebook.paragraphs.indexOf(getObj);
    return getIndex;
  },

  editorView: function() {
    // this.set('editor', true);
  },

  runAllParas: function() {
    if (this.noteBook) {
      this.noteBook.runAllParas();
    }
  },

  attached: function() {
    var protocol = window.location.hostname === 'https:' ? 'wss' : 'ws';
    this.socketUrl = protocol + '://' + window.location.hostname;
  },
  detached: function() {
    this.$.socket.close();
  },
  exportNotebook: function() {
    if (this.noteBook) {
      this.noteBook.exportParagraph();
    }
  },

  editTitle: function() {
    this._noteBookName = this.noteBookName;
    this.$$('.name-wrap').classList.add('edit-mode');
  },

  saveName: function() {
    this.set('noteBookName', this._noteBookName);
    this.$$('.name-wrap').classList.remove('edit-mode');
    this.noteBook.renameNoteBook();
  },

  cancelRename: function() {
    this.set('_noteBookName', this.noteBookName);
    this.$$('.name-wrap').classList.remove('edit-mode');
  }
});
