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

Mount.prototype.scan_middleware = function(){
  var mnt = this;
  return function(req,res,next){
    try {
      var direction = req.params[0][0] ;
      var position = +(req.params[0].substring(1));
      var wp = mnt.ensureWebPath( req.params[1] );
      if (wp.dir) {
        mnt.listdir(wp, function (err, df) {
          if (!err && !df) {
            err = new Error("df is not defined for wp:" + wp.toString());
          }
          if (err) {
            next(err);
          } else {
            res.setHeader('Content-Type', 'application/octet-stream');
            var buf = new Buffer(df.to_wdf(),'utf8');
            res.write(JSON.stringify({
              filesize: buf.length,
              mtime: new Date(),
              start_position: 0,
              end_position: buf.length,
              num_of_records: df.getRecordCount()+1,
              content_type: wp.mime(),
            }));
            res.write("\n");
            res.write(buf);
            res.end();
          }
        });
      } else {
        mnt.scanForRecords(wp,{ direction: direction, position: position},
            function(err,r){
              var data = r.data;
              delete r.data;
              res.setHeader('Content-Type', 'application/octet-stream');
              res.write(JSON.stringify(r));
              res.write('\n');
              for(var i = 0 ; i < data.length ; i++ ){
                res.write(data[i]);
              }
              res.end();
            });
      }
    }catch(e){
      next(u$.error({wp: wp.toString()},e));
    }
  };
};

var directions = { F: +1, B: -1 };

Mount.prototype.scanForRecords = function( p, o, callback){
/**
 @param p `wdf/WebPath` or `String`
   path within mount
 @param o.position `int`
   position of record either non-negative number, or  -1  for  end of file.
   It cloud be beginning of record if `o.direction` point forward, or end+1
   otherwise.
 @param o.direction either `'F'` for forward, or `'B'`
   for backward, if omitted exception will be thrown.
 @param o.size `int`
   @default 65535
   size of buffer to be scanned for records
 @param o.detect_record `function(buffer, offset, direction)`
   returns position of next record detected or `undefined` if end of buffer
   is reached
 @param callback `function(err,results)`
   @param results.data array of `Buffer` objects in order as they were in file
   @param results.start_position start position, same as o.position except
     case EOF was provided, then it will be file size.
   @param results.end_position whe scan finished. Keep in mind it will be
     smaller that `results.start_position` if scanning backward.
   @param results.mtime modification time of file
   @param results.filesize size of file
 */
  ['position','size','direction'].forEach(function(k){
    if( u$.isNullish(o.position) ) throw u$.error(k + " not optional");
  });
  if(! directions[o.direction] ){
    throw u$.error('direction has to be one of:' + Object.keys(directions));
  }
  o.direction = directions[o.direction];
  if( !_.isNumber(o.position) || o.position < -1){
    throw u$.error({msg:'invalid position:' + o.position} );
  }
  if( _.isUndefined(o.size) ){
    o.size = 65535;
  }
  if( !_.isNumber(o.size) || o.size <= 0 ){
    throw u$.error({msg:'invalid size:' + o.size } );
  }
  wp = this.ensureWebPath(p);
  if(!o.detect_record){
    var ext = wp.extension();
    o.detect_record =  (ext && ext.toLowerCase() === 'csv') ?
        Mount.detect.CSV_SEPARATED: Mount.detect.LF_SEPARATED;
  }
  if(wp.dir){
    callback(u$.error({
      message: "it is not WebPath directory",
      path: wp.path()}));
  }else {
    var path = this._path(wp);
    var result = {};
    var buf = new Buffer(o.size);
    async.auto(
      {
        fd: function (fn) {
          fs.open(path, 'r', fn);
        },
        stat: ['fd', function (fn, r) {
          fs.fstat(r.fd, fn);
        }],
        read: ['fd', 'stat', function (fn, r) {
          result.mtime = r.stat.mtime;
          result.filesize = r.stat.size;
          if (o.position === -1) {
            o.position = r.stat.size;
          }
          var size = o.size ;
          var pos = o.direction === 1 ? o.position : o.position - o.size;
          if( pos < 0 ){
            pos = 0;
            size = o.position;
          }
          fs.read(r.fd, buf, 0, size, pos, fn);
        }]
      }, function (err, results) {
        if(!err){
          result.data = [];
          var offset =  o.direction === 1 ? 0 : results.read[0] ;
          result.start_position = pos + offset;
          result.content_type = wp.mime();
          for(;;) {
            var r = o.detect_record(buf, offset, o.direction);
            if(!r){
              result.end_position = pos + offset;
              result.num_of_records = result.data.length;
              break;
            }
            offset = r.offset;
            if( o.direction === -1){
              result.data.splice(0, 0, r.rec);
            }else{
              result.data.push(r.rec);
            }
          }
        }
        callback(err, result);
      });
  }
};


var LF = 10,  QUOTE = 34;

Mount.detect = {
  LF_SEPARATED :
    function (buffer, offset, direction) {
      if (direction === 1) {
        for (var i = offset; i < buffer.length; i++) {
          if (buffer[i] === LF) {
            var new_offset = i + 1;
            return {rec: buffer.slice(offset, new_offset), offset: new_offset};
          }
        }
      } else if (direction === -1) {
        for (var i = offset - 1; i >= 0; i--) {
          if (buffer[i] === LF && i < offset - 1 ) {
            var new_offset = i + 1;
            return {rec: buffer.slice(new_offset, offset), offset: new_offset};
          }
        }
      }
    },
  CSV_SEPARATED :
    function (buffer, offset, direction) {
      if (direction === 1) {
        var in_quotes = false;
        for (var i = offset; i < buffer.length; i++) {
          var cc = buffer[i], nc = buffer[i+1];
          if( in_quotes) {
            if( cc === QUOTE ){
              if(nc === QUOTE){
                i++;
              }else{
                in_quotes = false;
              }
            }
          }else{
            if ( cc === QUOTE){
              in_quotes = true ;
            }else if (cc === LF) {
              var new_offset = i + 1;
              return {rec: buffer.slice(offset, new_offset), offset: new_offset};
            }

          }
        }
      } else if (direction === -1) {
        for (var i = offset - 1; i >= 0; i--) {
          var cc = buffer[i], nc = buffer[i-1];
          if(in_quotes) {
            if( cc === QUOTE ){
              if(nc === QUOTE){
                i--;
              }else{
                in_quotes = false;
              }
            }
          }else{
            if (cc === QUOTE) {
              in_quotes = true;
            } else if (cc === LF && i < offset - 1 ) {
              var new_offset = i + 1 ;
              return {rec: buffer.slice(new_offset, offset), offset: new_offset};
            }
          }
        }
      }
    }
};

module.exports=Mount;
