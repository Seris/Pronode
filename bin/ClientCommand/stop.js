/*
 * Start an application
 */

exports.func = function(argv){
    process.Pronode.connect(function(err, socket){
        if(err){
            console.error(err);
            return false;
        }

        socket.send('stop-app', {
            name: argv[0]
        });
    });
};
