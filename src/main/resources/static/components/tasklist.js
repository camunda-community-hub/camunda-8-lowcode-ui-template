
Vue.component('mytasks',{
  template: '<div><div style="width:320px;display:inline-block;vertical-align: top"><task v-for="task in $store.tasks" :task="task"></task></div>'+
 	 '<div style="width:calc(100% - 320px);display:inline-block;vertical-align: top"><task-form></task-form></div></div>',
  data() {
    return {
      tasks: []
	}
  },
  created: function () {
    axios.get('/tasks/myOpenedTasks/'+this.$store.user.name, this.$store.axiosHeaders).then(response => {
		this.$store.tasks = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});
Vue.component('unassignedtasks',{
  template: '<div><div style="width:320px;display:inline-block;vertical-align: top"><task v-for="task in $store.tasks" :task="task"></task></div>'+
 	 '<div style="width:calc(100% - 320px);display:inline-block;vertical-align: top"><task-form></task-form></div></div>',
  data() {
    return {
      tasks: []
	}
  },
  created: function () {
    axios.get('/tasks/unassigned').then(response => {
		this.$store.tasks = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});
Vue.component('archivedtasks',{
  template: '<div><task v-for="task in $store.tasks" :task="task"></task></div>',
  data() {
    return {
      tasks: []
	}
  },
  created: function () {
    axios.get('/tasks/myArchivedTasks/'+this.$store.user.name).then(response => {
		this.$store.tasks = response.data; 
	}).catch(error => {
		alert(error.message); 
	})
  }
});
Vue.component('task',{
  template: '<div v-if="(!task.assignee && $store.state==\'unassignedtasks\') || (task.assignee && $store.state!=\'unassignedtasks\')" :class="classname" style="width: 18rem;">'+
  	'<div class="card-body">'+
    	'<h5 class="card-title">{{ task.name }}</h5><h6 class="card-subtitle mb-2 text-muted">{{ task.processName }}</h6>'+
    	'<p class="card-text">{{ task.creationTime.slice(0, 19).replace("T"," ") }}</p>'+
    	'<a v-if="task.taskState!=\'COMPLETED\'" @click="openTask()" class="card-link">{{ $t("message.open") }}</a>'+
    '</div></div>',
  props:["task"],
  methods: {
	openTask() {
		this.$store.task=this.task;
	}
  },
  computed: {
    classname() {
	  if (this.$store.task==this.task) {
		console.log(this.$store.task);
        return "card current";
      }
      return "card";
	}
  }
});