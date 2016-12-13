Polymer({

  is: 'zeppelin-paragraph',

  properties: {

    // Paragraph object
    paragraph: {
      type: Object
    },
    notebookId: {
      type: String,
      value: '2A94M5J1Z'
    },
    // No editor, settings et al.
    viewMode: {
      type: Boolean,
      value: true
    },
    // import dependency charts
    charts: {
      type: Array,
      notify: true
    },

    wsData: {
      type: Object,
      notify: true
    },

    // The content that fills ACE Editor
    content: {
      type: String
    },

    // Results that go to the place where results are shown(graph, html, table)
    result: {
      type: Object
    },

    editorShowLine: {
      type: Boolean,
      value: true
    },
    // Helps to determine and show what's the out put from zeppelin backend
    templatetype: {
      type: Object,
      value: function() {
        return {
          html: false,
          text: false,
          graph: false
        };
      }
    },

    data: {
      type: Object,
      value: {
        external: [],
        source: []
      }
    },
    editTitle: {
      type: Boolean,
      value: false
    }
  },
  observers: ['_changeId(paragraph)', '_convertObjects(paragraph.settings.forms)', '_gridChange(paragraph.config.*)'],

  __attached: function() {
    if (this.paragraph.result) {
      this.fillTemplate(this.paragraph.result.type);
    }
    this.push('settings.order', this.paragraph.id);
  },
  showDropDown: function() {
    this.$$('#navdrop').open();
  },
  setEditTitle: function() {
    this.set('editTitle', true);
  },
  saveTitle: function() {
    this.set('paragraphTitle', this.paragraphTitle);
    var postData = {
      config: this.paragraph.config,
      id: this.paragraph.id,
      paragraph: this.$$('editor-view').getText(),
      title: this.paragraphTitle
    };
    this.handlePOST({
      op: 'COMMIT_PARAGRAPH',
      data: postData,
      params: {}
    });
    this.cancelTitle();
  },
  cancelTitle: function() {
    this.set('editTitle', false);
  },
  _changeId: function(data) {
    // TO learn what type of result
    if (this.paragraph.result) {
      this.fillTemplate(this.paragraph.result.type);
      this.set('paragraphTitle', this.paragraph.title || 'Untitled');
    }
    // this.push('settings.order',this.paragraph.id);
  },
  _convertObjects: function(item) {
    this.formObjects = [];
    if (item) {
      var objectKey = Object.keys(item);
      var me = this;
      objectKey.forEach(function(a) {
        me.push('formObjects', me.get('paragraph.settings.forms.' + a));
      });
    }
  },

  eq: function(a, b) {
    return a === b;
  },
  not: function(a, b) {
    return a !== b;
  },

  _gridChange: function(obj) {
    if (obj.path === 'paragraph.config.colWidth') {
      this._commitParagraph();
    }
  },

  _commitParagraph: function() {
    var postData = {
      config: this.paragraph.config,
      id: this.paragraph.id,
      paragraph: this.paragraph.text
    };
    // postData.config.graph.polymerD3.availableCharts.forEach(c => {try{c.settings.area[6].callBack = 'xAxisCallback'; c.settings.area[7].callBack = 'xAxisCallback'}catch(e){console.log(e)}})
    this.handlePOST({
      op: 'COMMIT_PARAGRAPH',
      data: postData
    });
  },

  // To save a pargraph
  saveParagraph: function() {
    var chartManager = this.$$('zeppelin-chart-manager');
    if (!chartManager) {
      return false;
    }
    var polymerD3 = chartManager.$$('polymer-d3');
    if (!polymerD3) {
      return false;
    }
    this.paragraph.config.graph.polymerD3 = polymerD3.getSettings();
    this._commitParagraph();
  },

  hideNumber: function() {
    this.set('editorShowLine', !this.editorShowLine);
    this.$$('editor-view').editor.renderer.setShowGutter(this.editorShowLine);
  },

  // Handles API Response  and sets
  handleResponse: function(response) {
    var res = response.detail.response.body;
    this.set('paragraph', res);
    this.set('grid', res.config.colWidth);
    if (res.result) {
      this.fillTemplate(res.result.type);
    }
  },

  // Selects template type to fill.
  fillTemplate: function(resultType) {
    switch (resultType) {
    case 'TEXT':
      this.set('templatetype.text', true);
      break;
    case 'HTML':
    case 'ANGULAR':
      this.set('templatetype.html', true);
      break;
    case 'TABLE':
      this.set('templatetype.graph', true);
      break;
    default:
      throw Error('no implementation found');
    }
  },

  runParagraph: function() {
    var postData = {
      config: this.paragraph.config,
      id: this.paragraph.id,
      paragraph: this.$$('editor-view').getText()
    };
    this.handlePOST({
      op: 'RUN_PARAGRAPH',
      data: postData,
      params: {}
    });
  },

  addParagraph: function() {
    var newIndex = parseInt(this.index) + 1;
    this.handlePOST({
      op: 'INSERT_PARAGRAPH',
      data: {
        index: newIndex
      }
    });
  },

  removeParagraph: function() {
    this.handlePOST({
      op: 'PARAGRAPH_REMOVE',
      data: {
        id: this.paragraph.id
      }
    });
  },

  moveDown: function(e) {
    var newIndex = parseInt(this.index) + 1;

    this.handlePOST({
      op: 'MOVE_PARAGRAPH',
      data: {
        id: this.paragraph.id,
        index: newIndex
      }
    });
  },

  moveUp: function() {
    var indexValue = parseInt(this.index);
    var newIndex = indexValue > 0 ? indexValue - 1 : 0;

    this.handlePOST({
      op: 'MOVE_PARAGRAPH',
      data: {
        id: this.paragraph.id,
        index: newIndex
      }
    });
  },
  postResponse: function(res) {
    console.info(res.detail.response.status);
  },
  // Handler for run
  handlePOST: function(obj) {
    obj.data.params = obj.params;
    var postObj = {
      op: obj.op,
      principal: 'anonymous',
      roles: '[]',
      data: obj.data,
      ticket: 'anonymous'
    };
    this.set('wsData', postObj);
  }
});
