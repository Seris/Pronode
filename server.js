/**
 * PRONODE Server by Seris
 * Manage easily your Node.JS infrastructure
 * License: GPLv2
**/

// Generate path from Pronode Root Folder
var path = function(p){
    return process.env.HOME + '/.pronode/' + (arguments[0] || "");
};

// Generate path from bin folder
var bin = function(p){
    return __dirname + '/bin/' + (arguments[0] || "");
};

var main = function(){
    return __dirname + '/' + (arguments[0] || "");
};

// Prepare logging
require(bin('Logger'));

var fs = require('fs'),
    domain = require('domain'),
    events = require('events');

if(process.argv[2] === '--logToFile'){
    /* Log to file */
    var stdoutFile = fs.createWriteStream(path('stdout.out'), {flags: 'a'}),
        stderrFile = fs.createWriteStream(path('stderr.out'), {flags: 'a'});

    process.stdout.write = function(string, encoding, fd) {
        stdoutFile.write(string);
    };
    process.stderr.write = function(string, encoding, fd) {
        stderrFile.write(string);
    };
}

// Because of the absence of the Unix Domain Socket (or equivalent) on Windows
if(process.platform === 'win32'){
    console.error('Pronode doesn\'t support Win32 platform !');
    process.exit(1);
}


/* Pronode */
process.Pronode = {
    // Pronode Server Version
    version: '0.1',
    // TCP/IP - HTTP Server
    server: null,
    httpServer: null,
    // Node.JS Application Storage
    applications: {},
    // Generate path
    path: path,
    bin: bin,
    main: main,
    // Commands
    commands: {},
    // Event
    ev: new events.EventEmitter()
};


// Load Configuration
try{
    console.log('Loading configuration from ' + path('config.json').underline);
    process.Pronode.config = require(path('config.json'));
} catch(err){
    console.error('Impossible de charger le fichier de configuration !\n\r' + err.stack.inverse);
    process.exit(1);
}


// Load command in memory
require(bin('ServerCommand/reload-commands'))();


// Load TCP Server for communication in a domain for security
var d = domain.create();
d.on('error', function(err){
    console.error('Erreur Fatale !', '\n\r', err.stack.inverse);
    process.exit(1);
});

// TCP/IP Server
d.run(function(){
    require(bin('netServer'));
});

// Http Server
d.run(function(){
    require(process.Pronode.main('http/server'));
});

/* Process exit */
// Execute on exit
process.on('exit', function(code){
    console[code ? 'warn' : 'info']('Le serveur Pronode s\'apprète à se couper avec le code ' + code + '\n\r');
});

// SIGHUP Signal => Close properly
process.on('SIGHUP', function(){
    process.exit(0);
});

// Capture all uncaught Exception
process.on('uncaughtException', function(err){
    console.error('[uncaughtException]\n\r' + err.stack.inverse);
    process.exit(1);
});