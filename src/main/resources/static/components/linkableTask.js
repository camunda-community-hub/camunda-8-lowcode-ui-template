Vue.component('linkable-task',{
  template: '<div><my-header></my-header>'+
	'<div class="container-fluid bg-light">'+
		'<div class="row flex-nowrap">'+
			'<main class="mainContent col ps-md-2 pt-2">'+
				'<task-form></task-form>'+
			'</main>'+
		'</div>'+
	'</div>'+
	'</div>'
});



Vue.component('error-auth',{
  template: '<div class="alert alert-danger" role="alert">'+
  'Token isn\'t recognized.'+
'</div>'
});