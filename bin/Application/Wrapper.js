/*
 * Node.JS Application Wrapper
 */

var child_process = require('child_process'),
    fs = require('fs'),
    path = require('path');

process.on('message', function(message){
    switch(message.event){
        case 'start-app':
            // Generate path from bin folder
            var bin = function(p){
                return __dirname + '/bin/' + (arguments[0] || "");
            };
            // Generate path from Pronode Root Folder
            var path = function(p){
                return process.env.HOME + '/.pronode/' + (arguments[0] || "");
            };

            // Chroot
            if(message.chroot){
                var chroot = require('chroot');

                message.chroot = path.normalize(message.chroot);
                for(var prop in process.env){
                    process.env[prop].replace(message.chroot, '/');
                }

                process.chdir('/');
                chroot(message.chroot, 'nobody', 'nogroup');
            }

            // Set user
            var posix = require('posix');
            posix.seteuid(message.data.user || 'nobody');
            posix.setegid(message.data.group || 'nogroup');

            // Logger
            if(message.pronodeLogStyle){
                require(bin('Logger'));
            }

            // Clear module cache
            for(var p in require.cache){
                if(require.cache.hasOwnProperty(p)){
                    delete require.cache[p];
                }
            }

            process.removeAllListeners('message');

            logger.info('[' + new Date() + ']', 'Lancement de l\'application (' + process.argv[2] + ')\n\r');
            require(process.argv[2]);
            process.argv[2].slice(2, 1);
            break;
    }
});

process.send('wrapper-started');
