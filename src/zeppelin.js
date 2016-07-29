(function() {
  'use strict';
  window.zeppelin = window.zeppelin || {};

  var zeppelin = window.zeppelin;

  //Config for zeppelin
  zeppelin.config = {
    charts: '../charts/'
  };

  //Helper function to map csv from zeppelin into json
  zeppelin.csvtoJSON = function(csv) {

    var lines = csv.split('\n');
    var result = [];
    var headers = lines[0].split('\t');

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split('\t');

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);

    }
    
    return result; //JavaScript object
  };
  // debugger;
  // condocument.currentScript;

  //To import webcomponents on the fly
  //Path: Path of element.
  //onload: Callback on successfull load
  //onerror: Callback on loading failure
  zeppelin.importElem = function(path, onload, onerror) {

    var link = document.createElement('link');
            link.setAttribute('rel', 'import');
            link.setAttribute('href', zeppelin.config.charts+path+'/'+path+'.html');
            this.appendChild(link);
            link.onload = onload;

    // Polymer.Base.importHref(zeppelin.config.charts+path+'/'+path+'.html', function(success) {
    //   onload(success);
    // }, function(error) {
    //   onerror(error);
    // });
  };

})();
