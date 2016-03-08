var assert = require('assert');

var Mount = require("../Mount");
var WebPath = require("wdf/WebPath");

describe( 'Mount',function() {
  it('ensureWebPath', function () {
    var mnt = new Mount('.');
    assert.notEqual(mnt.dir, '.');
    assert.equal(mnt.ensureWebPath('/package.json').constructor, WebPath);
    assert.equal(mnt.ensureWebPath(new WebPath('/package.json')).constructor, WebPath);
    function test_error(p,m){
      try{
        mnt.ensureWebPath(p);
        assert.fail();
      }catch(e){
        assert.equal(e.toString(),m );
      }
    }
    test_error('b/',' {"msg":"expected path: string string starting with \\"/\\" or WebPath","got":"b/"}');

  });
  it('listdir', function (done) {
    var mnt = new Mount('.');
    mnt.listdir('/',function(err,wdf){
      assert.ok(wdf.getRowCount() > 0 );
      var package_json_idx = null ;
      for(var i = 0 ; i < wdf.getRowCount() ; i ++){
        var flink = wdf.get(i,'filename');
        if(flink.text === 'package.json'){
          package_json_idx = i ;
        }
      }
      assert.ok(package_json_idx!==null);
      assert.ok(wdf.get(package_json_idx,'size') > 0);
      done();
    });

  });
  function assert_records(done,r,count,total,filesize){
    assert.equal(r.data.length, count);
    assert.equal(r.filesize, filesize);
    assert.equal(r.data.reduce(function(x,e){return e.length + x;},0),total);
    done();
  }
  it('scanForRecords csv forward', function (done) {
    var mnt = new Mount('.');
    mnt.scanForRecords(
        '/test/data/clinton-emails-extract.csv',
        {
          position: 0,
          size: 16000,
          direction: 'F',
          detect_record: Mount.detect.CSV_SEPARATED
        }, function(e,r){
          assert_records(done,r,5,13986,62419);
        });
  });
  it('scanForRecords csv backward', function (done) {
    var mnt = new Mount('.');
    mnt.scanForRecords(
        '/test/data/clinton-emails-extract.csv',
        { position: -1,
          size: 16000,
          direction: 'B',
          detect_record: Mount.detect.CSV_SEPARATED
        }, function(e,r){
          assert_records(done,r,2,13188,62419);
        });
  });
  it('scanForRecords lf forward', function (done) {
    var mnt = new Mount('.');
    mnt.scanForRecords(
        '/test/data/derby.log',
        {
          position: 0,
          size: 3000,
          direction: 'F',
          detect_record: Mount.detect.LF_SEPARATED
        }, function(e,r){
          assert_records(done,r,13,2877,19929);
        });
  });
  it('scanForRecords lf backward', function (done) {
    var mnt = new Mount('.');
    mnt.scanForRecords(
        '/test/data/derby.log',
        { position: -1,
          size: 3000,
          direction: 'B',
          detect_record: Mount.detect.LF_SEPARATED
        }, function(e,r){
          assert_records(done,r,16,2853,19929);
        });
  });
});