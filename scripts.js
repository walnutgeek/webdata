var fs = require("fs");

function generate_svgs(icons, color) {
  icons.sort();
  var icons_js_file = color + '/icons.js';
  var icons_js_content = '//do not edit or check in. file is automatically generated' +
      '\nmodule.exports = {\n' +
      icons.map(
          function (icon) {
            return "'" + icon + "': require('!!raw!./svg/" + icon + ".svg')";
          }
      ).join(',\n') + '};\n';

  var same = true;
  try {
    var current = fs.readFileSync(icons_js_file);
    if (current != icons_js_content) {
      same = false;
    }
  } catch (e) {
    same = false;
  }
  if (!same) {
    console.log('not same');
    require('font-awesome-svg-png/lib/generate')({
      color: color,
      sizes: '128',
      svg: true,
      png: false,
      icons: icons.join(),
      _: []
    });
    try {
      fs.mkdirSync(color);
    } catch (ignore) {}
    fs.writeFileSync(icons_js_file, icons_js_content);
  }

}
var scripts =  {
  svgs: function(){
    var icons = [
      'eye','eye-slash',
      'home','filter',
      'sort-amount-asc',
      'sort-amount-desc',
      'download'];

    require('wdf-loader');
    require('./render.wdf').getColumn('icon').forEach(function(v){
      if( v && icons.indexOf(v) < 0){
        icons.push(v);
      }
    });
    generate_svgs(icons, 'black');
  }
};
scripts[process.argv[2]].apply({},process.argv.slice(3));