import React, { Component } from 'react';
import Utils from '../utils';
import Announce from './Announce';

class Create extends Component {

    constructor(props){
	super(props);
	this.state = new Announce(parseInt(this.props.match.params.id, 10),
				  "Announce",
				  "Dear all! This is an announcement.");
	
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

