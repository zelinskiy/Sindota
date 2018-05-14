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

    renderAnnounce = a => <div>
	<p>{a.title}</p>
	<p>At: {a.at}</p>
	<p>Text: {a.text}</p>
	</div>

    render = () => 
	<div>
	<h4>{strings.Feed}</h4>
	{this.state.announces.map(this.renderAnnounce)}
	</div>
	
}

export default Feed;
