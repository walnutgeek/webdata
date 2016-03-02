require('mocha/mocha.css');
var assert = require("assert");
describe( 'tests', function() {
  it('WebFile', function () {
    var WebFile = require('./WebFile');
    function test_enum(s){
      var f = new WebFile(s);
      assert.equal(s, f.path());
      var e = f.enumerate();
      var n = (arguments.length -1)/2;
      assert.equal(e.length,n);
      for(var i = 0 ; i < n ; i++){
        assert.equal(arguments[1+i*2], e[i].path());
        assert.equal(arguments[2+i*2], e[i].name);
      }
    }
    test_enum('/','/','');
    test_enum('/acme/','/','','/acme/','acme');
    test_enum('/x/y/z','/','','/x/','x','/x/y/','y','/x/y/z','z');

  });
  it('render_mapping', function () {
    var render = require('../render_mapping');
    assert.deepEqual(
        render('text/x-markdown'),
        {
          "pattern":"text/x-markdown",
          "component":"markdown",
          "load":"raw",
          "icon":"file-text-o"});
  });
});