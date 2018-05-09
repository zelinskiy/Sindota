import React, { Component } from 'react';
import './App.css';

import AuthForm from './AuthForm.jsx';

class App extends Component {
    constructor(props) {
	super(props);
	this.state = {};
    }
    render() {
      return (
	  <div className="App">
            <header className="App-header">              
              <h1 className="App-title">Welcome to Sindota</h1>
            </header>        
	    <AuthForm/>
	  </div>      
      );
  }
}

export default App;
