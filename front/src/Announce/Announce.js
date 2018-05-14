class Announce {
    
    constructor(title, text){
	this.id = -1;
	this.tournament = -1;
	this.at = new Date().toISOString();
	this.title = title?title:"";
	this.text = text?text:"";
    }

    id;
    tournament;
    at;
    title;
    text;
}

export default Announce;
