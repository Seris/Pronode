/*
 * Create TCP/IP Server
 */

var net = require('net'),
    fs = require('fs'),
    domain = require('domain'),
    PronodeSocket = require(process.Pronode.bin('PronodeSocket.js'));

var socket = process.Pronode.config.socket || process.Pronode.path('pronode.sock');

// Create the server
var server = process.Pronode.server = net.createServer();
server.listen(socket, function(){
    // Only the user who start the server can connect to it
    fs.chmodSync(socket, 0700);

    server.on('connection', function(sock){
        var socket = new PronodeSocket(sock);
        socket.on('request', function(event, data){
            require(process.Pronode.bin('ServerCommand/' + event.replace('..', '.'))).call({
                socket: socket
            }, data);
        });
    });

    // Notify the server is launched
    try{
        global.process.send('server-ready');
    } catch(e){}

    console.info('TCP/IP server listen on ' + socket.underline);
});

// When the process exit, delete the .sock file
process.on('exit', function(){
    if(fs.existsSync(socket)){
        fs.unlinkSync(socket);
    }
});

// Log when an error occured and exit the process
server.on('error', function(err){
    console.error('Erreur lors du lancement du serveur !\n\r' + err.stack.inverse);
    process.exit(1);
});