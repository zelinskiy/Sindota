class Announce {
    
    constructor(tid, title, text){
	this.tournament = tid;
	this.at = new Date().toISOString();
	this.title = title?title:"";
	this.text = text?text:"";
    }
    
    tournament;
    at;
    title;
    text;
}

export default Announce;
