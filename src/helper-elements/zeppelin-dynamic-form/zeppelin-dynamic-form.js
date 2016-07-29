Polymer({
  is: 'zeppelin-dynamic-form',

  properties: {

    //Forms
    forms: {
      type: Object
    },

    //Params
    params: {
      type: Object
    },

    //Array from which inputs are created
    formArray: {
      type: Array
    }
  },

  observers: ['_formsObs(forms.*)'],

  _formsObs: function(formObj) {
    var tempArray;
    if (formObj.path === 'forms') {
      this.set('formArray', this._map(formObj.value));
    }
  },

  //Converts object into array
  _map: function(fromObj) {
    var arr = [];
    for (var key in fromObj) {
      arr.push({
        label: key,
        value: this.params[key]
      });
    }
    return arr;
  }

});
