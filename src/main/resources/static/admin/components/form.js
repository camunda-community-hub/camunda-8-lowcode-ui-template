 
Vue.component('form-page',{
  template: `<div><my-header></my-header>
		<div id="form-editor"></div>
		<preview-form-modal></preview-form-modal>
	</div>`,
	mounted: function(){

		this.$store.formEditor = new FormEditor.FormEditor({
		  container: document.querySelector('#form-editor')
		});
		
		this.$store.formEditor.importSchema(this.$store.form.schema);
	}
});

Vue.component('my-menu',{ template: `<div class="col">
			  <button class="btn btn-outline-light" v-on:click="welcome()">Camunda admin page</button>
			 
			</div>`,
  data: function () {
    return {
      names: [],
      menuEditor : null
    }
  },
  methods: {
	welcome() {
		this.$store.state='welcome';
	}
  }
});




Vue.component('preview-form-modal',{
  template: `<div class="modal" id="preview-form-modal" ref="preview-form-modal" tabindex="-1">
  <div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
      <div class="modal-header bg-secondary text-light">
        <h5 class="modal-title">Preview form</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
		<div class="row" v-if="shown==true">
		  <div class="card col"><data-preview-editor :form="form"></data-preview-editor></div>
		  <div class="card col"><div id="task-form-preview"></div></div>
		</div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>`,
  data() {
    return {
	  shown: false,
	  form: null
    }
  },
  methods: {
	  showned(){
		  this.shown = true;
	  },
	  closed(){
		  this.shown = false;
		  this.form=null;
	  }
  },
  updated(){
	if (this.shown) {
		if (this.form==null) {
			this.form = new FormViewer.Form({
				container: document.querySelector('#task-form-preview')
			});
		}
		try {
			this.form.importSchema(this.$store.formEditor._state.schema, JSON.parse(this.$store.form.previewData));
		} catch(err) {
			
		}
	}
  },
  mounted() {
	document.getElementById("preview-form-modal").addEventListener('hide.bs.modal', this.closed);
	document.getElementById("preview-form-modal").addEventListener('shown.bs.modal', this.showned);
  }
});

Vue.component('data-preview-editor',{
  template: `<div style="height: calc(100vh - 185px)"><span class="form-label">Data preview value</span><textarea id="jsonEditor">{{$store.form.previewData}}</textarea></div>`,
  props:['form'],
  mounted() {
	this.codemirror = CodeMirror.fromTextArea(document.getElementById('jsonEditor'), {
				lineNumbers: true,
				matchBrackets: true,
				continueComments: "Enter",
				extraKeys: {"Ctrl-Q": "toggleComment"},
				autoRefresh:true,
				mode: "json"
			  });
	this.codemirror.on('change', (cm) => {
		this.$store.form.previewData = cm.getValue();
		try {
			this.form.importSchema(this.$store.formEditor._state.schema, JSON.parse(this.$store.form.previewData));
		} catch(err) {
			
		}
    });
  }
});
