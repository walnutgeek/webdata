require("wdf-loader");
require.extensions['.json'] = function(module,filename){
  var fs = require('fs');
  var source = fs.readFileSync(filename).toString();
  module.exports = JSON.parse(source);
  return module.exports;
};
//ignore extensions
['.css','.scss', '.sass'].forEach(function(ext){
  require.extensions[ext] = function(module,filename){ /* do nothing */ };
});
