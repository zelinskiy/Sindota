import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import All from './Tournament/All.jsx';

class Dashboard extends Component{
        
    render() {
	var newLink = <Link to="/tournament/create">new</Link>;
	return (
	    <div>
	      <h2>Dashboard</h2>
	      <h3>Tournaments ({newLink}):</h3>
	      <All url="/private/tournament/all"/>
	    </div>);
    }
}

export default Dashboard;
