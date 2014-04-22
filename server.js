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

var fs = require('fs'),
	domain = require('domain'),
	events = require('events');

// Prepare logging
require(bin('Logger'))(
	path('pronode.access.log'),
	path('pronode.error.log')
);

// Because of the absence of the Unix Domain Socket (or equivalent) on Windows
if(process.platform === 'win32'){
	logger.error('Pronode doesn\'t support Win32 platform !');
	process.exit(1);
}

process.stdout.write('\n\r');
logger.info('Lancement du serveur...');

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
	logger.log('Loading configuration from ' + path('config.json').underline);
	process.Pronode.config = require(path('config.json'));
} catch(err){
	logger.error('Impossible de charger le fichier de configuration !\n\r' + err.stack.inverse);
	process.exit(1);
}


// Load command in memory
require(bin('ServerCommand/reload-commands'))();


// Load TCP Server for communication in a domain for security
var d = domain.create();
d.on('error', function(err){
	logger.error('Erreur Fatale !', '\n\r', err.stack.inverse);
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
	logger.error('[uncaughtException]\n\r' + err.stack.inverse);
	process.exit(1);
});
