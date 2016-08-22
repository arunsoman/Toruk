Polymer({
  is: 'zeppelin-chart-manager',
  properties: {
    source: {
      type: Object,
      value: []
    },
    external: {
      type: Array,
      value: []
    }
  },
  observers: ['csvtoJSON(data.result.msg)'],

  csvtoJSON: function(csv) {
    var me = this;
    if (csv) {
      var headerObj = [];
      var lines = csv.split('\n');
      var result = [];
      var headers = lines[0].split('\t');
      var firstRow = lines[1].split('\t');

      for (var key in headers) {
        var type = me.getDataType(firstRow[key]);
        headerObj.push({
          'key': headers[key],
          'value': key,
          'type': type
        })
      }
      me.set('external', headerObj);

      for (var i = 1; i < lines.length; i++) {
        var obj = [];
        var currentline = lines[i].split('\t');

        for (var j = 0; j < headers.length; j++) {
          var converted = me.convertData(currentline[j], headerObj[j].type);
          obj.push(converted);
        }

        result.push(obj);

      }

      this.set('source', result); //JavaScript object
    }


  },

  getDataType: function(data) {
    var result = '';
    if (data.match(/^\d+$/g)) {
      result = "Number";
    } else if (Date.parse(data)) {
      result = "Date";
    } else {
      result = "String";
    }
    return result;
  },

  convertData: function(data, type) {
    var result;
    switch (type) {
      case "Number":
        result = parseInt(data);
        break;
      case "Date":
        result = new Date(data);
        break;
      default:
        result = data;
    }
    return result;
  }

});