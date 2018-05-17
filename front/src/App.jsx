import React, { Component } from 'react';
import {Switch, Route, Link, Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';

import strings from './localization';
import AuthForm from './AuthForm.jsx';
import Dashboard from './Dashboard.jsx';
import CreateTournament from './Tournament/Create.jsx';
import AllTournaments from './Tournament/All.jsx';
import DetailsTournament from './Tournament/Details.jsx';
import CreateGame from './Game/Create.jsx';
import CreateAnnounce from './Announce/Create.jsx';
import AllQuestions from './Question/All.jsx';
import CreateQuestion from './Question/Create.jsx';
import Feed from './Feed.jsx';

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
	<PrivateRoute path='/announce/:mode(create|edit)/:id' component={CreateAnnounce}/>
	<PrivateRoute path='/questions' component={AllQuestions}/>
	<PrivateRoute path='/question/:mode(create|edit)/:id' component={CreateQuestion}/>
	<PrivateRoute path='/feed' component={Feed}/>
	
    </Switch>
  </main>
);

const Header = () => (
    <header style={{margin:"10px"}}>
      <nav>
        <Link to='/'>{strings.Home}</Link> &nbsp;&nbsp;&nbsp;
	<Link to='/tournament/all'>{strings.Tournaments}</Link> &nbsp;&nbsp;&nbsp;
	<Link to='/questions'>{strings.Questions}</Link> &nbsp;&nbsp;&nbsp;
	<Link to='/feed'>{strings.Feed}</Link> &nbsp;&nbsp;&nbsp;
        <Link to='/auth'>{strings.Auth}</Link> &nbsp;&nbsp;&nbsp;
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
