Polymer({

  is: 'zeppelin-notebook',
  properties: {
    notebook: {
      type: Object,
      notify: true
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
    },
    expandAll: {
      type: Boolean,
      value: false
    }
  },

  // observers: ['paragraphChange(notebook)'],

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

  runAllParas: function() {
    var paras = this.querySelectorAll('zeppelin-paragraph');
    if (paras && paras.length) {
      [].forEach.call(paras, function(para) {
        para.runParagraph();
      });
    }
  },

  visibleCheck: function(a, b) {
    return (a.hasOwnProperty('visible') ? a.visible : true) || b;
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
  showToggle: function() {
    this.set('expandAll', !this.expandAll);
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
