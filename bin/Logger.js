/*
 * Logging
 */

require('colors');
require('longjohn');

var log = console.log,
    info = console.info,
    warn = console.warn,
    error = console.warn;

var events = require('events');
console.ev = new events.EventEmitter();

console.log = function(){
    var args = new Array();
    args[0] = ('[' + new Date() + '] (pronode) Log:').grey;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    log.apply(console, args);
};
console.info = function(){
    var args = new Array();
    args[0] = ('[' + new Date() + '] (pronode) Info:').cyan;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    info.apply(console, args);
};
console.warn = function(){
    var args = new Array();
    args[0] = ('[' + new Date() + '] (pronode) Warn:').yellow;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    warn.apply(console, args);
};
console.error = function(){
    var args = new Array();
    args[0] = ('[' + new Date() + '] (pronode) Error:').red;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    error.apply(console, args);
};
