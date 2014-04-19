/*
 * Configure client display
 */

require('colors');

var log = console.log,
    info = console.info,
    warn = console.warn,
    error = console.error;

console.log = function(){
    var args = new Array();
    args[0] = ('(pronode) Log:   ').grey;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    log.apply(console, args);
};
console.info = function(){
    var args = new Array();
    args[0] = ('(pronode) Info:  ').cyan;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    info.apply(console, args);
};
console.warn = function(){
    var args = new Array();
    args[0] = ('(pronode) Warn:  ').yellow;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    warn.apply(console, args);
};
console.error = function(){
    var args = new Array();
    args[0] = ('(pronode) Error: ').red;
    for (var i = 0; i < arguments.length; i++) {
        args[i + 1] = arguments[i];
    }
    error.apply(console, args);
};
