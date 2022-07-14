Vue.component('login',{
  template: '<div><login-header/><login-form/></div>',
});


Vue.component('login-header',{ template: '<nav class="navbar navbar-light">'+
		'<div class="container-fluid d-flex justify-content-between">'+
			'<span></span><img width="150" src="/assets/img/logo.svg" class="custom-logo" alt="Camunda"><span></span>'+
		'</div>'+
	'</nav>'
 });
 
 Vue.component('login-form',{ template: '<main class="container-fluid mainSignin">'+
    '<div class="d-flex justify-content-center">'+
        '<form class="signin ">'+
            '<h1 class="signin__title">Se connecter</h1>'+
			'<label for="inputUsername" class="form-label">Username</label>'+
			'<div class="input-group mb-3">'+
			  '<span class="input-group-text">@</span>'+
			  '<input type="email" class="form-control" id="inputUsername" placeholder="username" v-model="login">'+
			'</div>'+
			'<label for="password" class="form-label">Password</label>'+
			'<div class="input-group mb-3">'+
			  '<span class="input-group-text"><i class="bi bi-lock"></i></span>'+
			  '<input type="password" class="form-control" id="password" placeholder="password" v-model="password">'+
			'</div>'+
            '<div class="signin__actions">'+
                '<button type="button" class="btn btn-primary btn-block mb-4" v-on:click="authenticate()"><i class="bi bi-send"></i> Sign in</button>'+
            '</div>'+
        '</form>'+
'</div></main>',
  data: function() {
	return {"login":null, "password":null}
  },
  methods: {
	authenticate() {
	    axios.post('/authentication/login', {'username':this.login, 'password':this.password}).then(response => {
			this.$store.user.name=response.data.username;
			this.$store.user.token=response.data.token;
			this.$store.axiosHeaders.headers = {};//{'Authorization': response.data.token}
			this.$store.auth=true;
			localStorage.setItem('camundaUser', JSON.stringify(this.$store.user));
		}).catch(error => {
			alert(error.message); 
		})
	}
  }
 });

