var Tron = (function($, Tron) {

    "use strict";

    Tron = Tron || {};

    Tron = function(options)
    {
        this.socket = options.socket;
        this.backgroundDiv = $('#background');
        this.gamerName = $('#gamerName').text();
        this.backgroundSize = options.backgroundSize;
        this.bikesNumber = options.bikeNumber;
        this.bikesNumber = options.gamerName;
        this.bikesNumberToPlace = options.bikeNumber;
        this.step = 2;
        this.gameType = 0;
        this.players = [];
        this.playerOne = new Player(this, 1);
        this.playerTwo = new Player(this, 2);
        this.currentPlayer = null;
    };

    var proto = Tron.prototype;

    proto.init = function()
    {
        this.listenners();
        this.backdroundDraw = this.drawBackground();
        this.players.push(this.playerOne);
        this.players.push(this.playerTwo);
        this.displayBackground();
    }

    proto.listenners = function()
    {
        var global = this;
        $(document).on('click','td', function()
            {
                if(global.bikesNumberToPlace > 0 && $(this).hasClass("empty")){
                    var row = $(this).data('row');
                    var column = $(this).data('column');
                    var inverseRow = (global.backgroundSize-1) - (row);
                    var inverseColumn = (global.backgroundSize-1) - (row);

                    //set moto player one
                    var moto = new Moto(global.playerOne, row, column);
                    global.playerOne.motos.push(moto);
                    $(this).removeClass("empty");
                    $(this).addClass("head orange");
                    $(this).data('head', '1');
                    $(this).data('player', global.playerOne.position);
                    $(this).data('moto', moto.getIndex());

                    //set moto player two
                    var moto = new Moto(global.playerTwo, inverseRow, column);
                    global.playerTwo.motos.push(moto);
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").removeClass("empty");
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").addClass("head blue");
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").data('head', '2');
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").data('player', global.playerTwo.position);
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").data('moto', moto.getIndex());

                    global.bikesNumberToPlace--;
                    $("#bikesNumberToPlace").html(global.bikesNumberToPlace);
                    if(global.bikesNumberToPlace == 0){
                        $("#bikesPlacementStep").removeClass("alert-danger glyphicon-remove");
                        $("#bikesPlacementStep").addClass("alert-success glyphicon-ok");
                        global.checkStep();
                    }
                }else if( !$(this).hasClass("empty") && $(this).hasClass("orange") ){
                    var row = $(this).data('row');
                    var column = $(this).data('column');
                    var inverseRow = (global.backgroundSize-1) - (row);
                    var inverseColumn = (global.backgroundSize-1) - (row);
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").addClass("empty");
                    $("td[data-row='"+inverseRow+"'][data-column='"+column+"']").removeClass("head blue");
                    $(this).removeClass("orange");
                    $(this).removeClass("head")
                    $(this).addClass("empty");
                    global.bikesNumberToPlace++;
                    $("#bikesNumberToPlace").html(global.bikesNumberToPlace);
                    $("#bikesPlacementStep").removeClass("alert-success glyphicon-ok");
                    $("#bikesPlacementStep").addClass("alert-danger glyphicon-remove");
                    global.checkStep();
                }
            }
        );
        $('input[name=backgroundSize]').keyup(function()
            {
                var val = $(this).val();
                global.changeSize(val);
                global.changeBikesNumber(global.bikesNumberToPlace);
            }
        );
        $('input[name=bikesNumber]').keyup(function()
            {
                var val = $(this).val();
                global.changeBikesNumber(val);
            }
        );
        $('.players').on('click', function()
            {
                var val = $(this).data('players');
                $(".gameStyle").removeClass("gameStyleClicked");
                $(this).addClass("gameStyleClicked");
                switch(val){
                    case "hvhl":
                        $('#player1Icon').prop("src", 'img/human.jpg');
                        $('#player2Icon').prop("src", 'img/human.jpg');
                        global.playerOne.isHuman = true;
                        global.playerTwo.isHuman = true;
                        break;
                    case "hvhd":
                        $('#player1Icon').prop("src", 'img/human.jpg');
                        $('#player2Icon').prop("src", 'img/human.jpg');
                        global.playerOne.isHuman = true;
                        global.playerTwo.isHuman = true;
                        break;
                    case "hvia":
                        $('#player1Icon').prop("src", 'img/human.jpg');
                        $('#player2Icon').prop("src", 'img/ia.jpg');
                        global.playerOne.isHuman = true;
                        global.playerTwo.isHuman = false;
                        break;
                    case "iavia":
                        $('#player1Icon').prop("src", 'img/ia.jpg');
                        $('#player2Icon').prop("src", 'img/ia.jpg');
                        global.playerOne.isHuman = false;
                        global.playerTwo.isHuman = false;
                        break;
                    default:
                        alert('cas non géré');
                }
                $("#gameTypeStep").removeClass("alert-danger glyphicon-remove");
                $("#gameTypeStep").addClass("alert-success glyphicon-ok");
                global.gameType = 1;
                global.checkStep();
            }
        );
        $("#btnBegin").click(function()
            {
                $(document ).off("click");
                $(".border-right").addClass("quitOnLeft");
                $(".setups").addClass("quitOnTop");
                setTimeout(function(){
                    global.startGame();
                }, 1000);
            }
        );
        $(document).keypress(function(event)
            {
                //console.log(event.which);
                //113 left
                var result = null;
                if (event.which == 113){
                    result = global.currentPlayer.move('left');
                }
                //100 right
                if (event.which == 100){
                    result = global.currentPlayer.move('right');
                }
                //122 top
                if (event.which == 122){
                    result = global.currentPlayer.move('top');
                }
                //115 bottom
                if (event.which == 115){
                    result = global.currentPlayer.move('bottom');
                }
                if (event.which == 13){
                    console.log("press");
                }
                //console.log(result);
                if (result == 'end'){
                   global.nextPlayer(); 
                }
            }
        );
    }

    proto.startGame = function()
    {
        this.hideSetups();
        var global = this;
        $(document).on('click', ".head", function()
            {
                var playerId = $(this).data('player');
                var motoId = $(this).data('moto');
                global.getMoto(playerId, motoId).showTail();
            }
        );
        this.play();
    }

    proto.getMoto = function(playerId, motoId)
    {
        var player = null;
        if(playerId == 1){
            player = this.playerOne;
        }else{
            player = this.playerTwo;
        }
        return player.motos[motoId];
    }

    proto.move = function(player)
    {
        this.currentPlayer = player;
        this.currentPlayer.play();
    }

    proto.play = function()
    {
        var element;
        this.move(this.playerOne);
    }
    
    proto.nextPlayer = function()
    {
        if (this.currentPlayer == this.playerOne){
            this.currentPlayer = this.playerTwo;

        }else{
            this.currentPlayer = this.playerOne;
        }
        this.currentPlayer.play();
    }

    proto.hideSetups = function()
    {
        /*$(".border-right").animate({
        }, 500, function() {
            $(".border-right").css('right', '100%');
            $(".border-right").appendTo('#container');
        });
        $(".setups").animate({
        }, 500, function() {
            $(".border-right").css('left', '100%');
            $(".border-right").appendTo('#container');
        });*/
        //TweenMax.to(, 2, {y: -window.innerHeight});
        $(".border-right").remove();
        $(".setups").remove();
        $("#game").removeClass("col-md-10");
        $("#game").addClass("col-md-12");
        // $("#background").addClass("recentered");
    }

    proto.checkStep = function(){
        if (this.bikesNumberToPlace == 0 && this.gameType){
            $("#btnBegin").removeClass("disabled"); 
        }else{
            $("#btnBegin").addClass("disabled");
        }
    }

    proto.drawBackground = function(){
        var size = this.backgroundSize;
        var tableStart = "<table>";
        var tableEnd = "</table>";
        var tableRowStart = "<tr>";
        var tableRowEnd = "</tr>";
        var tableDataStart = "<td class='empty' data-row='' data-column=''>";
        var tableDataEnd = "</td>";
        var tableData = tableDataStart + tableDataEnd;
        var table = tableStart;
        for(var i = 0; i < size; i++){
            table += tableRowStart;
            for(var j = 0; j < size; j++){
                var tableDataStartBis = tableDataStart.replace("data-row=''", "data-row='"+i+"'");
                tableDataStartBis = tableDataStartBis.replace("data-column=''", "data-column='"+j+"'");
                tableData = tableDataStartBis + tableDataEnd;
                table += tableData;
            }
            table += tableRowEnd;
        }
        table += tableEnd;
        return table;
    }

    proto.displayBackground = function(){
        this.backgroundDiv.html(this.backdroundDraw);
    }

    proto.changeGamerName = function(val){
        if(val == ""){
            this.socket.emit('getRandomGamerName', this.backgroundSize);
            socket.on ('getRandomGamerName', function (gamerName) {
                this.gamerName = gamerName;
            });
            
        }else{
            this.gamerName = val;
            this.socket.emit('new_gamerName', this.gamerName);
        }
        $("#gamerNameStep").removeClass("alert-warning");
        $("#gamerNameStep").addClass("alert-success glyphicon-ok");
        $("#gamerName").html(this.gamerName + " x " + this.gamerName);
    }

    proto.changeSize = function(val){
        if(val == ""){
            this.backgroundSize = 20
        }else{
            this.backgroundSize = val
        }
        $("#backgroundStep").removeClass("alert-warning");
        $("#backgroundStep").addClass("alert-success glyphicon-ok");
        $("#backgroundSize").html(this.backgroundSize + " x " + this.backgroundSize);
        this.bikesNumberToPlace = this.bikesNumber;
        this.checkStep();
        $("#bikesNumberToPlace").html(this.bikesNumberToPlace);
        this.backdroundDraw = this.drawBackground();
        this.displayBackground();
        this.socket.emit('new_backgroundSize', this.backgroundSize);
    }

    proto.changeBikesNumber = function(val){
        if(val == ""){
            this.bikesNumber = 2;
        }else{
            this.bikesNumber = val;
        }
        this.bikesNumberToPlace = this.bikesNumber;
        this.checkStep();
        $("#bikesNumberStep").removeClass("alert-warning");
        $("#bikesNumberStep").addClass("alert-success glyphicon-ok");
        $("#bikesPlacementStep").removeClass("alert-success glyphicon-ok");
        $("#bikesPlacementStep").addClass("alert-danger glyphicon-remove");
        $("#bikesNumber").html(this.bikesNumber);
        $("#bikesNumberToPlace").html(this.bikesNumberToPlace);
        this.displayBackground();
        this.socket.emit('new_bikesNumber', this.bikesNumber);
    }

    return Tron;

}(jQuery, Tron));