Polymer({

  is: 'zeppelin-notebook',
  properties: {
    notebook: {
      type: Object
    },
    socketEnable: {
      type: Boolean,
      value: false
    },
    // WS: {
    //   type: String,
    //   value: 'ws://localhost/ws-zeppelin'
    // },
    settings: {
      type: Object,
      value: {
        progress: null,
        order: []
      }
    },

    wsData: {
      type: Object,
      notify: true
    },
    paragraphId: {
      type: String
    },
    noteBookName: {
      type: String,
      notify: true
    },
    notebookId: {
      type: String
    },
    viewMode: {
      type: Boolean,
      value: true
    },
    editNotebook: {
      type: Boolean,
      value: false
    }
  },

  // observers: ['restartSocket(notebookId)'],

  restartSocket: function() {
    // for polling the server
    setInterval(function() {
      this.$.socket.send({
        op: 'PING',
        principal: 'anonymous',
        ticket: 'anonymous',
        roles: []
      });
    }.bind(this), 9000);
  },

  // _wsDataChange: function(data) {
  //   if (!this.socketEnable) {
  //     this.$.socket.open();
  //   }
  //   this.$.socket.send(data);
  // },

  // _onOpen: function() {
  //   var me = this;
  //   me.set('socketEnable', true);
  //   var dummyObj = {
  //     op: 'GET_NOTE',
  //     principal: 'anonymous',
  //     roles: '[]',
  //     data: {
  //       id: me.notebookId
  //     },
  //     ticket: 'anonymous'
  //   };
  //   me.$.socket.send(dummyObj);
  // },
  // _onClose: function() {
  //   this.set('socketEnable', false);
  // },
  handleResponse: function(response) {
    var op = response.detail.op;
    this._noteBook = response.detail.data.note;
    switch (op) {
    case 'NOTE':
      this.set('notebook', response.detail.data.note.paragraphs);
      this.set('noteBookName', response.detail.data.note.name);
      break;
    case 'PARAGRAPH_UPDATE_OUTPUT':
      break;
    case 'PARAGRAPH_APPEND_OUTPUT':
      this.set('settings.progress', null);
      break;
    case 'PROGRESS':
      // do something
      this.set('settings.progress', response.detail.data.id);
      break;
    default:
      this.set('settings.progress', null);
    }
  },
  runAllParas: function() {
    var paras = this.querySelectorAll('zeppelin-paragraph');
    if (paras && paras.length) {
      [].forEach.call(paras, function(para) {
        para.runParagraph();
      });
    }
  },

  exportParagraph: function() {
    // http://stackoverflow.com/a/30800715/5154397
    var paras = {
      paragraphs: this.notebook.paragraphs
    };
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(paras));
    var dlAnchorElem = this.querySelector('#downloadAnchorElem');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', this.noteBookName + '.json');
    dlAnchorElem.click();
  },
  renameNotebook: function() {
    this.set('oldBookName', this.notebook.name);
    this.set('editNotebook', true);
  },
  cancelRename: function() {
    this.set('notebook.name', this.oldBookName);
    this.set('editNotebook', false);
  },
  saveNoteBookName: function() {
    var data = {
      op: 'NOTE_UPDATE',
      principal: 'anonymous',
      roles: '[]',
      data: {
        config: {
          looknfeel: 'default'
        },
        id: this.notebook.id,
        name: this.notebook.name
      },
      ticket: 'anonymous'
    };
    this.set('editNotebook', false);
    this.set('wsData', data);
  }
});
