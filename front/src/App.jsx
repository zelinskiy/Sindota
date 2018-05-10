import React, { Component } from 'react';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';

import './App.css';

import AuthForm from './AuthForm.jsx';
import Dashboard from './Dashboard.jsx';
import CreateTournament from './Tournament/Create.jsx';
import CreateGame from './Game/Create.jsx';

class App extends Component {
    constructor(props) {
	super(props);
	this.state = {};
	Cookies.set("server", "https://localhost:8080");
    }
    render() {
	return (
	    <div>
	      <Header/>
	      <Main/>
	    </div>
	  
      );
  }
}

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" render={() => (
	    Cookies.get("jwt") ?
	      (<Redirect to="/dashboard"/>)
	      :(<Redirect to="/auth"/>)
      )}/>
	<Route path='/auth' component={AuthForm}/>
	<Route path='/dashboard' component={Dashboard}/>
	<Route path='/tournament/create' component={CreateTournament}/>
	<Route path='/game/new' component={CreateGame}/>
    </Switch>
  </main>
);

const Header = () => (
    <header>
      <nav>
          <Link to='/'>Home</Link> &nbsp;
          <Link to='/auth'>Auth</Link>
      </nav>
    </header>
);

export default App;
