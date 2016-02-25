var WebPath = require("wdf/WebPath");
var fs = require("fs");
var async = require("async");
var u$ = require("wdf/utils");
var DataFrame = require("wdf/DataFrame");
var _ = require("lodash");

function Mount(dir){
  this.dir = fs.realpathSync(dir);
}

Mount.prototype.ensureWebPath = function (path){
  if( _.isString(path) && path[0] === '/' ){
    return new WebPath(path)
  }else if(path.constructor === WebPath){
    return path;
  }else{
    throw u$.error({msg: 'expected path: string string starting with "/" or WebPath', got: path});
  }
};

Mount.prototype.listdir=function(p,fn){
  wp = this.ensureWebPath(p);
  if(!wp.dir){
    fn(u$.error({
      message: "it is not WebPath directory",
      path: wp.path()}));
  }else{
    fs.readdir(this.dir + wp.path(), function (err, files) {
      if (!err)
        async.map(files, fs.stat, function (err, stats) {
          if (!err) {
            var rows = files.map(function (file, i) {
              var stat = stats[i];
              var type = 'file';
              var size = 0 ;
              var isdir = stat.isDirectory();
              if (isdir) {
                type = 'dir';
                name = file + '/';
              }else{
                size = stat.size;
              }
              var cwp = wp.child(file,isdir);
              return [cwp.link(),size,type,cwp.mime(),""];
            });
            var df = new DataFrame(rows, {columns: require('./dir_columns.json')});
            fn(null, df);
          } else fn(err);
        });
      else fn(err);
    });
  }
};
module.exports=Mount;
