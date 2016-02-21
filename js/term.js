jQuery(document).ready(function($, undefined) {
    var id = 1;
	console.log = (function (old_function){
	    return function (text) {
	        old_function(text);
	        term.echo('console: ' + text);
	    };
	} (console.log.bind(console)));
	console.dir = (function (old_function){
	    return function (text) {
	        old_function(text);
	        term.echo('console: ' + text);
	    };
	} (console.dir.bind(console)));

    function greetings(term) {
        term.echo('STAR WARS ASCIIMACTION\n'+
                  'Simon Jansen (C) 1997 - 2008\n'+
                  'www.asciimation.co.nz\n\n'+
                  'type "play" to start animation, '+
                  'press CTRL+D to stop');
    }
    term = $('#term_demo').terminal(function(command, term) {
	command = command.trim();
        if (command == 'h') {
            term.echo('You lazy..\n');
        } else if (command == 'help') {
            term.echo('COMMANDS: ping  pinwheel  trippy  3d  killbuddy  ls  cat  js clear exit quit\ndir(object) dir(this) dir($) scroll(x,y) frogger matrix time kill mem');
	} else if (command == 'ping') {
               term.echo('PING google.com (74.125.141.113) 56(84) bytes of data.');
		setTimeout(function(){ term.echo('timeout')},0);
		setTimeout(function(){ term.echo('timeout')},500);
		setTimeout(function(){ term.echo('timeout')},1000);
		setTimeout(function(){ term.echo('timeout')},1500);
		setTimeout(function(){ term.echo('Nope: The internet is totally down')},2000);
        } else if (command == 'ls') {
		   term.echo('README.txt secret.txt links.txt');
        } else if (command == 'll') {
		   term.echo('README.txt\nsecret.txt\nlinks.txt');
        } else if (command == '3d') {
                var result = window.eval(threed());
        } else if (command == 'cat README.txt') {
		   term.echo('---------------------------------------\n\n' +
				'This is a hybrid of a javascript console and a shell.\n' +
				'It uses jquery so you can do things like this:\n\n' +
				'$(\'#buddy\').toggle();\n' +
				'\n\n\n\n---------------------------------------');
        } else if (command == 'cat links.txt') {
		   term.echo('---------------------------------------\n\n' +
				'daggasoft.com\nhomeawesomation.com' +
				'\n\n\n\n---------------------------------------');
        } else if (command == 'cat secret.txt') {
		   term.echo('---------------------------------------\n\n' +
				'Secret file, keep out...\n\nSome day there will be something worth hiding here.' +
				'\n\n\n\n---------------------------------------');
        } else if (command.match(/^<.*/i)) {
		   $('body').append(command);
		   term.echo('MARKUP');
        } else if (command.match(/^cat.*/i)) {
		   term.echo('File Not Found');
        } else if (command == 'pinwheel') {
               var result = window.eval(pinwheel());
                if (result != undefined) {
                    term.echo(String(result));
                }
		if (isPinwheel){
			term.echo('pinwheel ON\n\nLook into the center dot for a minute, things will start to look weird');
		} else {
			term.echo('pinwheel OFF');
		}
        } else if (command == 'frogger') {
		term.clear();
                var result = window.eval(frogger());
        } else if (command == 'mem') {
                var result = window.eval(mem());
        } else if (command == 'time') {
                var result = window.eval(time());
        } else if (command == 'matrix') {
                var result = window.eval(matrix());
        } else if (command == 'quit') {
		term.clear();
                var result = window.eval(showConsole());
        } else if (command == 'trippy') {
                var result = window.eval(trippy());
                if (result != undefined) {
                    term.echo(String(result));
                }
		term.echo('Showing cool animations');
       } else if (command == 'killbuddy') {
		term.echo('Why do you insist on destroying me??\nWhat a cruel digital world');
                var result = window.eval(killBuddy());
                if (result != undefined) {
                    term.echo(String(result));
                }
        } else if (command.match(/kill.*/i)) {
		var element = command.split(" ");
		if (element.length < 2){
			term.echo('Usage: kill <id | name | class>');
			return;
		}
                var result = window.eval(kill(element[1]));
        } else if (command == "js") {
	    term.echo('Javascript Console: Jquery ver: ' + jQuery().jquery);
	    term.echo('\n\nbuilt-in commands: pinwheel(), trippy(), killBuddy()');
            term.push(function(command, term) {
                var result = window.eval(command);
                if (result != undefined) {
                    term.echo(String(result));
                }
            },
	    {
                name: 'js',
                prompt: 'js> '
            });
        } else { //differ to javascript
	        if (command !== '') {
	            try {
	                var result = window.eval(command);
	                if (result !== undefined) {
	                    term.echo(new String(result));
	                }
	            } catch(e) {
	                term.error(new String(e));
	            }
	        } else {
	           term.echo('');
	        }
        }
    },
    {
//        greetings: 'Welcome. Typing something with an \'h\' might get you somewhere...\n\n',
	greetings: function(){
		//this.echo('Terminal ver: ' + $.terminal.version + '\njQuery ver: ' +  jQuery().jquery +
		//		'\n\nWelcome. Typing something with an \'h\' might get you somewhere...\n\n'
		//	);
		return;
	},
        prompt: 'COMMAND:  ',
        name: 'shell',
	height:350,
	login: function(user, password, callback) {
 	   //if (user == 'demlinks' && password == 'secret') {
 	   if (true) {
	        callback('AUTHENTICATION TOKEN');
	    } else {
	        callback(null);
	    }
	},
        onBlur: function() {
            // prevent loosing focus
            //return false;
        },
	onExit: function(){
	//	showConsole();
	}
    });
});
