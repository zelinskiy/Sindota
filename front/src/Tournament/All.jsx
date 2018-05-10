import React, { Component } from 'react';
import Utils from '../utils';

class All extends Component {
    state = { tournaments: [] };

    constructor(props){
	super(props);
	this.loadTournaments();
    }
    
    loadTournaments = (_) => {
	Utils.get({route: this.props.url
		   , success: (data) => {
		       console.log("Loaded tournaments");
		       this.setState({tournaments: data.map(t => {
			   var _t = Object.assign({}, t.tournament);
			   _t.game = Object.assign({}, t.game);
			   _t.author = Object.assign({}, t.author);
			   t = _t;
			   return t;
		       })});
		   }
		   , error: (e) => {
		       console.error(e);
		   }
		  });
    }

    renderTournament = t => {
	return(<div key={t.id}>
	       <h4>{t.title}</h4>
	       <p>At: {t.at}</p>
	       <p>Author: {t.author.email}</p>
	       <p>Game:
	         <abbr title={t.game.description}>{t.game.name}</abbr></p>
	       <p>Status: {t.status}</p>
	       <p>Reward: {t.reward}</p>
	       <p>{t.description}</p>
	       </div>);
    }
	
    
    render() {
	return (
	    <div>
              {this.state.tournaments.map(this.renderTournament)}
	      <p style={{color: "red"}}>{this.state.error}</p>
	    </div>
	);
    }
}

export default All;
