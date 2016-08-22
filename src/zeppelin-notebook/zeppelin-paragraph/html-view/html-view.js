Polymer({

  is: 'html-view',

  properties: {

    // The String version of htmlnode, coming from zeppelin backend
    result: {
      type: String,
      value: ''
    },

    // parsed HTML node to be placed inside div#html_content
    parsedNode: {}
  },

  observers: ['_resultObs(result)'],

  // Attaching directly to div#html_content not works some times-
  // because the dom-if couldn't render the `html-view` element
  _resultObs: function(result) {
    if (result) {
      this.parsedNode = '';
    } else {
      this.parsedNode = result.msg;
    }
    if (this.$$('#html_content')) {
      this._setInnerHTML();
    }
  },

  _setInnerHTML: function() {
    if (this.parsedNode === '') {
      this.$$('#html_content').innerHTML = '';
    } else {
      this.$$('#html_content').innerHTML = this.parsedNode;
    }
  },

  attached: function() {
    // Workaround related to _resultObs issue
    this._setInnerHTML();
  }

});
