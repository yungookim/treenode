var sys = require("sys"),
    http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    qs = require("querystring"),
    async = require("./async.js");

// This server combines multiple files into one response
http.createServer(function(request, response) {

    var parsed_url = url.parse(request.url,true);
    var querystring = parsed_url.query;
    var pathname = parsed_url.pathname;


	ext = "";

	switch (pathname) {
		case '/css/':
			ext = ".css";
			break;
		case '/js/':
			ext = ".js";
			break;
	}


	filelist = [];

	// turn query string into file names
	// key.value.[css|js]
	// TODO validation
	// (disallow /../ in key), (value should always be number, etc)
	for (var k in querystring) {
		filelist.push( path.join(process.cwd(), pathname, k + "." + querystring[k] + ext ) );
	}

	// write header info
   response.writeHead(200, {"Content-Type": "text/plain"});

	// read files in parallel, write file contents to response
	async.forEach( filelist ,
		function(item, callback) {
			path.exists(item, function(exists) {
				// if path exists, read it
				if (exists) {
					fs.readFile(item, function(err, file) {
						// when file is read, write it to response
						response.write(file);
						// signal i'm done
						if (err) {
							// err
							callback(err);
						} else {
							callback();
						}
					});
				} else {
					// if path doesn't exist, do nothing, just signal
					callback();
				}
			});
		},
		
		function(err) {
			response.end();

			if (err) {
				console.log(err);
			}
		});

}).listen(8125, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8125/');

