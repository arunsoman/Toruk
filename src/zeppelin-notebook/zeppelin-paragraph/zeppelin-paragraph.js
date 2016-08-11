Polymer({

  is: 'zeppelin-paragraph',

  properties: {

    //Paragraph object
    paragraph: {
      type: Object
    },
    notebookId: {
      type: String,
      value: "2A94M5J1Z"
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

    //The content that fills ACE Editor
    content: {
      type: String
    },

    //Results that go to the place where results are shown(graph, html, table)
    result: {
      type: Object
    },

    editorShowLine: {
      type: Boolean,
      value: true
    },
    //Helps to determine and show what's the out put from zeppelin backend
    templatetype: {
      type: Object,
      value: {
        html: false,
        text: false,
        graph: false
      }
    },

    data: {
      type: Object,
      value: {
        external: [],
        source: []
      }
    }
  },
  observers: ['_changeId(paragraph)','_convertObjects(paragraph.settings.forms)', '_gridChange(paragraph.config.*)'],

  __attached: function() {

    if (this.paragraph.result) {
      this.fillTemplate(this.paragraph.result.type);
    }
    this.push('settings.order',this.paragraph.id);

  },
  showDropDown:function(){
    this.$$('#navdrop').open();
  },

  _changeId:function(data){
    if (this.paragraph.result) {
      this.fillTemplate(this.paragraph.result.type);
    }
    //this.push('settings.order',this.paragraph.id);
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
      this._commit_paragraph();
    }
  },

  _commit_paragraph: function() {
    var postData = {
      config: this.paragraph.config,
      id: this.paragraph.id,
      paragraph: this.paragraph.text
    };
    this.handlePOST({
      op: "COMMIT_PARAGRAPH",
      data: postData
    });
  },

  hideNumber: function() {
    this.set('editorShowLine', !this.editorShowLine);
    this.$$('editor-view').editor.renderer.setShowGutter(this.editorShowLine);
  },

  //Handles API Response  and sets 
  handleResponse: function(response) {
    var res = response.detail.response.body;
    this.set('paragraph', res);
    this.set('grid', res.config.colWidth);
    if (res.result) {
      this.fillTemplate(res.result.type);
    }
  },

  //Selects template type to fill.
  fillTemplate: function(resultType) {

    switch (resultType) {
      case 'HTML':
      case 'TEXT':
      case 'ANGULAR':
        this.set('templatetype.html', true);
        break;
      case 'TABLE':
        this.set('templatetype.graph', true);
        break;
    }
  },

  runParagraph: function() {
    var postData = {
      config: this.paragraph.config,
      id: this.paragraph.id,
      paragraph: this.paragraph.text
    };
    this.handlePOST({
      op: "RUN_PARAGRAPH",
      data: postData
    });
  },

  addParagraph: function() {
    var newIndex = parseInt(this.index) + 1;
    this.handlePOST({
      op: "INSERT_PARAGRAPH",
      data: {
        index: newIndex
      }
    });
  },

  removeParagraph: function() {
    var newIndex = parseInt(this.index) + 1;
    this.handlePOST({
      op: "PARAGRAPH_REMOVE",
      data: {
        id: this.paragraph.id
      }
    });
  },

  moveDown: function(e) {
    var newIndex = parseInt(this.index) + 1;

    this.handlePOST({
      op: "MOVE_PARAGRAPH",
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
      op: "MOVE_PARAGRAPH",
      data: {
        id: this.paragraph.id,
        index: newIndex
      }
    });
  },
  postResponse: function(res) {
    console.info(res.detail.response.status);
  },
  //Handler for run
  handlePOST: function(obj) {
    var postObj = {
      op: obj.op,
      principal: "anonymous",
      roles: "[]",
      data: obj.data,
      ticket: "anonymous"
    }
    this.set('wsData', postObj);
  }

});
