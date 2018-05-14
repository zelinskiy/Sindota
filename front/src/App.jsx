import React, { Component } from 'react';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import {setLanguage, getLanguage} from 'react-localization';

import './App.css';

import strings from './localization';
import AuthForm from './AuthForm.jsx';
import Dashboard from './Dashboard.jsx';
import CreateTournament from './Tournament/Create.jsx';
import AllTournaments from './Tournament/All.jsx';
import DetailsTournament from './Tournament/Details.jsx';
import CreateGame from './Game/Create.jsx';

class App extends Component {
    constructor(props) {
	super(props);
	this.state = {};
	Cookies.set("server", "https://localhost:8080");
	if(!Cookies.get("lang")){
	    Cookies.set("lang", "uk");
	}	
	strings.setLanguage(Cookies.get("lang"));
    }

    componentDidMount(){
	document.getElementById("langSelect").value = strings.getLanguage();
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
      <Route exact path="/" render={()=><Redirect to="/dashboard"/>}/>
	<Route path='/auth' component={AuthForm}/>
	<PrivateRoute path='/dashboard' component={Dashboard}/>
	<PrivateRoute path='/tournament/all' component={AllTournaments}/>
	<PrivateRoute path='/tournament/create' component={CreateTournament}/>
	<PrivateRoute path='/tournament/edit/:id' component={CreateTournament}/>
	<PrivateRoute path='/tournament/details/:id' component={DetailsTournament}/>
	<PrivateRoute path='/game/new' component={CreateGame}/>
	
    </Switch>
  </main>
);

const Header = () => (
    <header>
      <nav>
        <Link to='/'>{strings.Home}</Link> &nbsp;
	<Link to='/tournament/all'>{strings.Tournaments}</Link> &nbsp;	
	<Link to='/games/all'>{strings.Games}</Link> &nbsp;
	<Link to='/question/all'>{strings.Feed}</Link> &nbsp;
        <Link to='/auth'>{strings.Auth}</Link> &nbsp;
	<select id="langSelect"
		onClick={(e)=>{
		    Cookies.set("lang", e.target.value);
	            window.location.reload();}}>
	  <option value="en">en</option>
	  <option value="uk">uk</option>
	  <option value="ru">ru</option>
	</select>
      </nav>
      
    </header>
);


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
	  Cookies.get('jwt')
	    ? <Component {...props} />
	    : <Redirect to='/auth' />
    )} />
);

export default App;
