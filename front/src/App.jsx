import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import AuthForm from './AuthForm.jsx';
import {getStore, saveStore} from './Store.js';

class App extends Component {
    constructor(props) {
	super(props);
	var s = getStore();
	s.logged = false;
	saveStore(s);
    }
    render() {
      return (
	  <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h1 className="App-title">Welcome to React</h1>
            </header>
        
	    <AuthForm/>
	    <p>{getStore().logged?"Logged":"Not logged"}</p>
	  </div>      
      );
  }
}

export default App;
