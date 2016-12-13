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
    },
    viewMode: {
      type: Boolean,
      value: false
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

      headers.forEach(function(el, key) {
        var type = me.getDataType(firstRow[key]);
        headerObj.push({
          key: headers[key],
          value: key,
          type: type
        });
      });

      me.set('external', headerObj);

      // lines.length - 1 is used because, last row is always just a '\n' with no data
      for (var i = 1; i < lines.length - 1; i++) {
        var obj = [];
        var currentline = lines[i].split('\t');
        for (var j = 0; j < headers.length; j++) {
          var converted = me.convertData(currentline[j], headerObj[j].type);
          obj.push(converted);
        }

        result.push(obj);
      }
      this.set('source', result);
      if (this.data.result.type === 'TABLE') {
        if (!this.data.config.graph) {
          this.data.config.graph = {};
        }
        var polyD3 = this.data.config.graph.polymerD3;
        var chartConf = {
          externals: this.external,
          source: this.source,
          mode: 'create' // Can be view and create
        };
        if (polyD3) {
          chartConf.mode = 'edit';
          chartConf.availableCharts = polyD3.availableCharts;
          chartConf.selectedChart = polyD3.selectedChart;
          chartConf.legendSettings = polyD3.selectedChart.settings.legendSettings;
          chartConf.settings = polyD3.selectedChart.settings.settings;
          chartConf.inputs = polyD3.selectedChart.settings.inputs;
        }
        if (this.viewMode == true) {
          chartConf.mode = 'view';
        }
        // Avoid twoway binding with polymer-d3
        // Too much data tangling
        this.$$('polymer-d3').bootstrapCharts(chartConf);
      }
    }
  },

  getDataType: function(data) {
    var result = '';
    if (data.match(/^\d*\.?\d*$/g)) {
      result = 'Number';
    } else if (Date.parse(data)) {
      result = 'Date';
    } else {
      result = 'String';
    }
    return result;
  },

  convertData: function(data, type) {
    var result;
    switch (type) {
    case 'Number':
      result = parseFloat(data);
      break;
    case 'Date':
      result = new Date(data);
      break;
    default:
      result = data;
    }
    return result;
  }

});
