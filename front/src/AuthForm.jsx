import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Utils from './utils';


class AuthForm extends Component {
    state = {login: 'user@mail.com', pass: 'password1', error: ""};
    
    handleChangeLogin = (e) => {
	this.setState({login: e.target.value});
    }
    handleChangePass = (e) => {
	this.setState({pass: e.target.value});
    }

    handleLogin = (_) => {
	Utils.post({route: "/public/jwt/login"
	      , data: { email: this.state.login
			, pass: this.state.pass}
	      , success: async (data) => {
		  Cookies.set("jwt", data);
		  console.log("Logged with jwt " + Cookies.get("jwt"));
		  this.setState({error: "Logged succesfully!"});
		  await Utils.sleep(750);
		  window.location.href = './';
	      }
	      , error: (e) => {
		  this.setState({error: e.responseText});
	      }
	     });
    }

    handleRegister = (_) => {
	Utils.post({route: "/public/user/register"
	      , data: { email: this.state.login
			, pass: this.state.pass}
	      , success: this.handleLogin
	      , error: (e) => {
		  this.setState({error: e.responseText});
	      }
	     });
    }

    handleLogout = (_) => {
	Cookies.remove("jwt");
	window.location.href = './';
    }

    render() {
	return (
	    <div>
              Login:
              <input type="text"
		     value={this.state.login}
		     onChange={this.handleChangeLogin} />
	      <br/>
	      Password:
	      <input type="password"
		     value={this.state.pass}
		     onChange={this.handleChangePass} />
	      <br/>
	      {Cookies.get("jwt")?<p>logged</p>:<p>not logged</p>}
	      <input type="button"
		     onClick={this.handleLogin}
		     value="Login" />
	      <input type="button"
		     onClick={this.handleRegister}
		     value="Register" />
	      <input type="button"
		     onClick={this.handleLogout}
		     value="Logout" />
	      <p style={{color: "red"}}>{this.state.error}</p>
	    </div>
	);
    }
}

export default AuthForm;
