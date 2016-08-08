Polymer({

  is: 'zeppelin-paragraph',

  properties: {

    //Paragraph object
    paragraph: {
      type: Object,
      value: {
        config: {},
        id: null,
        status: '',
        text: '',
        jobName: ''
      }
    },
    notebookId:{
      type:String
    },
    // import dependency charts
    charts: {
      type: Array,
      notify:true
    },

    //The content that fills ACE Editor
    content: {
      type: String
    },

    //Results that go to the place where results are shown(graph, html, table)
    result: {
      type: Object
    },

    //Helps to determine and show what's the out put from zeppelin backend
    templatetype: {
      type: Object,
      value: {
        html: false,
        text: false,
        graph: false
      }
    },
    formObjects:{
      type:Array,
      value:[]
    },
    data:{
      type:Object,
      value:{
        external:[],
        source:[]
      }
    }

    // //base url for zeppelin `http://localhost:8080/#/api` by default
    // url: {
    //   type: String,
    //   value: 'http://localhost:8080/api'
    // }
  },
  observers:['_convertObjects(paragraph.settings.forms)'],

  _convertObjects:function(item){
    if(item){
      var objectKey = Object.keys(item);
      var me = this;
      objectKey.forEach(function(a){
        me.push('formObjects',me.get('paragraph.settings.forms.'+a));
      });
    }
  },
  
  //Handles API Response  and sets 
  handleResponse: function(response) {
    var res = response.detail.response.body;
    this.set('paragraph', res);
    this.set('grid',res.config.colWidth);
    if(res.result){
      this.fillTemplate(res.result.type);
    }
  },
  
  //Selects template type to fill.
  fillTemplate: function(resultType) {

    switch (resultType) {
      case 'HTML':
      case 'TEXT':
      case 'ANGULAR':
        this.set('templatetype.html', true);
        break;
      case 'TABLE':
        this.set('templatetype.graph', true);
        break;
    }
  },

  //Runs Paragraph
  runParagraph: function() {
    this.$.ajaxPost.url = this.url + '/notebook/job/2A94M5J1Z/' + this.paragraph.id;
    this.$.ajaxPost.method = 'POST';
    this.$.ajaxPost.body = JSON.stringify(this.paragraph);
    this.$.ajaxPost.generateRequest();
  },
  //Handler for run
  handlePOST: function(res) {
    console.info(res.detail.response.status);
  }

});
