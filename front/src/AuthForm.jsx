import React, { Component } from 'react';
import {modifyStore} from './Store.js';


class AuthForm extends Component {
  constructor(props) {
      super(props);
      this.state = {login: 'user@mail.com', pass: 'password'};
      modifyStore((s) => s.logged = true);
  }

  handleChangeLogin(event) {
    this.setState({login: event.target.value});
  }
  handleChangePass(event) {
    this.setState({pass: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
          Login:
          <input type="text"
		 value={this.state.login}
		 onChange={this.handleChangeLogin} />
	  <br/>
	  Password:
	  <input type="password"
		 value={this.state.pass}
		 onChange={this.handleChange} />
	  <br/>
          <input type="button"
		 onClick={this.handleLogin}
		 value="Login" />
	  <input type="button"
		 onClick={this.handleRegister}
		 value="Register" />
      </form>
    );
  }
}

export default AuthForm;
