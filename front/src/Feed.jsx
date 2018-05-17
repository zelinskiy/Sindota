import React, { Component } from 'react';
import Utils from './utils';
import strings from './localization';

class Feed extends Component {

    state = { questions: [], announces: [] }

    constructor(props){
	super(props);
        this.loadAnnounces(x=>x);
    }

    loadAnnounces = cb => {
	Utils.get({route: "/private/announce/all"
		   , success: data => {
		       console.log("Loaded announces");		       
		       this.setState({announces: data});
		       cb();
		   }
		   , error: e => {
		       console.error(e);
		   }
		  });	
    }

    deleteAnnounce = aid => {
	Utils.del({route: "/private/announce/delete/" + aid
		   , success: data => {
		       console.log("Deleted announce");
		       this.setState({announces: this.state.announces
				      .filter(a => a.id !== aid)});
		   }
		   , error: e => {
		       console.error(e);
		   }
		  });
    }

    renderAnnounce = a => <div className="well" >
	<h6>
	<a href={"/announce/edit/" + a.id}>
	{a.title}
    </a>
	&nbsp;
	<button
    className="btn btn-outline-danger"
    onClick={e => this.deleteAnnounce(a.id)}>
	x</button>
	</h6>
	<p>{strings.At}: {Utils.formatTime(a.at)}
	<br/>
	{strings.Text}: {a.text}</p>
	</div>

    render = () => 
	<div style={{margin:"30px", height:"600px", overflow:"scroll", "overflow-x": "hidden"}}>
	<h4><a href="/feed">{strings.Feed}</a></h4>
	<hr/>
	{this.state.announces.map(this.renderAnnounce)}
	</div>
	
}

export default Feed;
