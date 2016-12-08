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
    this.innerHTML = result;
  }
});
