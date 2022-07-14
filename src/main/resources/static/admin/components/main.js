Vue.component('my-header',{ template: '<nav class="navbar bg-dark">'+
		'<div class="container-fluid">'+
			'<my-menu></my-menu>'+
			'<div><span class="text-light"><b>{{$store.user.name}}</b> working on <b>{{$store.form.name}}</b></span> '+
			' <a class="logout bi bi-box-arrow-left text-light" @click="logout()"></a></div>'+
		'</div>'+
	'</nav>',
  methods: {
	  logout() {
		this.$store.user.name=null;
		this.$store.user.token=null;
		this.$store.auth=false;
		localStorage.removeItem('camundaUser');
	  }
  }
 });
 
 
Vue.component('main-page',{
  template: '<div><my-header></my-header>'+
		'<div id="form-editor"></div>'+
	'</div>',
	mounted: function(){
		schema = {
		  "components": [
			{
			  "key": "sometext",
			  "label": "Some Text",
			  "type": "textfield",
			  "id": "Field_1djmro0"
			},
		  ],
		  "schemaVersion": 4,
		  "type": "default",
		  "id": "Form_"+Math.floor(1000000 + Math.random() * 9000000),
		  "executionPlatform": "Camunda Cloud",
		  "executionPlatformVersion": "1.1",
		  "exporter": {
			"name": "Camunda Modeler",
			"version": "5.0.0"
		  }
		}

		this.$store.formEditor = new FormEditor.FormEditor({
		  container: document.querySelector('#form-editor')
		});
		this.$store.formEditor.importSchema(schema);
	}
});

Vue.component('my-menu',{ template: '<div class="dropdown">'+
			 ' <button class="btn btn-outline-light dropdown-toggle" type="button" id="menuEditor" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Camunda Form Editor</button>'+
			  '<div class="dropdown-menu" aria-labelledby="menuEditor" style="width:280px">'+
				'<div class="dropdown-item">'+
					'<div class="input-group">'+
						'<input type="text" class="form-control" placeholder="Form name" aria-label="Formname" v-model="$store.form.name">'+
						'<button class="btn btn-sm btn-primary" v-on:click="saveForm()">Save</button>'+
					'</div>'+
				'</div>'+
				'<div class="dropdown-item">'+
					'<button class="btn btn-block btn-primary" v-on:click="newForm()">New Form</button>'+
				'</div>'+
				'<div class="btn-group dropend">'+
				  '<button type="button" class="btn btn-block dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">'+
					'Load '+
				  '</button>'+
				  '<ul class="dropdown-menu">'+
					'<li v-for="name in names"><a class="dropdown-item" v-on:click="loadForm(name)">{{name}}</a></li>'+
				  '</ul>'+
				'</div>'+
			  '</div>'+
			'</div>',
  data: function () {
    return {
      names: []
    }
  },
  methods: {
	newForm() {
		schema = {
		  "components": [
			{
			  "key": "sometext",
			  "label": "Some Text",
			  "type": "textfield",
			  "id": "Field_1djmro0"
			},
		  ],
		  "schemaVersion": 4,
		  "type": "default",
		  "id": "Form_"+Math.floor(1000000 + Math.random() * 9000000),
		  "executionPlatform": "Camunda Cloud",
		  "executionPlatformVersion": "1.1",
		  "exporter": {
			"name": "Camunda Modeler",
			"version": "5.0.0"
		  }
		}
		this.$store.form.schema = schema;
		this.$store.form.id=null;
		this.$store.form.name='New Form';
		this.$store.formEditor.importSchema(schema);
	},
	saveForm() {
		this.$store.form.schema = this.$store.formEditor.getSchema();
		axios.post('/edition/forms', this.$store.form).then(response => {
			this.$store.form.id = response.data.id; 
		}).catch(error => {
			alert(error.message); 
		})
	},
	loadForm(name) {
		axios.get('/edition/forms?name='+name).then(response => {
			let form = response.data[0]; 
			this.$store.form.id = form.id;
			this.$store.form.name = form.name;
			this.$store.form.schema = form.schema;
			this.$store.formEditor.importSchema(form.schema);
		}).catch(error => {
			alert(error.message); 
		})
	}
  },
  created: function () {
    axios.get('/edition/forms/names').then(response => {
		this.names = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});
