Polymer({
  is: 'zeppelin-dynamic-input',

  properties: {
    forms: {
      type: Object
    },
    params: {
      type: Object
    },
    mappedObj: {
      type: Object,
      value: {
        label: '',
        value: ''
      }
    }
  },
  observers: ['_mappedObjObs(mappedObj.value)'],

  // On input change, set the specific param with current value
  _mappedObjObs: function(val) {
    var param = this.mappedObj.label;
    if (this.params) {
      this.params[param] = val;
    }
  }
});
