/*
 * Start an Node.JS Application
 */

var Pronode = process.Pronode,
    Applications = Pronode.applications;

var child_process = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    events = require('events'),
    domain = require('domain'),
    App = require(Pronode.bin('Application/Application'));

var usage = require('usage');

module.exports = function(app){
    if(typeof app.name !== 'string')
        return this.socket.end();

    this.socket.send('display info', "Tentative de lancement de l'application " + app.name);

    // Check if the application is already launched
    if(Applications[app.name])
        return this.socket.end('display warn', "L'application est déjà lancée !");

    // Path to the application folder
    var applicationPath = Pronode.path('applications/' + app.name);

    // Check if the application is configured
    if(!fs.existsSync(applicationPath + '/config.json'))
        return this.socket.end('display warn', "Aucune application de ce nom n'a été configuré !");

    console.log('Tentative de lancement de l\'application :', app.name);

    // Load configuration
    try{
        this.socket.send('display log', 'Chargement du fichier de configuration...');
        var config = require(applicationPath + '/config.json');
    } catch(e){
        console.warn('Erreur dans la configuration de l\'application ' + app.name.underline);
        return this.socket.end('display error', "Erreur dans la configuration de l'application " + app.name.underline);
    }

    // Check if the entry point is configured
    if(!config.entry_point){
        console.warn('Erreur dans la configuration de l\'application ' + app.name.underline);
        return this.socket.end('display warn', "Aucun entry_point présent dans la configuration de l'application " + app.name.underline);
    }

    // Check if the entry point exist
    if(!fs.existsSync(config.entry_point)){
        console.warn("Le entry_point de l'application", app.name.underline, "n'existe pas !");
        return this.socket.end('display warn', "Le entry_point de l'application " + app.name.underline + " n'existe pas !");
    }

    // Start the application
    var self = this,
        CurrentApp = Applications[app.name] = new App(app.name, config);

    CurrentApp.start();
    CurrentApp.on('start', function(err, app){
        CurrentApp.process.on('exit', function(code, signal){
            console.info("L'application", CurrentApp.name.underline, "s'est stoppée avec le code", code, '[' + signal + ']');
            delete Applications[CurrentApp.name];
        });

        if(err){
            console.warn("Erreur lors du lancement de l'application", app.name.underline + '\n\r' + err.stack);
            return this.socket.end('display error', "Erreur lors du lancement de l'application " + app.name.underline);
        }

        Pronode.ev.emit('application started', CurrentApp);

        console.info("L'application", CurrentApp.name.underline, 'a bien été lancé ! [pid=' + CurrentApp.process.pid + ']');
        self.socket.end('display info', "L'application " + CurrentApp.name.underline + ' a bien été lancé ! [pid=' + CurrentApp.process.pid + ']');
    });
};