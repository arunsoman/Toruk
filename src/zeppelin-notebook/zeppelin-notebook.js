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
    url: {
      type: String
    },
    WS: {
      type: String
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
    }
  },

  observers: ['_wsDataChange(wsData)'],
  ready: function() {
    this.$.socket.open();
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

    switch (op) {
    case 'NOTE':
      this.set('responseItems', response.detail.data.note.paragraphs);
      break;
    case 'PARAGRAPH_UPDATE_OUTPUT':
      // debugger;
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
  }
});
