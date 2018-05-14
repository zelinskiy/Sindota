import React, { Component } from 'react';
import All from './Tournament/All.jsx';
import 'bootstrap';
import strings from './localization';

class Dashboard extends Component{
    
    state = {};
    
    render() {
	return (
	    <div>
	      <h2>{strings.Dashboard}</h2>
	      <All/>
	    </div>);
    }
}

export default Dashboard;
