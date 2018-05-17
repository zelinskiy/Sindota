import React, { Component } from 'react';
import Utils from '../utils';
import Question from './Question';
import strings from '../localization';

class Create extends Component {

    constructor(props){
	super(props);
	this.state = new Question("Question",
				  "Question text");
	var id = parseInt(this.props.match.params.id, 10);
	if(this.props.match.params.mode === "create"){
	    this.state.tournament = id;
	} else {
	    this.state.id = id;
	    this.loadQuestion();
	}
	
    }

    loadQuestion = () => {
	Utils.get({route: "/private/question/get/" + this.state.id
		   , success: (data) => {
		       this.setState(data);
		   }
		   , error: (e) => {
		       this.setState({_error: e.responseText});
		   }
		  });
    }
    
    handleCreate = (_) => {
	Utils.post({route: "/private/question/new"
		    , data: this.state
		    , success: (_) => {
			window.location.href = '/tournament/details/' + this.state.tournament;
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    handleEdit = (_) => {
	Utils.post({route: "/private/question/update/" + this.state.id
		    , data: this.state
		    , success: (_) => {
			window.location.href = '/questions';
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }
    

    render() {
	return (<div className="row">
		<div className="col-md-1"></div>
		<div className="col-md-4">
		<br/>
		<h4>{strings.Question}</h4>		
		{strings.Title}:
		<input
		type="text"
		className="form-control"
		value={this.state.title}
		onChange={e=>this.setState({title:e.target.value})}/>
		<br/>		
		{strings.Text}:<br/>
		<textarea rows="5" cols="30"
		className="form-control"
		value={this.state.text}
		onChange={e=>this.setState({text:e.target.value})}>
		</textarea>
		<br/>	

		{this.props.match.params.mode === "create"?
		 <input type="button"
		 className="btn"
		 onClick={this.handleCreate}
		 value={strings.Create} />
		 :<input type="button"
		 className="btn"
		 onClick={this.handleEdit}
		 value={strings.Edit} />}
		
		<p style={{color: "red"}}>{this.state._error}</p>
		</div></div>
	       );
    }
}

export default Create;

