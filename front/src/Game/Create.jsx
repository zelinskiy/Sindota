import React, { Component } from 'react';
import Utils from '../utils';
import Game from './Game';

class Create extends Component {

    constructor(props){
	super(props);
	this.state = new Game("Dota", "MOBA Game");
    }
    
    handleCreate = (_) => {
	Utils.post({route: "/private/game/new"
		    , data: this.state
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
              Name:
              <input type="text"
		     value={this.state.name}
		     onChange={e=>this.setState({name:e.target.value})}/>
		<br/>		
		Description:
		<input type="text"
		       value={this.state.description}
		       onChange={e=>this.setState({description:e.target.value})} />
		<br/>
		
		<input type="button"
		       className="btn"
		       onClick={this.handleCreate}
		       value="Create" />
				
		<p style={{color: "red"}}>{this.state._error}</p>
	    </div>
	);
    }
}

export default Create;
