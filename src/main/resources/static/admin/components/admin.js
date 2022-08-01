Vue.component('my-header',{ template: `<nav class="navbar bg-dark">
		<div class="container-fluid" >
			<img  v-if="$store.state=='welcome'" width="140" src="/assets/img/logo.svg" class="custom-logo" alt="Camunda">
			<div class="row" v-if="$store.state=='form'">
				<my-menu></my-menu>
				<div class="col input-group">
					<button class="btn btn-sm btn-primary" @click="preview()"><i class="bi bi-eye"></i></button>
					<input type="text" class="form-control" placeholder="Form name" aria-label="Formname" v-model="$store.form.name">
					<button class="btn btn-sm btn-primary" @click="saveForm()">Save</button>
				</div>
			</div>
			<div class="row" v-if="$store.state=='mail'">
				<my-menu></my-menu>
				<div class="col input-group">
					<input type="text" class="form-control" placeholder="Mail template name" aria-label="Mailname" v-model="$store.mail.name">
					<button class="btn btn-sm btn-primary" @click="saveMailTemplate()">Save</button>
				</div>
			</div>
		<div><span class="text-light"><b>{{$store.user.name}}</b> working on <b>{{$store.form.name}}</b></span> 
			<a class="logout bi bi-box-arrow-left text-light" @click="logout()"></a></div>
		</div>
		</div>
	</nav>`,
	data() {
		return {"modal":null}
	},
  methods: {
	saveForm() {
		this.$store.form.schema = this.$store.formEditor.getSchema();
		this.$store.form.previewData = JSON.parse(this.$store.form.previewData);
		axios.post('/edition/forms', this.$store.form).then(response => {
			this.$store.form.modified = response.data.modified; 
		}).catch(error => {
			alert(error.message); 
		})
		this.$store.form.previewData = JSON.stringify(this.$store.form.previewData, null, 2);
	},
	preview() {
		if (!this.modal) {
			this.modal = new bootstrap.Modal(document.getElementById('preview-form-modal'), {});
		}
		this.modal.show();
	},
	saveMailTemplate() {
		axios.post('/edition/mails', this.$store.mail).then(response => {
			this.$store.mail.modified = response.data.modified; 
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


Vue.component('admin-page',{
  template: `<div><my-header></my-header>
		<ul class="nav nav-tabs" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="forms-tab" data-bs-toggle="tab" data-bs-target="#forms" type="button" role="tab" aria-controls="forms" aria-selected="true">Forms</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="mails-tab" data-bs-toggle="tab" data-bs-target="#mails" type="button" role="tab" aria-controls="mails" aria-selected="false">Mails</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="users-tab" data-bs-toggle="tab" data-bs-target="#users" type="button" role="tab" aria-controls="users" aria-selected="false">Users</button>
  </li>
</ul>
<div class="tab-content" id="myTabContent">
  <div class="tab-pane fade show active" id="forms" role="tabpanel" aria-labelledby="forms-tab"><forms-list></forms-list></div>
  <div class="tab-pane fade" id="mails" role="tabpanel" aria-labelledby="mails-tab"><mails-list></mails-list></div>
  <div class="tab-pane fade" id="users" role="tabpanel" aria-labelledby="users-tab">...</div>
</div>
	</div>`
});


Vue.component('forms-list',{
	template: `<div class="welcome container">
	<br>
	<button type="button" class="btn btn-primary" @click="newForm()"><i class="bi bi-plus-square"></i> New Form</button>
	<button type="button" class="btn btn-primary" @click="upload()"><i class="bi bi-box-arrow-in-up"></i> Load from file</button>
	<div class="table-responsive">       
		<table class="table table-striped table-hover">
		  <thead>
		    <tr>
		      <th scope="col">Name</th>
		      <th scope="col">Actions</th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr v-for="form in forms">
		      <td>{{form}}</td>
		      <td><button type="button" class="btn btn-primary" v-on:click="openForm(form)"><i class="bi bi-pencil"></i> Open</button>
				<button type="button" class="btn btn-warning" v-on:click="duplicate(form)"><i class="bi bi-files"></i> Duplicate</button>
				<button type="button" class="btn btn-secondary" v-on:click="download(form)"><i class="bi bi-box-arrow-down"></i> Download</button>
				<button type="button" class="btn btn-danger" v-on:click="deleteForm(form)"><i class="bi bi-trash"></i> Delete</a>
			 </td>
		    </tr>
		  </tbody>
		</table>
	</div>
	<upload-form-modal></upload-form-modal>
</div>`,
  data: function () {
    return {
      forms: []
    }
  },
  methods: {
	newForm() {
		this.$store.form.schema = this.$store.defaultForm;
		this.$store.form.name='New Form';
		
		this.$store.state='form';
	},
	duplicate(name) {
		axios.get('/edition/forms/'+name).then(response => {
			this.$store.form = response.data; 
			this.$store.form.schema.id = "Form_"+Math.floor(1000000 + Math.random() * 9000000);
			this.$store.form.name='Duplicate '+this.$store.form.name;
			
			this.$store.state='form';
		}).catch(error => {
			alert(error.message); 
		})
	},
	deleteForm(name) {
		console.log(name);
		axios.delete('/edition/forms/'+name).then(response => {
			axios.get('/edition/forms/names').then(response2 => {
				this.forms = response2.data; 
			})
		}).catch(error => {
			alert(error.message); 
		})
	},
	openForm(name) {
		axios.get('/edition/forms/'+name).then(response => {
			let form = response.data; 
			this.$store.form.name = form.name;
			this.$store.form.schema = form.schema;
			this.$store.form.previewData = JSON.stringify(form.previewData, null, 2);
			this.$store.state='form';
		}).catch(error => {
			alert(error.message); 
		})
	},
	download(name) {
		axios.get('/edition/forms/'+name).then(response => {
			let form = response.data; 
			let url = window.URL.createObjectURL(new Blob([JSON.stringify(form.schema, null, 2)], {type: "application/json"}));
		    const a = document.createElement('a');
		    a.style.display = 'none';
		    a.href = url;
		    a.download = name+".form";
		    a.click();
		    window.URL.revokeObjectURL(url);
		    a.remove();
		}).catch(error => {
			alert(error.message); 
		})
	},
	upload() {
		let modal = new bootstrap.Modal(document.getElementById('upload-form-modal'), {});
		modal.show();
	}
  },
  created: function () {
    axios.get('/edition/forms/names').then(response => {
		this.forms = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});


Vue.component('mails-list',{
	template: `<div class="welcome container">
	<br>
	<button type="button" class="btn btn-primary" @click="newMail()"><i class="bi bi-plus-square"></i> New Mail</button>
	<div class="table-responsive">       
		<table class="table table-striped table-hover">
		  <thead>
		    <tr>
		      <th scope="col">Name</th>
		      <th scope="col">Actions</th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr v-for="mail in mails">
		      <td>{{mail}}</td>
		      <td><button type="button" class="btn btn-primary" v-on:click="openMail(mail)"><i class="bi bi-pencil"></i> Open</button>
				<button type="button" class="btn btn-warning" v-on:click="duplicate(mail)"><i class="bi bi-files"></i> Duplicate</button>
				<button type="button" class="btn btn-danger" v-on:click="deleteMail(mail)"><i class="bi bi-trash"></i> Delete</a>
			 </td>
		    </tr>
		  </tbody>
		</table>
	</div>
</div>`,
  data: function () {
    return {
      mails: []
    }
  },
  methods: {
	newMail() {
		this.$store.mail.htmlTemplate = this.$store.defaultMail;
		this.$store.mail.name='NewMail';
		
		this.$store.state='mail';
	},
	duplicate(name) {
		axios.get('/edition/mails/'+name).then(response => {
			this.$store.mail = response.data; 
			this.$store.mail.name='Duplicate '+this.$store.mail.name;
			
			this.$store.state='mail';
		}).catch(error => {
			alert(error.message); 
		})
	},
	deleteMail(name) {
		console.log(name);
		axios.delete('/edition/mails/'+name).then(response => {
			axios.get('/edition/mails/names').then(response2 => {
				this.mails = response2.data; 
			})
		}).catch(error => {
			alert(error.message); 
		})
	},
	openMail(name) {
		axios.get('/edition/mails/'+name).then(response => {
			let mail = response.data; 
			this.$store.mail.name = mail.name;
			this.$store.mail.htmlTemplate = mail.htmlTemplate;
			this.$store.state='mail';
		}).catch(error => {
			alert(error.message); 
		})
	}
  },
  created: function () {
    axios.get('/edition/mails/names').then(response => {
		this.mails = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});

Vue.component('upload-form-modal',{
  template: `<div class="modal fade" id="upload-form-modal" ref="upload-form-modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header bg-secondary text-light">
        <h5 class="modal-title">Upload a form file</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
		<div class="mb-3">
		  <label for="formFile" class="form-label">Form file</label>
		  <input class="form-control" type="file" id="formFile">
		</div>
      </div>
      <div class="modal-footer">
        <button type="button" :disabled="data.value == \'\'" class="btn btn-primary" @click="load" data-bs-dismiss="modal">Load</button>
        <button class="btn btn-link" data-bs-dismiss="modal">Cancel</button>
      </div>
    </div>
  </div>
</div>`,
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
		    _this.data.value = e.target.result;                     
		  };
		}
	  },
	  load() {
		let schema = JSON.parse(this.data.value);
		this.$store.form.name = schema.id;
		this.$store.form.schema = schema;
		let modal = new bootstrap.Modal(document.getElementById('upload-form-modal'), {});
		modal.hide();
		this.$store.state='form';
	  }
  },
  mounted(){
	document.getElementById("formFile").addEventListener('change', this.prepareLoad);
  }
});