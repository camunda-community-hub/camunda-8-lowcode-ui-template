
Vue.component('new-instance',{
		template: '<div class="card" v-if="$store.process.bpmnProcessId">'+
			'<div id="instanciation-form"></div>'+
			'<div class="ms-2 me-2 mb-2 d-flex justify-content-end">'+
	        '<button type="button" class="btn btn-primary" @click="submit()">{{ $t("message.submit") }}</button>'+
	        '</div>'+
			'</div>'
	,
	data() {
    	return {
     	  form: null
		}
	},
	methods: {
		submit() {
			this.form.validate();
			let errors = [];
			for (const field in this.form._state.errors) {
			  if (this.form._state.errors[field].length>0) {
				Array.prototype.push.apply(errors, this.form._state.errors[field]);
			  }
			}
			if (errors.length==0) {
			    axios.post('/process/'+this.$store.process.bpmnProcessId+'/start', this.form._getState().data, this.$store.axiosHeaders).then(response => {
					this.$store.state='instanceConfirmation';
				}).catch(error => {
					alert(error.message); 
				})
			}
		}
	},
	mounted:function() {
		if (!this.$store.process.bpmnProcessId) {
			this.form = null;
		} else {
			let url = '/forms/instanciation/'+this.$store.process.bpmnProcessId;

		    axios.get(url, this.$store.axiosHeaders).then(response => {
				let schema = response.data; 
				if (this.form==null) {
					this.form = new FormViewer.Form({
					  container: document.querySelector('#instanciation-form')
					});
				}
				
				this.form.importSchema(schema, this.$store.task.variables);
	
			}).catch(error => {
				alert(error.message); 
			})
		}
	}
});

Vue.component('instance-confirmation',{
  template: '<div class="alert alert-success" role="alert">'+
  'Your request has been taken into account.'+
'</div>'
});