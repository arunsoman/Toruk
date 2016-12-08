Polymer({

  is: 'zeppelin-notebook',
  properties: {
    responseItems: {
      type: Array
    },
    socketEnable: {
      type: Boolean,
      value: false
    },
    WS: {
      type: String,
      value: 'ws://localhost:8080/ws/'
    },
    settings: {
      type: Object,
      value: {
        progress: null,
        order: []
      }
    },

    wsData: {
      type: Object
    },
    paragraphId: {
      type: String
    },
    noteBookName: {
      type: String,
      value: function() {
        return 'notebook' + new Date().getTime();
      },
      notify: true
    },
    notebookId: {
      type: String
    },
    viewMode: {
      type: Boolean,
      value: true
    }
  },

  attached: function() {
    this.async(function() {
      this.$.socket.open();
    }.bind(this));
  },
  detached: function() {
    this.$.socket.close();
  },

  observers: ['_wsDataChange(wsData)', 'restartSocket(notebookId)'],

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

  _wsDataChange: function(data) {
    if (!this.socketEnable) {
      this.$.socket.open();
    }
    this.$.socket.send(data);
  },

  _onOpen: function() {
    var me = this;
    me.set('socketEnable', true);
    var dummyObj = {
      op: 'GET_NOTE',
      principal: 'anonymous',
      roles: '[]',
      data: {
        id: me.notebookId
      },
      ticket: 'anonymous'
    };
    me.$.socket.send(dummyObj);
  },
  _onClose: function() {
    this.set('socketEnable', false);
  },
  handleResponse: function(response) {
    var op = response.detail.op;
    this._noteBook = response.detail.data.note;
    switch (op) {
    case 'NOTE':
      this.set('responseItems', response.detail.data.note.paragraphs);
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
      paragraphs: this.responseItems
    };
    var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(paras));
    var dlAnchorElem = this.querySelector('#downloadAnchorElem');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', this.noteBookName + '.json');
    dlAnchorElem.click();
  },
  renameNoteBook: function() {
    this.set('socketEnable', true);
    var dummyObj = {
      op: 'NOTE',
      principal: 'anonymous',
      roles: '[]',
      data: {
        note: this._noteBook
      },
      ticket: 'anonymous'
    };
    dummyObj.data.note.name = this.noteBookName;
    this.$.socket.send(dummyObj);
  }
});
