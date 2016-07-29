Polymer({
  is: 'chart-view',

  properties: {
    //Result from backend
    paragraph: {},

    charts: {
      type: Array
    },

  },
  observers: ['_importCharts(charts)'],

  _importCharts: function(charts) {
    var me = this;
    if (charts) {
      charts.forEach(function(chart) {
        me._importFile(chart, function(a) {
          var el = document.createElement(chart);
          el.paragraph = this.paragraph;
          me.$.graph.appendChild(el);
        })
      });
    }
  },
  _importFile: function(path,onload) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'import');
    link.setAttribute('href','../charts/' + path + '/' + path + '.html');
    this.appendChild(link);
    link.onload = onload;
  }
});
