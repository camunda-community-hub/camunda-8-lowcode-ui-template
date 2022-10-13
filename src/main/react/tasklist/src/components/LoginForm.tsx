import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import authService from '../service/AuthService';



function LoginForm() {
  const dispatch = useDispatch();

  const login = (event: any) => {
	//Prevent page reload
	event.preventDefault();
	var { username, password } = document.forms[0];
	dispatch(authService.signIn(username.value, password.value));
  };

  return (
	<main className="container-fluid mainSignin">
	  <div className="d-flex justify-content-center">
		<form className="signin bg-dark text-light" onSubmit={login}>
		  <h1 className="signin__title">Se connecter</h1>
		  <label htmlFor="inputUsername" className="form-label">Username</label>
		  <div className="input-group mb-3">
			<span className="input-group-text">@</span>
			<input type="text" className="form-control" name="username" placeholder="username"/>
		  </div>
		  <label htmlFor="password" className="form-label">Password</label>
		  <div className="input-group mb-3">
			<span className="input-group-text"><i className="bi bi-lock"></i></span>
			<input type="password" className="form-control" name="password" placeholder="password"/>
		  </div>
		  <div className="signin__actions">
			<button type="submit" className="btn btn-primary btn-block mb-4"><i className="bi bi-send"></i> Sign in</button>
		  </div>
		</form>
	  </div>
	</main>
  );
}

export default LoginForm;
