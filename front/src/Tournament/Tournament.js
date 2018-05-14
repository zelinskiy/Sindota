class Tournament {
    constructor(){
       	this.id = -1;
       	this.title = "";
       	this.author = "";
       	this.at = "2018-01-06T07:45"
       	this.status = "Default";
       	this.game = -1;
       	this.reward = 0 ;
	this.registeredCount = 0;
	this.isRegistered = false;
	this.isAuthor = false;
       	this.description = "Tournament description";
    }
    
    id;
    title;
    author;
    at;
    status;
    game;
    reward;
    description;
    registeredCount;
    isRegistered;
    isAuthor;
}

export default Tournament;
