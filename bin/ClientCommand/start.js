/*
 * Start an application
 */

exports.func = function(argv){
    process.Pronode.connect(function(err, socket){
        if(err){
            console.error(err);
            return false;
        }

        socket.send('start-app', {
            name: argv[0],
            env: process.env,
            cwd: process.cwd() 
        });
    });
};

exports.help = {
    'usage': 'pronode start <app>',
    'desc': 'Permet de lancer une application Node.JS'
};