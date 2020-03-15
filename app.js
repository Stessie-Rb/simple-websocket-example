var http = require('http');
var fs = require('fs');

//Charger le fichier html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Charger socket.io
var io = require('socket.io').listen(server);

//Aficher un message dans la console quand un client se connecte 
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.emit('message', 'Vous êtes bien connecté !');

    //Le serveur "écoute" l'évènement raw_data
    socket.on('raw_data', function(data){
        fs.readFile(data, (err, data) => {
            if (err) throw err;
            let resto = JSON.parse(data);
     
            var tableauFormate = resto.map(obj => { 
                var r = {};
                r.name = obj.name;
                r.cuisine = obj.cuisine;
                return r;
            });

            var americanRestos = tableauFormate.reduce(function (acc, valCourante) {
                if(valCourante.cuisine == 'American ') {
                    acc.push(valCourante.name);
                  }
                return acc;
              }, []);
              //Envoi d'un évènement result quand le traitement des donnés est fini 
              socket.emit('result', americanRestos);
        });         

    })
});


server.listen(8080);