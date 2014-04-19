/*
 * Reload command
 */

var Pronode = process.Pronode,
    fs = require('fs');

module.exports = function(){
    // Purge current commands
    for(var command in Pronode.commands){
        // Delete from Node.JS Require Cache
        delete require.cache[Pronode.bin(command + '.js')];
        // Delete from Pronode Command List
        delete Pronode.commands[command];
    }

    // Load new commands
    var NewServerCommand = fs.readdirSync(Pronode.bin('ServerCommand'));
    for(var i = 0; i < NewServerCommand.length; i++){
        var command = NewServerCommand[i];
        Pronode.commands[command.replace('.js', '')] = require(Pronode.bin('ServerCommand/' + command));
    }
};