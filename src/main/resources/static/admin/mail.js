Vue.component('mail-page',{
  template: `<div><my-header></my-header>
		<mail-editor></mail-editor>
	</div>`
});
Vue.component('mail-editor',{
  template: `<div class="row maileditor">
		  <div class="card col">
		    <h5 class="card-title">Mail editor</h5>
		  	<textarea id="mailEditor">{{$store.mail.htmlTemplate}}</textarea>
		  </div>
		  <div class="card col">
		    <h5 class="card-title">Mail preview</h5>
		    <div id="mail-preview" v-html="$store.mail.htmlTemplate"></div></div>
		</div>
		`,
  props:['form'],
  mounted() {
	
      var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                       mode: null},
                      {matches: /(text|application)\/(x-)?vb(a|script)/i,
                       mode: "vbscript"}]
      };
      this.codemirror = CodeMirror.fromTextArea(document.getElementById("mailEditor"), {
        lineNumbers: true,
		mode: mixedMode,
        selectionPointer: true
      });
    
	
	this.codemirror.on('change', (cm) => {
		this.$store.mail.htmlTemplate = cm.getValue();
    });
  }
});