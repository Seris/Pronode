/*
 * Manage command
 */

var command = process.argv[2];
if(!command){
    command = 'help';
}

var argv = process.argv.slice(3);

try{
    require(process.Pronode.bin('ClientCommand/' + command)).func(argv);
} catch(e){
    if(e.code === 'MODULE_NOT_FOUND'){
        console.error('Commande inconnue : ', command.inverse);
        process.exit(1);
    } else {
        console.error("ProNode a rencontré une erreur et doit fermer.");
        throw e;
    }
}