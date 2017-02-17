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
    var resultIframe = this.querySelector('#result-display');
    resultIframe.addEventListener('load', function() {
      var resultIframeDocument = resultIframe.contentWindow.document;
      resultIframeDocument.write(result);
    });
    // this.innerHTML = '';
    // var newdiv = document.createElement('div');
    // newdiv.innerHTML = result;
    // this.appendChild(newdiv);
    // // To run scipt blocks in HTML-MODE
    // // catch all script tags and execute what's inside
    // var scriptTags = this.querySelectorAll('script');
    // [].forEach.call(scriptTags, function(tag) {
    //   try {
    //     this.async(function() {
    //       /* eslint no-eval: 0 */
    //       eval(tag.innerHTML); // eval is evil!
    //     });
    //   } catch (e) {
    //     console.warn(e);
    //   }
    // }.bind(this));
  }
});
