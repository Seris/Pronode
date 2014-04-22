/**
 *
 * Help command
 *
 **/

var displayHelp = function(name, help) {
    console.info('' + name.underline.cyan + ' - ' + help.desc.grey);
    console.info('\t' + help.usage.yellow + '\n\r');
};

var fs = require('fs'),
    path = require('path');

exports.func = function(argv) {
    if (argv.length > 0) {
        for (var i = 0; i < argv.length; i++) {
            try {
                var command = require(__dirname + '/' + argv[i]);
                if (command.help) {
                    displayHelp(argv[i], command.help);
                } else {
                    console.info(('La commande ' + argv[i].underline + ' ne dispose pas d\'aide.\n\r').cyan);
                }

            } catch (e) {
                if (e.code === 'MODULE_NOT_FOUND') {
                    console.error('Commande inconnue : ', argv[i].inverse);
                }
            }
        }
    } else {
        fs.readdir(__dirname, function(err, files) {
            var p = __dirname + '/';
            if (err) {
                console.error('Erreur lors de la lecture du dossier ' + p.bold);
                process.exit(1);
            }

            files.forEach(function(file) {
                var name = path.basename(p + file, path.extname(p + file)),
                    command = require(p + name);

                if (command.help) {
                    displayHelp(name, command.help);
                } else {
                    console.warn(('La commande ' + name.underline + ' ne dispose pas d\'aide.\n\r').cyan);
                }
            });
        });
    }
};

exports.help = {
    'usage': 'pronode help [command1] [command2] [command3] [...]',
    'desc': 'Permet d\'obtenir de l\'aide sur une/plusieurs commandes.'
};
