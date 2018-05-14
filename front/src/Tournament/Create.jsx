import React, { Component } from 'react';

import Utils from '../utils';
import Tournament from './Tournament';
import strings from '../localization';

class Create extends Component {

    state = {}
    
    constructor(props){
	super(props);
	this.state = new Tournament();
	this.state._games = [];	
	if(this.props.match.params.id){
	    console.log(this.props.match.params.id);
	    this.state.id = this.props.match.params.id;
	    this.loadTournament();
	}
	else {
	    this.state.title = "Tournament " + Math.floor(Math.random()*100000);
	    this.state.reward = 1000*Math.floor(Math.random()*100);    
	}
	this.loadGames();
	this.state._error = "";	
    }
    
    handleCreate = (_) => {
	var data = Object.assign({}, this.state);
	data.at += "Z";
	data.game = parseInt(data.game, 10);
	data.reward = parseInt(data.reward, 10);
	console.log(data);
	Utils.post({route: "/private/tournament/new"
		    , data: data
		    , success: (_) => {
			window.location.href = '/';
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    loadGames = () => {
	Utils.get({route: "/private/game/all"
		   , success: data => {
		       console.log("Loaded games");
		       this.setState({_games: data});
		       if(data.length === 0){
			   this.setState({game: -1});
		       }
		       else{
			   this.setState({game: data[0].id});
		       }
		   }
		   , error: e => {
		       this.setState({_error: e.responseText});
		   }
		  });	
    }

    loadTournament = () => {
	Utils.post({route: "/private/tournament/get/"+this.state.id
		   , success: data => {
		       console.log("Loaded this");
		       
		       if(data){
			   data.at = data.at.substring(0, data.at.length-1);
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

    handleEdit = (_) => {
	var data = Object.assign({}, this.state);
	data.at += "Z";
	data.game = parseInt(data.game, 10);
	data.reward = parseInt(data.reward, 10);
	console.log(data);
	Utils.post({route: "/private/tournament/update/" + this.state.id
		    , data: data
		    , success: (_) => {
			window.location.href = '/';
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    render() {
	return (
	    <div>
              {strings.Title}:
              <input type="text"
		     value={this.state.title}
		     onChange={e=>this.setState({title:e.target.value})}/>
		<br/>
		
		{strings.At}:
		<input type="datetime-local"
		       value={this.state.at}
		       onChange={e=>this.setState({at:e.target.value})} />
		  <br/>
		  
		  {strings.Game}:
		  <select value={this.state.game} onChange={e=>this.setState({game:e.target.value})}>
		    {this.state._games.map(g => <option value={g.id} key={g.id}>{g.name}</option>)}
	    </select>
		&nbsp;<a href="/game/new">{strings.New}</a>
		<br/>
		
	    {strings.Reward}:
		<input type="number"
	    value={this.state.reward}
	    min="0"
	    onChange={e=>this.setState({reward:e.target.value})} />
		<br/>
		
	    {strings.Description}: <br/>
		<textarea rows="5" cols="30"
	    value={this.state.description}
	    onChange={e=>this.setState({description:e.target.value})}>
		</textarea>
		<br/>
		
	    {this.props.match.params.id?
	     <input type="button"
	    className="btn"
	    onClick={this.handleEdit}
	     value={strings.Edit} />
	     :<input type="button"
	    className="btn"
	    onClick={this.handleCreate}
	     value={strings.Create} />}

	    
		
		<p style={{color: "red"}}>{this.state._error}</p>
		</div>
	);
    }
}

export default Create;
