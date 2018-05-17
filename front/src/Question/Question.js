class Question {
    
    constructor(title, text){
	this.id = -1;
	this.user = "";
	this.tournament = -1;
	this.answer = null;
	this.title = title?title:"";
	this.text = text?text:"";
    }

    id;
    user;
    tournament;
    answer;
    title;
    text;
}

export default Question;
