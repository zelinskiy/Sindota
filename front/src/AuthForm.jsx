import React, { Component } from 'react';
import $ from 'jquery'; 
import Cookies from 'js-cookie';

function post(r){
    $.ajax({ url: r.url
	     , headers: { 
		 'Content-Type': 'application/json'
	     }
	     , type: "POST"
	     , dataType: "json"
	     , data: JSON.stringify(r.data)
	     , success: r.success
	     , error: r.error
	   });
}

class AuthForm extends Component {
    state = {login: 'user@mail.com', pass: 'password1', error: ""};
    
    constructor(props) {
	super(props);
    }

    handleChangeLogin = (e) => {
	this.setState({login: e.target.value});
    }
    handleChangePass = (e) => {
	this.setState({pass: e.target.value});
    }

    handleLogin = (_) => {
	post({url: "https://localhost:8080/public/jwt/login"
	      , data: { email: this.state.login
			, pass: this.state.pass}
	      , success: (data) => {
		  Cookies.set("jwt", data);
		  console.log("Logged with jwt " + Cookies.get("jwt"));
		  this.setState({error: ""});
	      }
	      , error: (e) => {
		  this.setState({error: e.responseText});
	      }
	     });
    }

    handleRegister = (_) => {
	post({url: "https://localhost:8080/public/user/register"
	      , data: { email: this.state.login
			, pass: this.state.pass}
	      , success: this.handleLogin
	      , error: (e) => {
		  this.setState({error: e.responseText});
	      }
	     });
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
              <input type="button"
		     onClick={this.handleLogin}
		     value="Login" />
	      <input type="button"
		     onClick={this.handleRegister}
		     value="Register" />
	      <input type="button"
		     onClick={Cookies.remove("jwt")}
		     value="✿" />
	      <p style={{color: "red"}}>{this.state.error}</p>
	    </div>
	);
    }
}

export default AuthForm;
