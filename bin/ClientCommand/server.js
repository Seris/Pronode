/*
 * Server start
 */

var child_process = require('child_process');

module.exports.func = function(argv){
    switch(argv[0]){
        case 'start':
            process.Pronode.connect(function(err, socket){
                console.log('Tentative de lancement du serveur...');

                // Check if the server is already launched
                if(!err){
                    socket.end();
                    console.warn('Le serveur est déjà lancé !');
                    process.exit(0);
                }

                // Launch the server process
                argv.shift();
                var server = child_process.spawn(process.execPath, [process.Pronode.main('server')].concat(argv), {
                    detached: true,
                    stdio: ['ipc']
                });

                // If error/exit fire, the server have failed to start !
                server.on('error', function(err){
                    console.error('Erreur lors du lancement du serveur !');
                    process.exit(0);
                });
                server.once('exit', function(){
                    console.error('Erreur lors du lancement du serveur !');
                    process.exit(0);
                });

                // Wait for confirmation from the server
                server.on('message', function(data){
                    server.disconnect();
                    server.unref();
                    if(data.toString('utf8') === 'server-ready'){
                        console.info('Le serveur a bien été lancé', ('[pid=' + server.pid.toString().underline + ']').yellow);
                        process.exit(0);
                    }
                });
            });
            break;
    }
};

exports.help = {
    'usage': 'pronode server [start/stop/restart]',
    'desc': 'Permet de lancer/stopper/redémarrer le serveur Pronode'
};
