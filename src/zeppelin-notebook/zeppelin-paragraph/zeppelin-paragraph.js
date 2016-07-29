Polymer({

  is: 'zeppelin-paragraph',

  properties: {

    //Paragraph object
    paragraph: {
      type: Object,
      value: {
        config: {},
        result: {},
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
      type: Array
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

    // //base url for zeppelin `http://localhost:8080/#/api` by default
    // zeppelinUrl: {
    //   type: String,
    //   value: 'http://localhost:8080/api'
    // }
  },
  
  ready: function() {

    // //To Do: Ajax only if data isn't passed down by notebook
    // this.async(function() {
    //   this.$.ajax.url = this.zeppelinUrl + '/notebook/2A94M5J1Z/paragraph/20150212-145404_867439529';
    //   this.$.ajax.method = 'GET';
    //   this.$.ajax.generateRequest();
    // });
  },
  
  //Handles API Response  and sets 
  handleResponse: function(response) {
    var res = response.detail.response.body;
    this.set('paragraph', res);
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
    this.$.ajaxPost.url = this.zeppelinUrl + '/notebook/job/2A94M5J1Z/' + this.paragraph.id;
    this.$.ajaxPost.method = 'POST';
    this.$.ajaxPost.body = JSON.stringify(this.paragraph);
    this.$.ajaxPost.generateRequest();
  },
  //Handler for run
  handlePOST: function(res) {
    console.info(res.detail.response.status);
  }

});
