Polymer({

  is: 'zeppelin-paragraph',

  properties: {

    // Paragraph object
    paragraph: {
      type: Object,
      notify: true
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
    },
    response: {
      type: String,
      value: ''
    }
  },
  observers: ['_convertObjects(paragraph.settings.forms)', '_gridChange(paragraph.config.*)', 'runResponse(response.*)'],

  showDropDown: function() {
    this.$$('#navdrop').open();
  },
  runResponse: function(data) {
    if (data.value === '') {
      // WIP
      return true;
      // this.runParagraph(data);
    }
  },
  setEditTitle: function() {
    this.set('prevTitle', this.paragraph.title);
    this.set('editTitle', true);
  },
  toggleTitle: function() {
    this.set('paragraph.config.showTitle', !this.paragraph.config.showTitle);
    this._commitParagraph();
  },
  saveTitle: function() {
    this._commitParagraph();
    this.set('editTitle', false);
  },
  cancelTitle: function() {
    this.set('paragraph.title', this.prevTitle);
    this.set('editTitle', false);
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
  contains: function(a, b, c, d) {
    return [b, c, d].indexOf(a) !== -1;
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
      paragraph: this.paragraph.text,
      title: this.paragraph.title
    };
    // postData.config.graph.polymerD3.availableCharts.forEach(c => {try{c.settings.area[6].callBack = 'xAxisCallback'; c.settings.area[7].callBack = 'xAxisCallback'}catch(e){console.log(e)}})
    this.handlePOST({
      op: 'COMMIT_PARAGRAPH',
      data: postData
    });
  },
  toggleParagraph: function() {
    this.set('paragraph.config.visible', !this.paragraph.config.visible);
    this._commitParagraph();
  },

  // To save a pargraph
  saveParagraph: function() {
    var chartManager = this.$$('zeppelin-chart-manager');
    this.set('paragraph.text', this.$$('editor-view').getText());
    if (chartManager) {
      var polymerD3 = chartManager.$$('polymer-d3');
      this.paragraph.config.graph.polymerD3 = polymerD3.getSettings();
    }
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
  },

  runParagraph: function(data) {
    var paragraphCode = (typeof data === 'object') ? this.$$('editor-view').getText() : data;
    var postData = {
      config: this.paragraph.config,
      id: this.paragraph.id,
      title: this.paragraph.title,
      paragraph: paragraphCode
    };
    // this.set('paragraph.result.msg','Loading..')
    // this.set('paragraph.text','Loading..')
    var formPostParams = {};
    this.formObjects.forEach(function(data) {
      formPostParams[data.name] = data.defaultValue;
    });
    this.handlePOST({
      op: 'RUN_PARAGRAPH',
      data: postData,
      params: formPostParams
    });
  },
  pauseParagraph: function() {
    this.handlePOST({
      op: 'CANCEL_PARAGRAPH',
      data: this.paragraph.id,
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
      data: obj.data
    };
    this.set('wsData', postObj);
  }
});
