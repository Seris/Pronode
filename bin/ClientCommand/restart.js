/*
 * Restart an application
 */

exports.func = function(argv){
    process.Pronode.connect(function(err, socket){
        if(err){
            console.error(err);
            return false;
        }

        socket.send('restart-app', {
            name: argv[0],
            env: process.env,
            cwd: process.cwd() 
        });
    });
};

exports.help = {
    'usage': 'pronode restart <app>',
    'desc': 'Permet de relancer une application Node.JS'
};
