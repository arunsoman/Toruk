Polymer({

  is: 'zeppelin-notebooks',
  properties: {
    responseItems: {
      type: Array
    },
    notebookId: {
      type: String,
      notify: true
    },
    viewMode: {
      type: Boolean,
      value: true,
      notify:true
    }
  },
  observers: ['selectedChange(selectedItem)'],
  behaviors: [ZEPPELIN_UI.DropdownFix],

  handleResponse: function(response) {
    // to pass id value as name if name is null or empty
    var mapItem = response.detail.response.body.map(item => {
      return {
        id: item.id,
        name: (item.name === '' ? item.id : item.name)
      };
    });
    this.set('responseItems', mapItem);
  },

  selectedChange: function(item) {
    this.set('notebookId', item.id);
  },
  editNotebook: function(e) {
    this.set('viewMode', false);
    this.set('notebookId', e.target.dataArgs.id);
  }
});
