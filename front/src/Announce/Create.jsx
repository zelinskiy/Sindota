import React, { Component } from 'react';
import Utils from '../utils';
import Announce from './Announce';
import strings from '../localization';

class Create extends Component {

    constructor(props){
	super(props);
	this.state = new Announce("Announce",
				  "Dear all! This is an announcement.");
	if(this.props.match.params.mode === "create"){
	    this.state.tournament =
		parseInt(this.props.match.params.id, 10);
	} else {
	    this.loadTournament(parseInt(this.props.match.params.id, 10));
	}
	
    }

    loadTournament = (id) => {
	Utils.get({route: "/private/announce/get/" + id
		   , success: (data) => {
		       this.setState(data);
		   }
		   , error: (e) => {
		       this.setState({_error: e.responseText});
		   }
		  });
    }
    
    handleCreate = (_) => {
	Utils.post({route: "/private/announce/new"
		    , data: this.state
		    , success: (_) => {
			window.location.href = '/';
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    handleEdit = (_) => {
	Utils.post({route: "/private/announce/update/" + this.state.id
		    , data: this.state
		    , success: (_) => {
			window.location.href = '/feed';
		    }
		    , error: (e) => {
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
		Text:
		<input type="text"
		       value={this.state.text}
		       onChange={e=>this.setState({text:e.target.value})} />
		<br/>

		{this.props.match.params.mode === "create"?
		    <input type="button"
			       className="btn"
			       onClick={this.handleCreate}
			       value="Create" />
			:<input type="button"
				    className="btn"
				    onClick={this.handleEdit}
				value="Edit" />}
				
		<p style={{color: "red"}}>{this.state._error}</p>
	    </div>
	);
    }
}

export default Create;

