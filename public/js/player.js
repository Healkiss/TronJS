var Player = (function($, Player) {

    "use strict";

    Player = Player || {};

    Player = function(game, position) {
        this.game = game;
        this.position = position;
        this.color = null;
        this.isHuman = true;
        this.motos = [];
        this.currentMoto = null;
        this.init();
    };

    var proto = Player.prototype;

    proto.init = function(){
        this.listenners();
        if(this.position == 1){
            this.color = "orange";
        }else{
            this.color = "blue";
        }
    }

    proto.listenners = function(){

    }

    proto.play = function(){
        /*var element = this.motos[0].getElement();*/
        this.currentMoto = this.motos[0];
        this.currentMoto.activate();
    }
    
    proto.move = function(direction){
        var result = this.currentMoto.move(direction);
        console.log(result);
        switch (result)
        {
            case 'invalid':
                return this.currentMoto;
            break;
            case 'valid':
                return this.nextMoto();
            break; 
            case 'occupied':
                this.currentMoto.destroy();
                return this.nextMoto(true);
            break;
            default: 
                console.log("reponse non reconnu"); 
            break; 
        }
    }

    proto.nextMoto = function(destroy){
        var curIndex = this.motos.indexOf(this.currentMoto);

        if(destroy)
            this.motos.splice(this.currentMoto.getIndex(),1);
        if (curIndex <= this.motos.length-2){
            this.currentMoto = this.motos[curIndex+1];
            this.currentMoto.activate();
            return this.currentMoto
        }
        return 'end';
    }

    return Player;

}(jQuery, Player));