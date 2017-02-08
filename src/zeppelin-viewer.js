Polymer({

  is: 'zeppelin-viewer',

  properties: {

    editor: {
      type: Boolean,
      value: true,
      notify: true
    },
    WS: {
      type: String,
      value: 'ws'
    },
    hostName: {
      type: String
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
  observers: ['sendData(wsData)'],
  _onOpen: function() {
    var me = this;
    me.set('socketEnable', true);
    var dummyObj = {
      op: 'LIST_NOTES',
      principal: 'anonymous',
      roles: '[]',
      ticket: 'anonymous'
    };
    me.$.socket.send(dummyObj);
  },
  sendData: function(message) {
    this.$.socket.send(message);
  },
  _onClose: function() {
    this.$.socket.open();
    // this.set('socketEnable', false);
  },

  handleSocketResponse: function(response) {
    var op = response.detail.op;
    switch (op) {
    case 'NOTE':
      this.set('notebook', response.detail.data.note);
      this.set('notebookId', response.detail.data.note.id);
      // this.set('noteBookName', response.detail.data.note.name);
      break;
    case 'NEW_NOTE':
      this.set('notebook', response.detail.data.note);
      this.set('notebookId', response.detail.data.note.id);
      break;
    case 'NOTES_INFO':
      this.set('notebooks', response.detail.data.notes);
      break;
    case 'GET_NOTE':
      this.set('notebookId', response.detail.data.id);
      break;
    case 'PROGRESS':
      // wip for progress event
      break;
    default:
      break;
      // this.set('settings.progress', null);
    }
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
    var protocol = window.location.hostname === 'https' ? 'wss' : 'ws';
    this.hostName = protocol + '://' + window.location.hostname;
    // this.hostName = '192.168.14.100:8080';
    this.async(function() {
      this.$.socket.open();
      // this.noteBook = this.$$('zeppelin-notebook');
    }.bind(this));
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
