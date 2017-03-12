[![Build Status](https://travis-ci.org/elavoie/simple-updatable-website.svg?branch=master)](https://travis-ci.org/elavoie/simple-updatable-website)

# simple-updatable-website
Simple updatable website for Node.js with both client and server.

Allows a client to remotely update the static files served without restarting the server using a secret value established.

# Usage
   
    // Server 
    var website = require('simple-updatable-website')
    var http = require('http')
    var express = require('express')
    var path = require('path')
    var fs = require('fs')

    var app = express()
    website.route(app, {
        public: 'path to public folder',
        secret: 'secret'
    })

    var httpServer = http.createServer(app)
    httpServer.listen()

    // Client
    website.upload([
        'path to file 1',
        'path to file 2'
    ]), 'hostname', 'secret', function () {
        console.log('done')
    })
    

# website.route(app, [opts])

Add the `(opts.secret)/upload` route to app for uploading files.

- `app` is an express app.
- `opts` are options with the following default values:

    {
        public: path.join(__dirname, 'public'),
        secret: 'uSCmsUmzC2sJx1jWqZ8yy6zQ1vA8NXNKAJqPWcqw' 
    }

 `opts.secret` should be changed to another alphanumeric value for security.

# website.upload(files, hostname, secret, [protocol], cb)

Upload files on the server.

- `files` is an array of file paths
- `hostname` is the hostname of the server or `'ip-address:port'`
- `secret` is the secret used by the server
- `protocol` is optional, defaults to `'http://'`
- `cb(err)` is called when the upload is complete

MIT. Copyright (c) [Erick Lavoie](http://ericklavoie.com).
