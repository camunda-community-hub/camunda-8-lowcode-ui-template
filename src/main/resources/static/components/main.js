Vue.component('my-header',{ template: '<nav class="navbar navbar-light">'+
		'<div class="container-fluid">'+
			'<img width="140" src="/assets/img/logo.svg" class="custom-logo" alt="Camunda">'+
			'<div><span class="text-primary">Hello {{$store.user.name}}</span> '+
			'<translate-menu></translate-menu>'+
			' <a class="logout bi bi-box-arrow-left" @click="logout()"></a></div>'+
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
	'<div class="container-fluid bg-light">'+
		'<div class="row flex-nowrap">'+
			'<div class="col-auto px-0">'+
				'<side-bar></side-bar>'+
			'</div>'+
			'<main class="mainContent col ps-md-2 pt-2">'+
				'<h2>{{title}}</h2>'+
				'<mytasks v-if="$store.state==\'mytasks\'"></mytasks>'+
				'<unassignedtasks v-if="$store.state==\'unassignedtasks\'"></unassignedtasks>'+
				'<archivedtasks v-if="$store.state==\'archivedtasks\'"></archivedtasks>'+
				'<new-instance v-if="$store.state==\'newInstance\'"></new-instance>'+
				'<instance-confirmation v-if="$store.state==\'instanceConfirmation\'"></instance-confirmation>'+
			'</main>'+
		'</div>'+
	'</div>'+
	'</div>',
	computed: {
		title() {
			return this.$t("message."+this.$store.state);
		}
	}
});
Vue.component('side-bar',{
  template: '<div id="sidebar" class="border-end">'+
		'<div id="sidebar-nav" class="list-group bg-secondary border-0 rounded-0 text-sm-start">'+		
			'<ul class="navbar-nav me-auto mb-2 mb-lg-0">'+
				'<li class="nav-item"><a class="nav-link text-light p-2" @click="open(\'mytasks\')"><i class="bi bi-person-check"></i> {{ $t("message.mytasks") }}</a></li>'+
				'<li class="nav-item"><a class="nav-link text-light p-2" @click="open(\'unassignedtasks\')"><i class="bi bi-inboxes""></i> {{ $t("message.unassignedtasks") }}</a></li>'+
				'<li class="nav-item"><a class="nav-link text-light p-2" @click="open(\'archivedtasks\')"><i class="bi bi-inboxes-fill"></i> {{ $t("message.archivedtasks") }}</a></li>'+
				'<li class="nav-item"><a class="nav-link text-light p-2" @click="open(\'newInstance\')"><i class="bi bi-send"></i> {{ $t("message.newInstance") }}</a></li>'+
			'</ul>'+
		'</div>'+
	'</div>',
  methods: {
	  open(state) {
		this.$store.state=state;
		this.$store.task={
			id: null,
			name: null,
			creationTime: "1970-01-01",
			variables:null
		}
	  },
	  newOrder() {
		let modal = new bootstrap.Modal(document.getElementById('newOrderModal'), {});
		modal.show();
	  }
  }
});

