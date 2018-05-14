import React, { Component } from 'react';
import Utils from './utils';
import strings from './localization';

class Feed extends Component {

    state = { questions: [], announces: [] }

    constructor(props){
	super(props);
        this.loadAnnounces(x=>x);
    }

    loadAnnounces = (cb) => {
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

    renderAnnounce = a => <div style={{border:"1px dotted grey"}}>
	<h6><a href={"/announce/edit/" + a.id}>{a.title}</a></h6>
	<p>{strings.At}: {Utils.formatTime(a.at)}
	<br/>
	{strings.Text}: {a.text}</p>
	</div>

    render = () => 
	<div style={{margin:"30px", height:"600px", overflow:"scroll", "overflow-x": "hidden"}}>
	<h4>{strings.Feed}</h4>
	<hr/>
	{this.state.announces.map(this.renderAnnounce)}
	</div>
	
}

export default Feed;
