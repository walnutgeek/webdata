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
});