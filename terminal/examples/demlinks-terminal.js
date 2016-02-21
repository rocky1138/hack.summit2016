jQuery(document).ready(function($) {
    var id = 1;
    $('#terminal-container').terminal(function(command, term) {
        if (command == 'help') {
            term.echo("available commands are mysql, js, demlinks");
        } else if (command == 'demlinks'){
            term.push(function(command, term) {
                if (command == 'help') {
                    term.echo('COMMANDS:\n\nping\npinwheel\ntrippy\n3d\nhelperOff\nls\ncat\n');
                } else if (command == 'ls') {
		    term.echo('pinwheel.sh trippy.sh 3d.sh helperOff.sh secret.txt'); 	
		} else if (command == 'ping') {
                    term.echo('pong');
                } else {
                    term.echo('unknown command ' + command);
                }
            }, {
                prompt: 'demlinks:~/ ',
                name: 'demlinks'});
        } else if (command == "js") {
            term.push(function(command, term) {
                var result = window.eval(command);
                if (result != undefined) {
                    term.echo(String(result));
                }
            }, {
                name: 'js',
                prompt: 'js> '});
        } else if (command == 'mysql') {
            term.push(function(command, term) {
                term.pause();
                $.jrpc("mysql-rpc-demo.php",
                       "query",
                       [command],
                       function(data) {
                           term.resume();
                           if (data.error && data.error.message) {
                               term.error(data.error.message);
                           } else {
                               if (typeof data.result == 'boolean') {
                                   term.echo(data.result ? 'success' : 'fail');
                               } else {
                                   var len = data.result.length;
                                   for(var i=0;i<len; ++i) {
                                       term.echo(data.result[i].join(' | '));
                                   }
                               }
                           }
                       },
                       function(xhr, status, error) {
                           term.error('[AJAX] ' + status +
                                      ' - Server reponse is: \n' +
                                      xhr.responseText);
                           term.resume();
                       });
            }, {
                greetings: "This is example of using mysql from terminal\n\
you are allowed to execute: select, insert, update and delete from/to table:\n\
    table test(integer_value integer, varchar_value varchar(255))",
                prompt: "mysql> "});
        } else {
            term.echo("unknown command " + command);
        }
    }, {
        greetings: "Typing something with an 'h' might get you somewhere...",
        onBlur: function() {
            // prevent loosing focus
            return false;
        }
    });
});
