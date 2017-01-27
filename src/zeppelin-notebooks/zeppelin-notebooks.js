Polymer({

  is: 'zeppelin-notebooks',
  properties: {
    responseItems: {
      type: Array
    },
    notebooks: {
      type: Object
    },
    WS: {
      type: String,
      value: 'ws://localhost/ws-zeppelin'
    },
    wsData: {
      type: Object,
      notify: true
    },
    notebookId: {
      type: String
    },
    viewMode: {
      type: Boolean,
      value: true,
      notify: true
    }
  },
  observers: ['selectedChange(selectedItem)', 'showList(notebooks)'],
  behaviors: [ZEPPELIN_UI.DropdownFix],
  dettached: function() {
    this.dialog.close();
  },
  showList: function(response) {
    var folders = {};
    var misc = {
        folder: 'miscellaneous',
        items: []
    };
    var responseArray =[];

    
    // to pass id value as name if name is null or empty
    var mapItem = response.map(item => {
      return {
        id: item.id,
        name: (item.name === '' ? item.id : item.name)
      };
    });
    mapItem.forEach((item, i) => {
      var splitted = item.name.split('/');
      if (splitted.length > 1) {
        if (!folders[splitted[0]]) {
          folders[splitted[0]] = {};
          folders[splitted[0]].folder = splitted[0];
          folders[splitted[0]].items = [];
        }
        folders[splitted[0]].items.push(item);
      } else {
        misc.items.push(item);
      }
    });

    responseArray.push(misc);
    for (key in folders) {
      responseArray.push(folders[key]);
    }

    this.set('responseItems', responseArray);
  },

  createNoteBook: function() {
    var data = {
      op: 'NEW_NOTE',
      principal: 'anonymous',
      roles: '[]',
      data: {
        name: this.get('noteBookName')
      },
      ticket: 'anonymous'
    };
    this.set('wsData', data);
  },
  deleteNotebook: function(e) {
    var data = {
      op: 'DEL_NOTE',
      principal: 'anonymous',
      roles: '[]',
      data: {
        id: e.target.dataArgs.id
      },
      ticket: 'anonymous'
    };
    this.set('wsData', data);
  },
  showCreateView: function() {
    this.$.dialog.open();
  },
  selectedChange: function(item) {
    var data = {
      op: 'GET_NOTE',
      principal: 'anonymous',
      roles: '[]',
      data: {
        id: item.id
      },
      ticket: 'anonymous'
    };
    this.set('wsData', data);
  },
  editNotebook: function(e) {
    this.set('viewMode', false);
    this.selectedChange({
      id: e.target.dataArgs.id
    });
  }
});
