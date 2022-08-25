Vue.component('my-header',{ template: `<nav class="navbar navbar-light">
		<div class="container-fluid">
			<img width="140" src="/assets/img/logo.svg" class="custom-logo" alt="Camunda">
			<div><span class="text-primary">Hello {{$store.user.name}}</span>
			<translate-menu></translate-menu>
			<a class="logout bi bi-box-arrow-left" @click="logout()"></a></div>
		</div>
    </nav>`,
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
  template: `<div><my-header></my-header>
	<div class="container-fluid bg-light">
		<div class="row flex-nowrap">
			<div class="col-auto px-0">
				<side-bar></side-bar>
			</div>
			<main class="mainContent col ps-md-2 pt-2">
				<h2>{{title}}</h2>
				<mytasks v-if="$store.state=='mytasks'"></mytasks>
				<unassignedtasks v-if="$store.state=='unassignedtasks'"></unassignedtasks>
				<archivedtasks v-if="$store.state=='archivedtasks'"></archivedtasks>
				<new-instance v-if="$store.state.startsWith('proc')"></new-instance>
				<instance-confirmation v-if="$store.state=='instanceConfirmation'"></instance-confirmation>
			</main>
		</div>
	</div>
</div>`,
	computed: {
		title() {
			if (!this.$store.state.startsWith('proc')) {
				return this.$t("message."+this.$store.state);
			}
			return this.$store.process.name;
		}
	}
});
Vue.component('side-bar',{
  template: `<div id="sidebar" class="border-end">
		<div id="sidebar-nav" class="list-group bg-secondary border-0 rounded-0 text-sm-start">
		  <a href="#taskmenu" data-bs-toggle="collapse" class="nav-link px-0 align-middle text-light dropdown-toggle move">
            <i class="bi bi-list-task"></i> <span class="ms-1 d-none d-sm-inline ">{{ $t("message.tasks") }}</span>
          </a>
          <ul class="collapse nav flex-column ms-2 show" id="taskmenu">
            <li><a href="#" class="nav-link px-0 text-light" @click="open(\'mytasks\')"><i class="bi bi-person-check"></i> {{ $t("message.mytasks") }}</a></li>
            <li><a href="#" class="nav-link px-0 text-light" @click="open(\'unassignedtasks\')"><i class="bi bi-inboxes"></i> {{ $t("message.unassignedtasks") }}</a></li>
            <li><a href="#" class="nav-link px-0 text-light" @click="open(\'archivedtasks\')"><i class="bi bi-inboxes-fill"></i> {{ $t("message.archivedtasks") }}</a></li>
          </ul>
          <a href="#processmenu" data-bs-toggle="collapse" class="nav-link px-0 align-middle text-light dropdown-toggle move">
            <i class="bi bi-boxes"></i> <span class="ms-1 d-none d-sm-inline ">{{ $t("message.processes") }}</span>
          </a>
          <ul class="collapse nav flex-column ms-2 show" id="processmenu">
            <li v-for="proc in processes"><a href="#" class="nav-link px-0 text-light" @click="openProc(proc)">{{ proc.name }}</a></li>
          </ul>
		</div>
	</div>`,
  data() {
    return {
      processes: []
	}
  },
  methods: {
	  openProc(proc) {
		this.$store.state='proc'+proc.bpmnProcessId;
		this.$store.process=proc;
	  },
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
  },
  created: function () {
    axios.get('/process/definition/latest', this.$store.axiosHeaders).then(response => {
		this.processes = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});

