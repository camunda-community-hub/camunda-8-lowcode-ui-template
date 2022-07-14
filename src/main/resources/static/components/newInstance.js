Vue.component('new-instance',{
  template: '<div>'+
	    '<div class="alert alert-danger" role="alert" v-if="errors.length">'+
		  '<b>Please correct the following error(s):</b>'+
		  '<ul><li v-for="error in errors">{{ error }}</li></ul>'+
		'</div>'+
		'<div class="input-group mb-3">'+
		  '<span class="input-group-text">Texte</span>'+
		  '<input type="text" class="form-control" id="texte" placeholder="some text" v-model="data.texte">'+
		  '<span class="input-group-text"><i class="bi bi-person"></i></span>'+
		'</div>'+

	

        '<button type="button" class="btn btn-primary" @click="newInstance()">{{ $t("message.newInstance") }}</button>'+
'</div>',
  data() {
    return {
		data: {
		  texte:"Chris",
		  comments:""
		},
    	errors: []
	}
  },
  methods: {
	newInstance() {
		this.checkForm();
		if (this.errors.length==0) {

		    axios.post('/process/start', this.data).then(response => {
				this.$store.state='instanceConfirmation';
			}).catch(error => {
				alert(error.message); 
			})
		}
	},
	checkForm() {
      
      this.errors = [];

      if (!this.data.texte) {
        this.errors.push('texte required.');
      }
      
    }
  },
});
Vue.component('instance-confirmation',{
  template: '<div class="alert alert-success" role="alert">'+
  'Your request has been taken into account.'+
'</div>'
});