var fs = require('fs')
    , http = require('http')
    , url = require('url')
    , path = require('path')
    , port = process.argv[2] || 5005;

var list;

http.createServer(function (request, response) {
    'use strict';
    var uri = url.parse(request.url).pathname,
        filename = path.join(__dirname, uri);

    if (!fs.existsSync(filename)) {
        response.writeHead(404, {"Content-Type": "text/plain"});
        response.write("404 Not Found\n");
        response.end();
        return;
    }

    if (fs.statSync(filename).isDirectory()) {
        // TODO: Add favicon.ico handler.
        fs.readdir(filename, function (err, files) {
            if (!err) {
                response.writeHead(200, {'Content-Type': 'text/html'}); // ответ 200
                list = "<!doctype html><html><head><title>Listing of " + __dirname + "</title></head><body>";
                files.forEach(function (file) {
                    if (__filename === path.join(__dirname, file)) {
                        //response.end();
                        return;
                    } // не выводим свой файл
                    //if (fs.statSync(path.join(__dirname, file)).isDirectory()) return;
                    list += "<a href='" + path.join(uri, file) + "'>" + file + "</a><br/>";
                });
                list += "</body></html>";
                response.write(list);
                response.end();
            } else {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err + "\n");
                response.end();
            }
        });
    } else {
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            //var contentType = contentTypesByExtension[path.extname(filename)];
            //if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    }
}).listen(port);

console.log('Server listen on port ' + port);
