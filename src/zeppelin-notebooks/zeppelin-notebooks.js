Polymer({

  is: 'zeppelin-notebooks',
  properties:{
    responseItems:{
      type:Array
    }
  },
  
  handleResponse: function(response) {
    this.set('responseItems',response.detail.response.body);
  }
});
