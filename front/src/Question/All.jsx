import React, { Component } from 'react';
import Utils from '../utils';
import strings from '../localization';

class All extends Component {

    constructor(props){
	super(props);
	this.state = { pending: [], asked:[], _errror: "" };
	this.loadPending();
	this.loadAsked();
    }

    loadAsked = () => {
	Utils.get({route: "/private/question/asked/"
		    , success: (data) => {
			this.setState({asked: data});
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    loadPending = () => {
	Utils.get({route: "/private/question/pending/"
		    , success: (data) => {
			this.setState({pending: data});
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    handleDelete = qid => {
	Utils.del({route: "/private/question/delete/" + qid
		    , success: (data) => {
			this.setState({asked: this.state.asked.filter(q => q.id !== qid)});
			this.setState({pending: this.state.pending.filter(q => q.id !== qid)});
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		  });
    }


    handleAnswerChange = q => e => {
	this.setState({pending: this.state.pending.map(p => {
	    if(p.id === q.id)
		p.answer = e.target.value;
	    return p;
	})});
	this.setState({asked: this.state.asked.map(a => {
	    if(a.id === q.id)
		a.answer = e.target.value;
	    return a;
	})});
    }
    
    handleAnswer = q => e => {
	if (e.keyCode !== 13) {	    
	    return;
	}
	Utils.post({route: "/private/question/respond/" + q.id + "/" + q.answer
		    , success: (data) => {
			this.setState({pending: this.state.pending.filter(p => p.id !== q.id)});
		    }
		    , error: (e) => {
			this.setState({_error: e.responseText});
		    }
		   });
    }

    renderPending = q => {
	return (<div>
		{this.renderAsked(q)}
		<input
		type="text"
		className="form-control"
		value={this.state.pending.find(p => p.id === q.id).answer}
		onChange={this.handleAnswerChange(q)}
		onKeyDown={this.handleAnswer(q)}/>
		<hr/>
		</div>);
    }

    

    renderAsked = q => <div><p>
	<b>{q.title}</b>
	&nbsp;<button className="btn btn-outline-danger" onClick={e => this.handleDelete(q.id)}>x</button>
	&nbsp;<button className="btn btn-outline-primary" onClick={e => window.location.href="/tournament/detail/"+q.tournament}>{strings.Tournament}</button>
	<br/>
	{q.text}<span><br/>{q.answer?q.answer:strings.NotAnsweredYet}</span>
    </p>
    </div>

render() {
    return (<div style={{margin:"30px"}}>
	    <h4><a href="/wuestions">{strings.Questions}</a></h4>
	    <p>{this.state._error}</p>
	    <div className="row">
	    	    
	    <div className="col-md-6">
	    
	    <h4>{strings.Pending} ({this.state.pending.length}):</h4>
	    {this.state.pending.map(this.renderPending)}
	    </div>
	    
	    <div className="col-md-6">
	    <h4>{strings.Asked} ({this.state.asked.length}):</h4>
	    {this.state.asked.map(this.renderAsked)}	    
	    </div>
	    
	    </div>
	    </div>
	   );
}
}

export default All;

