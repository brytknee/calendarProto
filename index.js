
var express = require('express'),
	net = require('net'),
	os = require('os'),
	open = require('open'),
	_ = require('underscore');

/**
 * get next available (unused) tcp port
 *
 * @param {Function} cb(port)
 * @return {Void}
 */
var getNextAvailablePort = function(cb){
    var server = net.createServer();
    server.listen(0, function(){
        var port = server.address().port;
        server.once('close', function(){
            cb(port);
        });
        server.close();
    });
};

/**
 * get local address (falls back to localhost)
 *
 * @param {Function} cb(ip)
 * @return {Void}
 */
var getLocalAddress = function(cb){
	var host = 'localhost';
	var interfaces = _.values(os.networkInterfaces());
	_.each(interfaces, function(group){
		_.each(_.values(group), function(entry){
			if (host === 'localhost' && entry.family === 'IPv4' && entry.internal === false && entry.mac !== '00:00:00:00:00:00'){
				host = entry.address;
			}
		});
	});
	cb(host);
};

/**
 * start a local web server
 *
 * @param {Void}
 * @return {Void}
 */
var startLocalServer = function(){
	getLocalAddress(function(newHost){
		host = newHost;
		getNextAvailablePort(function(newPort){
			port = newPort;
			app.listen(port, function(){
				open('http://' + host + ':' + port);
			});
		});
	});
};

/**
 * start a production web server
 *
 * @param {Void}
 * @return {Void}
 */
var startProdServer = function(){
	app.listen(process.env.PORT, function(){
		console.log('listening on port ' + process.env.PORT);
	});
};

// initialize
var app = express();
app.use(express.static(__dirname + '/static'));

if (!process.env.PORT){
	startLocalServer();
} else {
	startProdServer();
}

