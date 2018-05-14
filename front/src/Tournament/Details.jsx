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
			var selected = r && (r.id == this.state.id);
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
			this.setState({registered: false});
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

    render() {
	return (
	    <div>
              <h4>{this.state.title}</h4>
	      <p>
		&nbsp;<button onClick={() => window.location.href="/tournament/edit/"+this.state.id}>{strings.Edit}</button>
		&nbsp;<button onClick={this.delete}>{strings.Delete}</button>
		{this.state.status === "Default" ?
		    <span>
			  &nbsp;<button onClick={this.promote}>{strings.Promote}</button>
			</span>:<span>
			  &nbsp;<button disabled onClick={this.promote}>{strings.Promote}</button>
		    </span>}
		    {this.state.registered ?
			<span>
			      &nbsp;<button onClick={this.unregister}>{strings.Unregister}</button>
			    </span>
			    :<span>
			      &nbsp;<button onClick={this.register}>{strings.Register}</button>
			</span>}
			{this.state.selected === true ?
			<span>
			      &nbsp;<button onClick={this.unselect}>{strings.Unselect}</button>
			    </span>
			    :<span>
			      &nbsp;<button onClick={this.select}>{strings.Select}</button>
			</span>}
			{this.state.author === JSON.parse(Cookies.get("me")).email && <span>&nbsp;<button onClick={() => window.location.href="/announce/create/"+this.state.id}>{strings.Announce}</button></span>}

	      </p>
	      <p>{strings.Status}: {this.state.status}</p>
	      <p>{strings.Author}: <a href={"mailto:" + this.state.author}>{this.state.author}</a></p>
	      <p>{strings.At}: {this.state.at}</p>
	      <p>{strings.Game}: {this.state.games[this.state.game]}</p>
	      <p>{strings.Reward}: {this.state.reward}</p>
	      <p>{this.state.description}</p>
	      
	      <p style={{color: "red"}}>{this.state._error}</p>
	    </div>
	);
    }
}

export default Details;
