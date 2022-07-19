Vue.component('my-header',{ template: '<nav class="navbar bg-dark">'+
		'<div class="container-fluid">'+
			'<div class="row"><my-menu></my-menu>'+
			'<div class="col input-group">'+
						'<input type="text" class="form-control" placeholder="Form name" aria-label="Formname" v-model="$store.form.name">'+
						'<button class="btn btn-sm btn-primary" v-on:click="saveForm()">Save</button>'+
					'</div></div>'+
			'<div><span class="text-light"><b>{{$store.user.name}}</b> working on <b>{{$store.form.name}}</b></span> '+
			' <a class="logout bi bi-box-arrow-left text-light" @click="logout()"></a></div>'+
		'</div>'+
	'</nav>',
  methods: {
	saveForm() {
		this.$store.form.schema = this.$store.formEditor.getSchema();
		axios.post('/edition/forms', this.$store.form).then(response => {
			this.$store.form.id = response.data.id; 
		}).catch(error => {
			alert(error.message); 
		})
	},
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
		'<upload-form-modal></upload-form-modal>'+
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

Vue.component('my-menu',{ template: '<div class="col dropdown">'+
			 ' <button class="btn btn-outline-light dropdown-toggle" type="button" id="menuEditor" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">Camunda Form Editor</button>'+
			  '<div class="dropdown-menu" aria-labelledby="menuEditor" style="width:280px">'+
				'<div class="btn-group dropend">'+
				  '<button type="button" class="btn btn-block dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">'+
					'Load '+
				  '</button>'+
				  '<ul class="dropdown-menu">'+
					'<li v-for="name in names"><a class="dropdown-item" v-on:click="loadForm(name)">{{name}}</a></li>'+
				  '</ul>'+
				'</div>'+
				'<a class="dropdown-item" v-on:click="newForm()"><i class="bi bi-plus-square"></i> New Form</a>'+
				'<a class="dropdown-item" v-on:click="duplicate()"><i class="bi bi-files"></i> Duplicate</a>'+
				'<li><hr class="dropdown-divider"></li>'+
				'<a class="dropdown-item" v-on:click="download()"><i class="bi bi-box-arrow-down"></i> Download</a>'+
				'<a class="dropdown-item" v-on:click="upload()"><i class="bi bi-box-arrow-in-up"></i> Load from file</a>'+
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
	duplicate() {
		this.$store.form.id=null;
		this.$store.form.schema.id = "Form_"+Math.floor(1000000 + Math.random() * 9000000);
		this.$store.form.name='Duplicate '+this.$store.form.name;
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
	},
	download() {
		let url = window.URL.createObjectURL(new Blob([JSON.stringify(this.$store.form.schema, null, 2)], {type: "application/json"}));
	    const a = document.createElement('a');
	    a.style.display = 'none';
	    a.href = url;
	    a.download = this.$store.form.name+".form";
	    a.click();
	    window.URL.revokeObjectURL(url);
	    a.remove();
	},
	upload() {
		let modal = new bootstrap.Modal(document.getElementById('upload-form-modal'), {});
		modal.show();
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


Vue.component('upload-form-modal',{
  template: '<div class="modal fade" id="upload-form-modal" ref="upload-form-modal" tabindex="-1">'+
  '<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header bg-secondary text-light">'+
        '<h5 class="modal-title">Upload a form file</h5>'+
        '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
      '</div>'+
      '<div class="modal-body">'+
		'<div class="mb-3">'+
		  '<label for="formFile" class="form-label">Form file</label>'+
		  '<input class="form-control" type="file" id="formFile">'+
		'</div>'+
      '</div>'+
      '<div class="modal-footer">'+
        '<button type="button" :disabled="data.value == \'\'" class="btn btn-primary" @click="load" data-bs-dismiss="modal">Load</button>'+
        '<button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>',
  data() {
    return {
		data: {
		  value:""
		}
	}
  },
  methods: {
	  prepareLoad(){
		var file = document.getElementById('formFile').files[0];
		if (file) {
		  var reader = new FileReader();
		  reader.readAsText(file);
		  let _this = this;
		  reader.onload = function(e) {
			console.log(_this);
		    _this.data.value = e.target.result;                     
		  };
		}
	  },
	  load() {
		let schema = JSON.parse(this.data.value);
		this.$store.form.id = null;
		this.$store.form.name = schema.id;
		this.$store.form.schema = schema;
		this.$store.formEditor.importSchema(this.$store.form.schema);
		let modal = new bootstrap.Modal(document.getElementById('upload-form-modal'), {});
		modal.hide();
	  }
  },
  mounted(){
	document.getElementById("formFile").addEventListener('change', this.prepareLoad);
  }
});