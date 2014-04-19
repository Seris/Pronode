/*
 * Application 
 */

var child_process = require('child_process'),
    path = require('path'),
    fs = require('fs'),
    domain = require('domain'),
    util = require('util'),
    Promise = require('promise');

var Pronode = process.Pronode;

/**
 * Represent an Node.JS Application
 * @constructor
 * @param {string} name - Name of the application
 * @param {object} options - Options of the application
 */
var Application = function(name, options){
    // Run all in a domain to catch all error
    this.domain = domain.create();
    this.domain.add(this);
    this.domain.run(function(){
        // Application name
        this.name = name;
        // Entry Point
        this.entry_point = options.entry_point;
        console.log(options.entry_point);
        // Working Folder
        this.cwd = options.cwd || path.dirname(this.entry_point);
        // Environment
        this.env = options.env || {};

        // Options
        this.options = options;

        // Log File
        this.logStream = {};
        this.logStream.stdout = fs.createWriteStream(this.options.stdout || Pronode.path('applications/' + this.name + '/stdout.out'), {flags: 'a'});
        this.logStream.stderr = fs.createWriteStream(this.options.stderr || Pronode.path('applications/' + this.name + '/stderr.out'), {flags: 'a'});

        this.started = false;
    }.bind(this));
};

/**
 * Add Event
 */
util.inherits(Application, require('events').EventEmitter);

/**
 * Start the wrapper of an application
 * @returns {function} Promise 
 */
Application.prototype._spawnWrapper = function(){
    var self = this;

    // Start Wrapper process
    this.process = child_process.spawn(process.execPath, [Pronode.bin('Application/Wrapper'), this.entry_point].concat(this.options.argv || []), {
        cwd: this.cwd,
        env: this.env,
        detached: false,
        stdio: ['ipc']
    });

    // Pipe log to file
    this.process.stdout.pipe(this.logStream.stdout);
    this.process.stderr.pipe(this.logStream.stderr);

    // When the process exit
    this.process.once('exit', function(){
        self.started = false;
        this.emit('stop', null, code, signal);
        Pronode.ev.emit('application exit', CurrentApp);
        self.domain.dispose();
    });

    // When the domain dispose
    this.domain.on('dispose', function(){
        self.removeAllListeners();
    });

    this.started = true;
    this.aborted = false;

    return new Promise(function(resolve, reject){
        this.process.on('message', function(message){
            switch(message){
                case 'wrapper-started':
                    this.removeListener('error', onError);
                    this.removeListener('exit', onExit);
                    resolve();
                    break;
            }
        });

        // On Error
        var onError = function(err){
            this.removeListener('exit', onExit);
            reject(err);
        };
        this.process.once('error', onError);

        // On Exit
        var onExit = function(){
            reject(new Error('Wrapper has exited unexpectedly !'));
        };
        self.process.once('exit', onExit);
    }.bind(this));
};

/**
 * Start the application
 */
Application.prototype.start = function(){
    if(this.started){
        cb(null, this);
        return;
    }

    this.domain.run(function(){
        var self = this;
        var onResolve = function(){
            self.process.send({
                event: 'start-app',
                data: self.options
            });

            self.started = true;
            self.emit('start', null, this);
        };

        var onReject = function(err){
            self.emit('start', err);
            self.abort(err);
        };

        this._spawnWrapper().done(onResolve, onReject);
    }.bind(this));

};

/**
 * Stop the application
 */
Application.prototype.stop = function(){
    if(!this.started){
        return;
    }

    this.domain.run(function(){
        // Force application to exit 10 seconds after the signal
        var forceExit = setTimeout(function(){
            this.process.kill('SIGKILL');
        }, 10000);

        // Executed when the application exit
        this.process.once('exit', function(code, signal){
            clearTimeout(forceExit);
        });

        // Ask to the application to stop nicely
        this.process.kill('SIGHUP');   
    }.bind(this));
};

/**
 * Abort the application (useful on error)
 */
Application.prototype.abort = function(err){
    if(this.aborted){
        return;
    }

    this.aborted = true;
    if(this.started){
        // Try to kill the application
        this.process.kill('SIGKILL');
    }

    this.emit('abort', arguments[0]);

    // Dispose Domain
    this.domain.dispose();
};

// Export Application
module.exports = Application;
