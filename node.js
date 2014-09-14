var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'),
    fs = require('fs'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    chance = require('chance'),
    express = require('express');

var Chance = new chance();
var listGamers = [];

console.log("Démarrage du serveur.");

app.use(cookieParser())
    .use(session({secret: 'todotopsecret', resave:true, saveUninitialized:true}))
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(express.static(path.join(__dirname + '/public')))
    .use(function(req, res, next){
        if (typeof(req.session.gamerName) == 'undefined') {
            var randomName;
            do { 
                randomName = Chance.first();
            } while (listGamers.indexOf(randomName) > -1);
            listGamers.push(randomName);
            req.session.gamerName = randomName;
            console.log(randomName);
            console.log(listGamers);

        }
        next();
    })

    .get('/', function (req, res) {
      res.render('index.ejs', {gamerName: req.session.gamerName});
    });
io.sockets.on('connection', function (socket, pseudo) {

    console.log('new_gamerName ' + pseudo);
    socket.emit('new_gamerName', socket.gamerName);
    console.log('broadcast ' + socket.gamerName);
    socket.broadcast.emit('new_gamer', socket.gamerName);

    socket.on('new_backgroundSize', function(backgroundSize) {
        socket.backgroundSize = backgroundSize;
        console.log('new_backgroundSize ' + backgroundSize)
    });

    socket.on('new_gamerName', function(gamerName) {
        gamerName = ent.encode(gamerName);
        socket.gamerName = gamerName;
        console.log('new_gamerName ' + socket.gamerName);
        socket.emit('new_gamerName', gamerName);
    });

    socket.on('new_bikesNumber', function(bikesNumber) {
        socket.bikesNumber = bikesNumber;
        console.log('new_bikesNumber ' + bikesNumber)
    });

    socket.on('message', function (message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
    }); 
});

server.listen(7120);