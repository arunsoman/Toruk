Polymer({

	is: 'zeppelin-notebook',
	properties: {
		responseItems: {
			type: Array
		},
		url: {
			type: String
		},
		paragraphId: {
			type: String
		}
	},
	handleResponse: function(response) {
		this.set('responseItems', response.detail.response.body);
	}
});
