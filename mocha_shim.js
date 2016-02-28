require("wdf-loader");
var fs = require('fs');

require.extensions['.json'] = function(module,filename){
  var source = fs.readFileSync(filename).toString();
  module.exports = JSON.parse(source);
};

//ignore extensions
['.css','.scss', '.sass'].forEach(function(ext){
  require.extensions[ext] = function(module,filename){
    /* do nothing */ };
});

['.txt','.html', '.htm', '.svg'].forEach(function(ext){
  require.extensions[ext] = function(module,filename){
    var idx = filename.lastIndexOf('!'); // ignore webpacks inline loaders
    if(idx > -1){
      filename = filename.substring(idx+1);
    }
    var source = fs.readFileSync(filename).toString();
    module.exports = source;
  };
});