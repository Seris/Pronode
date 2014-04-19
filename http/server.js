/**
 * Http Server for Pronode
 */

var Pronode = process.Pronode,
    Applications = Pronode.applications,
    express = require('express'),
    fs = require('fs'),
    Handlebars = require('handlebars');

var app = Pronode.httpServer = express();

// Handlebars Engine
app.engine('handlebars', Handlebars.compile);
app.set('view engine', 'handlebars');

/* fs.readdir(Pronode.main('http/router').replace('.js', ''), function(files){
    var routes = require(Pronode.main('http/router/' + files));
    for(var r in routes){
        routes[r](app);
    }
}); */

var port = Pronode.config.httpPort || process.env.NODE_PORT || 80;
app.listen(port);
console.info('Web Interface listen on ' + port);
