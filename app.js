module.exports = function(dir){
  var express = require("express");

  var app =  express();

  function setContentType(res,type,charset) {
    res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
  }

  app.get('/.pid', function (req, res) {
    setContentType(res,'text/plain');
    res.send(''+process.pid);
  });

  app.get('/', function (req, res) {
    res.send('Hello World!');
  });

  return app;
};
