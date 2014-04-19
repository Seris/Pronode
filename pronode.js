#!/usr/bin/env node

var net = require('net');

// Generate path from Pronode Root Folder
var path = function(p){
    return process.env.HOME + '/.pronode/' + (arguments[0] || "");
};

// Generate path from bin folder
var bin = function(p){
    return __dirname + '/bin/' + (arguments[0] || "");
};

process.Pronode = {
    // Pronode Server Version
    version: '0.1',
    // Pronode Socket
    socket: null,
    // Generate path
    path: path,
    bin: bin,
    main: function(){
        return __dirname + '/' + (arguments[0] || "");
    },
    // Connect to server
    connect: function(cb){
        var self = this,
            args = arguments;

        var sock = net.connect(process.Pronode.config.socket || process.Pronode.path('pronode.sock'));
        sock.once('connect', function(){
            this.removeAllListeners('error');

            var PronodeSocket = require(bin('PronodeSocket')),
                socket = new PronodeSocket(sock);

            socket.on('request', function(event, data){
                switch(event){
                    case 'display log':
                        console.log(data);
                        break;

                    case 'display info':
                        console.info(data);
                        break;

                    case 'display warn':
                        console.warn(data);
                        break;

                    case 'display error':
                        console.error(data);
                        break;
                };
            });

            cb(null, socket);
        });

        sock.once('error', function(err){
            sock.removeAllListeners();
            sock.destroy();
            cb("Error when trying to connect on the server !\n\r" + err.stack, null);
        });
    }
};

require('colors');
console.info(('Pronode v' + process.Pronode.version).magenta.bold.underline);

// Configure Client Display
require(bin('ClientDisplay'));

// Load Configuration
try{
    process.Pronode.config = require(path('config.json'));
} catch(e){
    console.error('Impossible de charger le fichier de configuration !', ('(' + e.toString() + ')').inverse);
    process.exit(1);
}

require(bin('ClientCommandManager'));
