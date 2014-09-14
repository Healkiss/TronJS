var Moto = (function($, Moto) {

    "use strict";

    Moto = Moto || {};

    Moto = function(player, x, y)
    {
        this.player = player;
        this.x = x;
        this.y = y;
        this.tail = [];
        this.init();
    };

    var proto = Moto.prototype;

    proto.init = function(){
        this.listenners();
    }

    proto.listenners = function(){

    }

    proto.move = function(direction)
    {
        var x = this.x;
        //console.log("x : " + x);
        var y = this.y;
        //console.log("y : " + y);
        var leftY = y-1;
        var rightY = y+1;
        var topX = x-1;
        var bottomX = x+1
        var nextPositions = [];
        var result = null;
        switch (direction) 
        { 
            case 'left':
                nextPositions = [x, leftY];
                result = this.shift(nextPositions);

            break; 
            case 'right':
                nextPositions = [x, rightY];
                result = this.shift(nextPositions);
            break;
            case 'top':
                nextPositions = [topX, y];
                result = this.shift(nextPositions);
            break; 
            case 'bottom':
                nextPositions = [bottomX, y];
                result = this.shift(nextPositions);
            break; 
            default: 
                console.log("deplacement non valide"); 
            break; 
        }
        return result;
    }

    proto.shift = function(nextPositions)
    {
        var nextX = nextPositions[0];
        var nextY = nextPositions[1];
        var nextElement = $("td[data-row='"+nextX+"'][data-column='"+nextY+"']");
        nextElement.removeClass("empty");
        var isValid = this.isAValidePlace(nextElement);
        var isAnOccupiedPlace = this.isAnOccupiedPlace(nextElement);
        console.log("isAnOccupiedPlace?" + isAnOccupiedPlace);
        if (isAnOccupiedPlace){
            this.destroy();
            return 'occupied';
        }else if (isValid){
            nextElement.addClass("head " + this.player.color);
            nextElement.removeClass("empty");
            this.desactivate();
            this.tail.push(this.element());
            this.y = nextY;
            this.x = nextX;
            this.element().data('head', this.player.position);
            this.element().data('player', this.player.position);
            this.element().data('moto', this.getIndex());
            return 'valid';
        }else{
            return 'invalid';

        }
    }

    proto.element = function()
    {
        var x = this.x;
        var y = this.y;
        return $("td[data-row='"+x+"'][data-column='"+y+"']");
    }
    
    proto.isAValidePlace = function (place)
    {
        var backgroundSize = this.player.game.backgroundSize;
        if(typeof place.data('row') ===  'undefined'|| typeof place.data('column') ===  'undefined'){
            return false;
        }
        return true;
    }
    
    proto.isAnOccupiedPlace = function (place)
    {
        console.log(place);
        if(place.data('player')){
            return true;
        }
        return false;
    }

    proto.motoOnPlace = function(place)
    {
        return [place.data('player'), place.data('moto')]
    }

    proto.showTail = function()
    {
        var key;
        for(key in this.tail){
            this.blink(this.tail[key], 3, 100);
        }
    }

    proto.activate = function()
    {
        this.element().modernBlink('start');
        this.element().addClass('head');
        //console.log(this.element());
    }

    proto.desactivate = function()
    {
        this.element().data('head', '0');
        this.element().data('tail', this.player.position);
        this.element().removeClass('head');
        this.element().modernBlink('stop');
    }

    proto.destroy = function()
    {
        var key;
        this.desactivate();
        this.element().removeClass('head');
        this.element().addClass('empty');
        this.element().removeClass(this.player.color);
        for(key in this.tail){
            this.tail[key].removeClass(this.player.color);
            this.tail[key].addClass('empty');
            this.tail[key].removeData('head');
            this.tail[key].removeData('moto');
            this.tail[key].removeData('player');
        }
    }

    proto.getIndex = function()
    {
        return this.player.motos.indexOf(this.player.currentMoto);
    }

    proto.blink = function(elem, times, speed) {
        var global = this;
        if (times > 0 || times < 0) {
            if ($(elem).hasClass("head")) $(elem).removeClass("head");
            else $(elem).addClass("head");
        }

        clearTimeout(function () {
            global.blink(elem, times, speed);
        });

        if (times > 0 || times < 0) {
            setTimeout(function () {
                global.blink(elem, times, speed);
            }, speed);
            times -= .5;
        }
    }

    return Moto;

}(jQuery, Moto));