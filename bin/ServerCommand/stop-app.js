/*
 * Stop an Node.JS Application
 */

var Pronode = process.Pronode,
    Applications = Pronode.applications;

module.exports = function(app){
    if(typeof app.name !== 'string'){
        return this.socket.end();
    }

    var CurrentApp = Applications[app.name];

    var self = this;

    // Check if the application is launched
    if(!CurrentApp || !CurrentApp.started){
        return self.socket.end('display warn', "L'application n'est pas (encore) lancée !");
    }

    console.log("Tentative de fermeture de l'application", app.name);
    self.socket.send('display log', "Tentative de fermeture de l'application " + app.name);

    CurrentApp.stop();
    CurrentApp.process.on('exit', function(){
        CurrentApp.logStream.stdout.write('[' + new Date() + '] Fermeture de l\'application !');
        self.socket.end('display info', "L'application a bien été fermé !");
    });
};