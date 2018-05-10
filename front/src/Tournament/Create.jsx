import React, { Component } from 'react';

import Utils from '../utils';
import Tournament from './Tournament';
//import Game from '../Game/Game';

class Create extends Component {

    constructor(props){
	super(props);
	this.state = new Tournament();
	this.state.title = "Tournament " + Math.floor(Math.random()*100000);
	this.state.reward = 1000*Math.floor(Math.random()*100);
	this.state._games = [];
	this.state._error = "";

	this.loadGames();
	
    }
    
    handleCreate = (_) => {
	var data = Object.assign({}, this.state);
	data.at += "Z";
	data.game = parseInt(data.game, 10);
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
		       this.setState({game: data[0].id});
		   }
		   , error: e => {
		       this.setState({_error: e.responseText});
		   }
		  });
	
    }	

    render() {
	return (
	    <div>
              Title:
              <input type="text"
		     value={this.state.title}
		     onChange={e=>this.setState({title:e.target.value})}/>
		<br/>
		
		At:
		<input type="datetime-local"
		       value={this.state.at}
		       onChange={e=>this.setState({at:e.target.value})} />
		  <br/>
		  
		  Game:
		  <select value={this.state.game} onChange={e=>this.setState({game:e.target.value})}>
		    {this.state._games.map(g => <option value={g.id} key={g.id}>{g.name}</option>)}
	    </select>
		&nbsp;<a href="/game/new">new</a>
		<br/>
		
	    Reward:
		<input type="number"
	    value={this.state.reward}
	    min="0"
	    onChange={e=>this.setState({reward:e.target.value})} />
		<br/>
		
	    Description: <br/>
		<textarea rows="5" cols="30"
	    value={this.state.description}
	    onChange={e=>this.setState({description:e.target.value})}>
		</textarea>
		<br/>
		
		<input type="button"
	    onClick={this.handleCreate}
	    value="Create" />
		
		<p style={{color: "red"}}>{this.state._error}</p>
		</div>
	);
    }
}

export default Create;
