module.exports = function(dir){
  var express = require("express");
  var path = require("path");
  var Mount = require("./Mount");

  var app = express();

  function setContentType(res,type,charset) {
    res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
  }

  app.get('/.pid', function (req, res) {
    setContentType(res,'text/plain');
    res.send(''+process.pid);
  });

  var code_mnt = new Mount(path.resolve(__dirname, 'app'));
  app.get(new RegExp('/.app(/.*)'), code_mnt.middleware());

  var raw_mnt = new Mount(path.resolve(__dirname, dir));
  app.get(new RegExp('/.raw(/.*)'), raw_mnt.middleware());

  app.get(new RegExp('.*'), code_mnt.middleware('/index.html'));

  app.use(function(err, req, res, next) {
    throw err;
  });
  return app;
};
