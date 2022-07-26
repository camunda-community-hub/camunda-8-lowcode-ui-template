
Vue.component('task-form',{
		template: '<div class="card" v-if="$store.task.id">'+
			'<h5 class="card-title">{{$store.task.name}}</h5>'+
			'<div id="task-form"></div>'+
			'<div class="ms-2 me-2 mb-2 d-flex justify-content-between">'+
	        '<button v-if="$store.task.assignee" type="button" class="btn btn-primary" @click="unclaim()">{{ $t("message.unclaim") }}</button>'+
	        '<button v-if="!$store.task.assignee" type="button" class="btn btn-primary" @click="claim()">{{ $t("message.claim") }}</button>'+
	        '<button :disabled="!$store.task.assignee || $store.task.assignee!=$store.user.name" type="button" class="btn btn-primary" @click="submit()">{{ $t("message.submit") }}</button>'+
	        '</div>'+
			'</div>'
	,
	data() {
    	return {
     	  form: null
		}
	},
	methods: {
		claim() {
			axios.get('/tasks/'+this.$store.task.id+'/claim/'+this.$store.user.name, this.$store.axiosHeaders).then(response => {
		    	this.$store.task.assignee=this.$store.user.name;
			}).catch(error => {
				alert(error.message); 
			})
		},
		unclaim() {
			axios.get('/tasks/'+this.$store.task.id+'/unclaim/', this.$store.axiosHeaders).then(response => {
		    	this.$store.task.assignee=null;
			}).catch(error => {
				alert(error.message); 
			})
		},
		submit() {
		    axios.post('/tasks/'+this.$store.task.id, this.form._getState().data, this.$store.axiosHeaders).then(response => {
				//Vue.set(this.$store.task, 'done', true);
				let i =0;
				for(;i<this.$store.tasks.length;i++) {
					if (this.$store.tasks[i].id==this.$store.task.id) {
						this.$store.tasks.splice(i,1);
						break;
					}
				}
				if(i<this.$store.tasks.length) {
					this.$store.task = this.$store.tasks[i];
				} else {
					this.$store.task = {
						id: null,
						name: null,
						creationTime: "1970-01-01"
					};
					this.form = null;	
				}
				
			}).catch(error => {
				alert(error.message); 
			})
		}
	},
	updated:function() {
		if (!this.$store.task.id) {
			this.form = null;
		} else {
			let url = '/forms/'+this.$store.task.processDefinitionId+'/'+this.$store.task.formKey;

		    axios.get(url, this.$store.axiosHeaders).then(response => {
				let schema = response.data; 
				if (this.form==null) {
					this.form = new FormViewer.Form({
					  container: document.querySelector('#task-form')
					});
				}
				
				this.form.importSchema(schema, this.$store.task.variables);
	
			}).catch(error => {
				alert(error.message); 
			})
		}
	}
});

	