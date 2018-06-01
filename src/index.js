var express = require('express')
var path = require('path')
var fs = require('fs')
var Busboy = require('busboy')
var request = require('request')
var debug = require('debug')
var log = debug('simple-updatable-website-server')

module.exports.route = function route (app, opts) {
  opts = opts || {}
  opts.public = opts.public || path.join(__dirname, '../public')
  opts.secret = opts.secret || 'uSCmsUmzC2sJx1jWqZ8yy6zQ1vA8NXNKAJqPWcqw'
  app.use(express.static(opts.public))

  var clientPath = '/' + opts.secret
  app.post(path.join(clientPath, 'upload'), function (req, res) {
    var busboy = new Busboy({ headers: req.headers })
    log('receiving files')

    busboy.on('file', function (fieldname, file, filename) {
      var saveTo = path.join(
        opts.public,
        path.basename(filename))
      log('saving ' + filename + ' at ' + saveTo)
      file.pipe(fs.createWriteStream(saveTo))
    })
    busboy.on('finish', function () {
      res.writeHead(200, { 'Connection': 'close' })
      res.end('done')
    })
    return req.pipe(busboy)
  })
}

module.exports.upload = function upload (files, hostname, secret, protocol, cb) {
  if (!cb) {
    cb = protocol
    protocol = 'http://'
  }
  var target = protocol + hostname + '/' + secret + '/upload'
  log('upload([' + files + '], ' + target + ', [' + (typeof cb) + ']')
  var r = request.post(target, function (err) {
    log('uploading done')
    cb(err)
  })
  var form = r.form()

  files.forEach(function (file) {
    var filename = path.basename(file)
    log('uploading ' + file)
    form.append(filename, fs.createReadStream(file), { filename: filename })
  })
}
