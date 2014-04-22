/*
 * Logging
 */

var fs = require('fs');

module.exports = function(stdout, stderr){
    require('colors');
    require('longjohn');

    global.logger = {
        stdout: stdout,
        stderr: stderr
    };

    logger.log = function(){
        var args = new Array();
        args[0] = ('[' + new Date() + '] (pronode) Log: ').grey;
        for (var i = 0; i < arguments.length; i++) {
            args[i + 1] = arguments[i];
        }
        if(stdout){
            fs.writeFileSync(this.stdout, args.join(' ') + '\n\r', {
                encoding: 'utf8',
                flag: 'a'
            });
        }
        if(process.stdout.isTTY){
            console.log.apply(console, args);
        }
    };

    logger.info = function(){
        var args = new Array();
        args[0] = ('[' + new Date() + '] (pronode) Info:').cyan;
        for (var i = 0; i < arguments.length; i++) {
            args[i + 1] = arguments[i];
        }
        if(stdout){
            fs.writeFileSync(this.stdout, args.join(' ') + '\n\r', {
                encoding: 'utf8',
                flag: 'a'
            });
        }
        if(process.stdout.isTTY){
            console.info.apply(console, args);
        }
    };

    logger.warn = function(){
        var args = new Array();
        args[0] = ('[' + new Date() + '] (pronode) Warn:').yellow;
        for (var i = 0; i < arguments.length; i++) {
            args[i + 1] = arguments[i];
        }
        if(stderr){
            fs.writeFileSync(this.stderr, args.join(' ') + '\n\r', {
                encoding: 'utf8',
                flag: 'a'
            });
        }
        if(process.stderr.isTTY){
            console.warn.apply(console, args);
        }
    };
    
    logger.error = function(){
        var args = new Array();
        args[0] = ('[' + new Date() + '] (pronode) Error:').red;
        for (var i = 0; i < arguments.length; i++) {
            args[i + 1] = arguments[i];
        }
        if(stderr){
            fs.writeFileSync(this.stderr, args.join(' ') + '\n\r', {
                encoding: 'utf8',
                flag: 'a'
            });
        }
        if(process.stderr.isTTY){
            console.error.apply(console, args);
        }
    };
};
