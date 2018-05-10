class Game {
    
    constructor(name, desc){
	this.id = Math.floor(Math.random() * 1000000);;
	this.name = name?name:"";
	this.description = desc?desc:"";
    }
    
    id;
    name;
    description;
}

export default Game;
