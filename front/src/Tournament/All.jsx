import React, { Component } from 'react';
import Utils from '../utils';
import strings from '../localization';
import Cookies from 'js-cookie';

class All extends Component {
    state = { tournaments: [], games: {}, order:"Status"};

    constructor(props){
	super(props);
	this.loadGames(this.loadTournaments("/private/tournament/all"));	
    }
        
    loadTournaments = (url) => (_) => {
	Utils.get({route: url
		   , success: (data) => {
		       console.log("Loaded tournaments");
		       this.setState({tournaments: data});
		   }
		   , error: (e) => {
		       console.error(e);
		   }
		  });
    }

    loadGames = (cb) => {
	Utils.get({route: "/private/game/all"
		   , success: data => {
		       console.log("Loaded games");
		       
		       this.setState({games: Utils.listToDict(data, g => g.id, g => g)});
		       cb();
		   }
		   , error: e => {
		       console.error(e);
		   }
		  });
	
    }
    
    renderTournament = t => {
        var at = new Date(t.at);
	return(<tr style={{color: at<Date.now()?"red":"black"}}>
	       <th><a href={"/tournament/details/"+t.id}>{t.title}</a></th>
	       <th>{this.state.games[t.game].name}</th>
	       <th>{(new Date(t.at)).toLocaleString(Cookies.get("lang"))}</th>
	       <th>{t.status}</th>
	       <th>{t.reward}</th>
	       <th>{t.description}</th>
	       </tr>);
    }

    orders = {
	"Reward": (t1, t2) => t1.reward < t2.reward,
	"Status": (t1, t2) => t1.status < t2.status,
	"Title": (t1, t2) => t1.title < t2.title,
	"At": (t1, t2) => t1.at > t2.at,
	"Game": (t1, t2) => t1.game < t2.game
    }
    
    
    render() {
	return (
	    <div style={{margin:"30px"}}>
	      <h4>
		<a href="/tournament/all">
		  {strings.Tournaments}
		</a>
	      </h4>
	      <button
		className="btn btn-outline-success"
		onClick={()=>window.location.href="/tournament/create"}>
	  {strings.New}
</button>
&nbsp;
<button
  className="btn btn-outline-primary"
  onClick={this.loadTournaments("/private/tournament/all")}>
  {strings.All}
</button>
&nbsp;
	      <button
		className="btn btn-outline-primary"
		onClick={this.loadTournaments("/private/tournament/my/registered")}>
		{strings.Registered}
	      </button>
	      &nbsp;
	      <button
		className="btn btn-outline-primary"
		onClick={this.loadTournaments("/private/tournament/my/created")}>{strings.Created}
	      </button>
	      &nbsp;
	      <hr/>
	      <table>
		<tr>
		  <th>
		    <button
		      className="btn btn-outline-info"
		      onClick={()=>this.setState({order:"Title"})}>
		      {strings.Title}
		    </button>
		  </th>
		  <th>
		    <button
		      className="btn btn-outline-info"
		      onClick={()=>this.setState({order:"Game"})}>
		      {strings.Game}
		    </button>
		  </th>
		  <th>
		    <button
		      className="btn btn-outline-info"
		      onClick={()=>this.setState({order:"At"})}>
		      {strings.At}
		    </button>
		  </th>
		  <th>
		    <button
		      className="btn btn-outline-info"
		      onClick={()=>this.setState({order:"Status"})}>
		      {strings.Status}
		    </button>
		  </th>
		  <th>
		    <button
		      className="btn btn-outline-info"
		      onClick={()=>this.setState({order:"Reward"})}>
		      {strings.Reward}
		    </button>
		  </th>
		  <th>
		    <button className="btn btn-outline-info">
		      {strings.Description}
		    </button>
		  </th>
		</tr>
		{this.state.tournaments
		    .sort(this.orders[this.state.order])
		.map(this.renderTournament)}
	      </table>

              
	      <p style={{color: "red"}}>{this.state.error}</p>
	    </div>
	);
    }
}

export default All;
