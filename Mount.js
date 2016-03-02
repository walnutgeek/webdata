var WebPath = require("wdf/WebPath");
var fs = require("fs");
var path = require("path");
var async = require("async");
var u$ = require("wdf/utils");
var DataFrame = require("wdf/DataFrame");
var _ = require("lodash");

function Mount(dir){
  this.dir = fs.realpathSync(dir);
}

Mount.prototype.ensureWebPath = function (p){
  if( _.isString(p) && p[0] === '/' ){
    return new WebPath(p)
  }else if(p.constructor === WebPath){
    return p;
  }else{
    throw u$.error({msg: 'expected path: string string starting with "/" or WebPath', got: p});
  }
};

Mount.prototype._path = function(wp){
  return this.dir + wp.path();
};

Mount.prototype.listdir=function(p,fn){
  wp = this.ensureWebPath(p);
  if(!wp.dir){
    fn(u$.error({
      message: "it is not WebPath directory",
      path: wp.path()}));
  }else{
    var dir_path = this._path(wp);
    fs.readdir(dir_path, function (err, files) {
      if (!err){
        var full_file_names = files.map(function(name){return path.resolve(dir_path,name);})
        async.map(full_file_names, fs.stat, function (err, stats) {
          if (!err) {
            var rows = files.map(function (file, i) {
              var stat = stats[i];
              var type = 'file';
              var size = 0 ;
              var mtime = stat.mtime;
              var isdir = stat.isDirectory();
              if (isdir) {
                type = 'dir';
                name = file + '/';
              }else{
                size = stat.size;
              }
              var cwp = wp.child(file,isdir);
              return [cwp.link(),size,type,cwp.mime(),mtime,""];
            });
            var df = new DataFrame(rows, {columns: require('./dir_columns.json')});
            fn(null, df);
          } else fn(err);
        });
      }
      else fn(err);
    });
  }
};

Mount.prototype.middleware = function(p){
  var mnt = this;
  return function(req,res,next){
    var wp = mnt.ensureWebPath(p ? p : req.params[0]);
    try {
      if (wp.dir) {
        mnt.listdir(wp, function (err, df) {
          if (!err && !df) {
            err = new Error("df is not defined for wp:" + wp.toString());
          }
          if (err) {
            next(err);
          } else {
            res.setHeader('Content-Type', wp.mime());
            res.send(df.to_wdf());
          }
        });
      } else {
        res.sendFile(mnt._path(wp), {headers: {'Content-Type': wp.mime()}})
      }
    }catch(e){
      next(u$.error({wp: wp.toString()},e));
    }
  };
};


module.exports=Mount;
