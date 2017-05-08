Polymer({

  is: 'zeppelin-notebooks',
  properties: {
    responseItems: {
      type: Array
    },
    notebooks: {
      type: Object,
      notify: true
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
    },
    error: {
      type: Boolean,
      value: false,
      notify: true
    },
    showTemplates: {
      type: Object,
      value: {
        show: false,
        data: Object
      }
    }

  },
  observers: ['selectedChange(selectedItem)', 'showList(notebooks)'],
  behaviors: [ZEPPELIN_UI.DropdownFix],
  setView: function(event) {
    this.setActiveFolder(event.model.item.folder);
  },
  hideTemplates: function() {
    this.set('showTemplates.show', false);
  },
  attached: function() {
    this.set('showTemplates.show', false);
  },
  dettached: function() {
    this.dialog.close();
  },
  dropDownListener: function() {
    var me = this;
    var ironLists = document.querySelectorAll('iron-list');
    for (var i = 0; i < ironLists.length; i++) {
      me.addListener(ironLists[i]);
    }
  },
  // Adds iron overlay open and close events for specific datatable in the page
  addListener: function(list) {
    var me = this;
    list.addEventListener('iron-overlay-opened', function(e) {
      var row = me.getParentByTagName(e.target, 'data-table-row');
      row.parentElement.style.zIndex = 1;
    });
    list.addEventListener('iron-overlay-closed', function(e) {
      var row = me.getParentByTagName(e.target, 'data-table-row');
      row.parentElement.style.zIndex = '';
    });
  },
  showList: function(response) {
    var folders = {};
    var misc = {
      folder: 'My Models',
      items: []
    };
    var responseArray = [];
    // to pass id value as name if name is null or empty
    var mapItem = response.map(function(item) {
      return {
        id: item.id,
        name: (item.name === '' ? item.id : item.name)
      };
    });
    mapItem.forEach(function(item) {
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

    // responseArray.push(misc);
    /* eslint-disable */
    for (key in folders) { 
      responseArray.push(folders[key]);
    }
    /* eslint-disable */

    this.set('responseItems', responseArray);
    if(this.folderName){
      this.setActiveFolder(this.folderName);
      if(this.modelId){
        this.editNotebook(this.modelId);
      }
    }
    setTimeout(function(){
      this.dropDownListener();
    }.bind(this),200)
    
  },
  setActiveFolder: function(folder){
    var getItem = this.responseItems.find(function(item){return item.folder==folder});
    this.set('showTemplates.show',true);
    this.set('showTemplates.data', getItem);
    setTimeout(function() {
      this.dropDownListener();
    }.bind(this), 10);

  },
  createNoteBook: function() {
    var noteName = this.get('noteBookName');
    var newNoteName = this.showTemplates.show ? this.showTemplates.folder+'/'+ noteName : noteName;
    var data = {
      op: 'NEW_NOTE',
      data: {
        name: newNoteName
      }
    };
    this.set('wsData', data);
  },
  deleteNotebook: function(e) {
    var data = {
      op: 'DEL_NOTE',
      data: {
        id: e.target.dataArgs.id
      }
    };
    this.set('wsData', data);
    this.set('showTemplates.show',false);
  },
  showCreateView: function() {
    this.$.dialog.open();
  },
  selectedChange: function(item) {
    var data = {
      op: 'GET_NOTE',
      data: {
        id: item.id
      }
    };
    this.set('wsData', data);
  },
  editNotebook: function(e) {
    var getId = typeof(e)=="string" ? e : e.target.dataArgs.id;
    this.set('viewMode', false);
    this.selectedChange({
      id: getId
    });
  }
});
