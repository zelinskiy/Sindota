import React, { Component } from 'react';
import All from './Tournament/All.jsx';
import Feed from './Feed.jsx';
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
	    <div>
	      <h2>{strings.Dashboard}</h2>
	      <p>{this.state.selected?
		    <a href={"/tournament/details/"+this.state.selected.id}>{strings.SelectedTournament} "{this.state.selected.title}" ({new Date(this.state.selected.at).toLocaleString("ru")})</a>
			:<span>{strings.NotSelectedTournament}</span>}
	      </p>

	      <table>
		<tr>
		  <td style={{width:"60%", 'vertical-align':"top"}}><All/></td>
		  <td><Feed/></td>
		</tr>
	      </table>
	      
	      
	    </div>);
    }
}

export default Dashboard;
