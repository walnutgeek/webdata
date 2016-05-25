var df = require('./render.wdf');
module.exports = function(mime){
  for(var i = 0 ; i < df.getRowCount() ; i++){
    var p = df.get(i,'pattern');
    if( p === mime || p === '*' ){
      return df.getObjectRow(i);
    }
    if(p[p.length-1] === '*'){
      var prefix = p.substr(0, p.length-1);
      if( mime.indexOf(prefix) === 0 ){
        return df.getObjectRow(i);
      }
    }
  }
};