import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Utils from './utils';
import strings from './localization';

class AuthForm extends Component {
    state = {login: 'user@mail.com', pass: 'password1', error: ""};

    constructor(props){
	super(props);
	this.checkToken();
    }
    
    handleChangeLogin = (e) => {
	this.setState({login: e.target.value});
    }
    handleChangePass = (e) => {
	this.setState({pass: e.target.value});
    }

    checkToken = () => {
	Utils.get({route: "/private/user/me"
		   , success: async (me) => {
		       Cookies.set("me", me);
		   }
		   , error: (e) => {		       
		       Cookies.remove("jwt");
		   }
		  });
    }
    
    handleLogin = (_) => {
	Utils.post({route: "/public/jwt/login"
		    , data: { email: this.state.login
			      , pass: this.state.pass}
		    , success: async (data) => {
			Cookies.set("jwt", data);
			console.log("Logged with jwt " + Cookies.get("jwt"));
			this.setState({error: "Logged succesfully!"});
			
			Utils.get({route: "/private/user/me"
				   , success: async (data) => {
				       Cookies.set("me", data);
				       //await Utils.sleep(750);
				       //window.location.href = './';
				   }
				   , error: (e) => {
				       this.setState({error: e.responseText});
				   }
				  });
			
			
		    }
		    , error: (e) => {
			this.setState({error: e.responseText});
		    }
		   });
    }

    handleRegister = (_) => {
	Utils.post({route: "/public/user/register"
		    , data: { email: this.state.login,
			      pass: this.state.pass}
		    , success: this.handleLogin
		    , error: (e) => {
			this.setState({error: e.responseText});
		    }
		   });
    }

    handleUnregister = (_) => {
	Utils.get({route: "/private/user/unregister"
		   , success: (r) => {
		       this.handleLogout();
		       window.location.reload();
		   }
		   , error: (e) => {
		       this.setState({error: e.responseText});
		   }
		  });
    }

    handleLogout = (_) => {
	Cookies.remove("jwt");
	window.location.href = './';
    }

    seizeTheMeans = (_) => {
	Utils.get({route: "/private/admin/seize/the/means"
	      , success: async (data) => {		  
		  this.handleLogout();
	      }
	      , error: (e) => {
		  this.setState({error: e.responseText});
	      }
	     });
    }
    
    generateKey = (_) => {
	Utils.get({route: "/private/admin/keys/generate/PromoteTournament"
		   , success: async (data) => {
		       this.setState({error: data});
		   }
		   , error: (e) => {
		       this.setState({error: e.responseText});
		   }
		  });
    }

    renderMe = () => {
	if (!Cookies.get("me")) {
	    return <p>{strings.Hello}, username!</p>;
	}
	else{
	    var me = JSON.parse(Cookies.get("me")); 
	    return (<div>
		    <p>{strings.Hello}, {me.email}!</p>
		    <p>{strings.Status}: {me.status}</p>
		    </div>);
	}
    }

    render() {
	return (<div>{Cookies.get("jwt") === undefined?
		      <div>
		      {strings.Login}:
		      <input type="text"
		      value={this.state.login}
		      onChange={this.handleChangeLogin} />
		      <br/>
		      {strings.Password}:
		      <input type="password"
		      value={this.state.pass}
		      onChange={this.handleChangePass} />
		      <br/>
		      <input type="button"
		      onClick={this.handleLogin}
		      value={strings.Login} />
		      <input type="button"
		      onClick={this.handleRegister}
		      value={strings.Register} />
		      
		      </div>:
		      <div>
		      {this.renderMe()}
		      <input type="button"
		      onClick={this.handleLogout}
		      value={strings.Logout} />
		      <input type="button"
		      onClick={this.handleUnregister}
		      value={strings.DeleteAccount} />
		      <input type="button"
		      onClick={this.seizeTheMeans}
		      value="★" />
		      <input type="button"
		      onClick={this.generateKey}
		      value="k" />
		      </div>}
		<p style={{color: "red"}}>{this.state.error}</p> 
		</div>
	       );
    }
}

export default AuthForm;
