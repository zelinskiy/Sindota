import React, { Component } from 'react';
import All from './Tournament/All.jsx';
import Feed from './Feed.jsx';
import Questions from './Question/All.jsx';
import 'bootstrap';
import strings from './localization';
import Utils from './utils';

class Dashboard extends Component{
    
    state = {};

    constructor(props){
	super(props);
	this.loadSelected(x => x);
    }

    loadSelected = (cb) => {
	Utils.get({route: "/private/tournament/my/selected"
		   , success: data => {
		       console.log("Loaded selected");
		       this.setState({selected: data});
		       cb();
		   }
		   , error: e => {
		       console.error(e);
		   }
		  });	
    }
    
    render() {
	return (
	    <div style={{'overflow':"hidden"}}>
	      <div style={{'margin-left':"30px", 'margin-top':"30px"}}>
		<h2><a href="/dashboard">{strings.Dashboard}</a></h2>
		<p>{this.state.selected?
		      <a href={"/tournament/details/"+this.state.selected.id}>{strings.SelectedTournament} "{this.state.selected.title}" ({new Date(this.state.selected.at).toLocaleString("ru")})</a>
		      :<span>{strings.NotSelectedTournament}</span>}
		</p>
	      </div>
	      
	      <div className="row">
		<div className="col-md-4" style={{height:"30vh"}}><Feed/></div>
		<div className="col-md-8" style={{height:"30vh"}}><Questions/></div>
	      </div>
	      <div className="row"> 
		<div className="col-md-12"
		     style={{height:"2vh"}} ></div>
	      </div>
	      <div className="row"> 
		<div
		  style={{height:"50vh"}}
		  className="col-md-12" >
		  <All />
		</div>
	      </div>
	      
	      
	      
	    </div>);
    }
}

export default Dashboard;
