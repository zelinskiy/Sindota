import React, { Component } from 'react';
import Cookies from 'js-cookie';

import Utils from '../utils';
import Tournament from './Tournament';
import strings from '../localization';

class Details extends Component{
    
    constructor(props){
	super(props);
	this.state = new Tournament();
	this.state.games = {};
	this.loadGames();
	this.loadTournament();
	this.loadMembers();
	this.checkRegistered();
	this.checkSelected();
    }
    
    loadTournament = () => {
	Utils.post({route: "/private/tournament/get/"+this.props.match.params.id
		    , success: data => {
			console.log("Loaded this");
			
			if(data){
			    this.setState(data);
			}
			else{
			    console.log("Tournament not found");
			}
		    }
		    , error: e => {
			console.log(this.state.id);
			console.log(e);
		    }
		   });	
    }

    loadMembers = () => {
	Utils.get({route: "/private/tournament/members/"+this.props.match.params.id
		    , success: data => {
			console.log("Loaded members");		
			if(data){
			    this.setState({members: data});
			}
			else{
			    console.log("Members not loaded");
			}
		    }
		    , error: e => {
			console.log(this.state.id);
			console.log(e);
		    }
		   });
    }

    checkRegistered = () => {
	Utils.post({route: "/private/tournament/registered/"+this.props.match.params.id
		    , success: r => {
			console.log("Registered: " + r);
			
			this.setState({registered: r});
		    }
		    , error: e => {
			console.log(e);
		    }
		   });	
    }

    checkSelected = () => {
	Utils.get({route: "/private/tournament/my/selected/"
		    , success: r => {
			var selected = r && (r.id === this.state.id);
			console.log(r);
			console.log("Selected: " + selected);
			this.setState({selected: selected});
		    }
		    , error: e => {
			console.log(e);
		    }
		   });	
    }

    loadGames = () => {
	Utils.get({route: "/private/game/all"
		   , success: data => {
		       console.log("Loaded games");		       
		       this.setState({games: Utils.listToDict(data, g => g.id, g => g.name)});
		   }
		   , error: e => {
		       console.error(e);
		   }
		  });
	
    }

    delete = () => {
	Utils.del({route: "/private/tournament/delete/" + this.state.id
		   , success: data => {
		       window.location.href="/";
		   }
		   , error: e => {
		       console.error(e);
		   }
		  });
    }

    promote = () => {
	var key = prompt("Enter secret key:");
	if(key === undefined || key === ""){
	    alert("Key is empty");
	}
	else {
	    Utils.post({route: "/private/tournament/promote/" + this.state.id + "/" + key
			, success: data => {
			    alert("Promoted!");
			    window.location.reload();
			}
			, error: e => {
			    console.error(e);
			}
		       });
	}
    }

    

    register = () => {
	Utils.post({route: "/private/tournament/register/" + this.state.id
		    , success: data => {
			this.state.members.push(Utils.myEmail());
			this.setState({registered: true});
		   }
		   , error: e => {
		       console.error(e);
		   }
		   });
    }

    unregister = () => {
	Utils.post({route: "/private/tournament/unregister/" + this.state.id
		    , success: data => {
			var me = Utils.myEmail();
			this.setState({registered: false,
				       members: this.state.members
				         .filter(m => m !== me)});
		    }
		    , error: e => {
			console.error(e);
		    }
		   });
    }

    select = () => {
	Utils.post({route: "/private/tournament/select/" + this.state.id
		    , success: data => {			
			this.setState({selected: true});
		    }
		    , error: e => {
			console.error(e);
		    }
		   });
    }

    unselect = () => {
	Utils.post({route: "/private/tournament/unselect"
		    , success: data => {
			this.setState({selected: false});
		    }
		    , error: e => {
			console.error(e);
		    }
		   });
    }

    saveMembers = () => {
	var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state));
	var dlAnchorElem = document.getElementById('downloadAnchorElem');
	dlAnchorElem.setAttribute("href",     dataStr     );
	dlAnchorElem.setAttribute("download", this.state.title + ".json");
	dlAnchorElem.click();
    }

    

    render() {
	return (
	    <div>
              <h4>{this.state.title}</h4>
	      <p>
		&nbsp;<button
			className="btn btn-outline-primary"
			onClick={() => window.location.href="/tournament/edit/"+this.state.id}>
		  {strings.Edit}
		</button>
		&nbsp;<button
			className="btn btn-outline-danger"
			onClick={this.delete}>
		  {strings.Delete}
		</button>
		{this.state.status === "Default" ?
		    <span>
			  &nbsp;<button
				      className="btn btn-outline-warning"
				      onClick={this.promote}>
			    {strings.Promote}
			      </button>
			</span>:<span>
			  &nbsp;<button
				      disabled
				      className="btn btn-outline-secondary"
				      onClick={this.promote}>
			    {strings.Promote}
			      </button>
		    </span>}
		    {this.state.registered ?
			<span>
			      &nbsp;<button
					  className="btn btn-outline-danger"
					  onClick={this.unregister}>
				{strings.Unregister}
				  </button>
			    </span>
			    :<span>
			      &nbsp;<button
					  className="btn btn-outline-success"
					  onClick={this.register}>
				{strings.Register}
				  </button>
			</span>}
			{this.state.selected === true ?
			    <span>
				  &nbsp;<button
					      className="btn btn-outline-danger"
					      onClick={this.unselect}>
				    {strings.Unselect}
				      </button>
				</span>
				:<span>
				  &nbsp;<button
					      className="btn btn-outline-success"
					      onClick={this.select}>
				    {strings.Select}
				      </button>
			    </span>}
			    {this.state.author === JSON.parse(Cookies.get("me")).email && <span>&nbsp;<button
													    onClick={() => window.location.href="/announce/create/"+this.state.id}
				    className="btn btn-outline-primary">
				    {strings.Announce}
			    </button></span>}
			    &nbsp;<button
				    onClick={() => window.location.href="/question/create/"+this.state.id}
			      className="btn btn-outline-primary">
			      {strings.Question}
			    </button>
			    &nbsp;<button
				    className="btn btn-outline-primary"
				    onClick={this.saveMembers}>
			      {strings.Save}
			    </button>
			    <a
			      id="downloadAnchorElem"
			      style={{display:"none"}}>
			      +
			    </a>
	      </p>

	      
	      <p>{strings.Status}:
		{this.state.status}</p>
	      <p>{strings.Author}:
		<a href={"mailto:" + this.state.author}>{this.state.author}</a></p>
	      <p>{strings.At}:
		{(new Date(this.state.at)).toLocaleString(Cookies.get("lang"))}</p>
	      <p>{strings.Game}:
		{this.state.games[this.state.game]}</p>
	      <p>{strings.Reward}:
		{this.state.reward}</p>
	      <p>{this.state.description}</p>
	      <br/>
	      <h5>{strings.RegisteredUsers} ({this.state.members?this.state.members.length:0}):</h5>
	      {this.state.members?this.state.members.map(m => <p>{m}</p>):<p>{strings.NoRegisteredUsers}</p>}
	      
	      <p style={{color: "red"}}>{this.state._error}</p>
	    </div>
	);
    }
}

export default Details;
