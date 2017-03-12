var tape = require('tape')
var server = require('../')
var http = require('http')
var express = require('express')
var path = require('path')
var fs = require('fs')
var randombytes = require('randombytes')

var secret = 'secret'
var port = 5000

tape('Upload test', function (t) {
  var app = express()
  server.route(app, {
    public: path.join(__dirname, 'public'),
    secret: secret
  })
  var httpServer = http.createServer(app)
  httpServer.listen(port)

  var expected = randombytes(10).hexSlice()
  var localHello = path.join(__dirname, 'hello.txt')
  fs.writeFileSync(localHello, expected.toString())

  server.upload([
    path.join(__dirname, 'hello.txt')
  ], 'localhost:' + port, secret, function (err) {
    t.notOk(err)
    var remoteHello = path.join(__dirname, 'public', 'hello.txt')
    var actual = fs.readFileSync(remoteHello).toString()
    fs.unlinkSync(localHello)
    fs.unlinkSync(remoteHello)
    t.equal(actual, expected)
    httpServer.close()
    t.end()
  })
})
