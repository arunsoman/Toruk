Polymer({

	is: 'zeppelin-notebooks',
	properties: {
		responseItems: {
			type: Array
		},
		notebookId: {
			type: String,
			notify: true
		}
	},
	observers: ['selectedChange(selectedItem)'],

	handleResponse: function(response) {

		// to pass id value as name if name is null or empty
		var mapItem = response.detail.response.body.map(item => {
			return {
				id: item.id,
				name: (item.name == '' ? item.id : item.name)
			}
		})
		this.set('responseItems', mapItem);
	},

	selectedChange: function(item) {
		console.log(item);
		this.set('notebookId', item.id);
	},
	viewNotebook: function() {

	},
	editNotebook: function() {

	}
});
