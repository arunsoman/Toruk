Polymer({
  is: 'zeppelin-dynamic-form',

  properties: {

    // Forms
    forms: {
      type: Object
    },

    // Params
    params: {
      type: Object
    },

    // Array from which inputs are created
    formArray: {
      type: Array
    }
  },

  observers: ['_formsObs(forms.*)'],

  _formsObs: function(formObj) {
    if (formObj.path === 'forms') {
      this.set('formArray', this._map(formObj.value));
    }
  },

  // Converts object into array
  _map: function(fromObj) {
    var arr = [];
    fromObj.forEach(function(el, key) {
      arr.push({
        label: key,
        value: this.params[key]
      });
    });
    return arr;
  }

});
