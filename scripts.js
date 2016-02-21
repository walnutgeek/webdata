var scripts =  {
  svgs: function(){
    require('wdf-loader');
    var icons = [ 'eye','eye-slash','filter','sort-amount-asc','sort-amount-desc','home'];
    require('./render.wdf').getColumn('icon').forEach(function(v){
      if( v && icons.indexOf(v) < 0){
        icons.push(v);
      }
    });
    icons.sort();
    var icons_js_content = '//do not edit or checkin, automatically generated' +
        '\n module.exports = {' +
        icons.map(function(icon){
          return "'"+icon+"': require('./white/svg/"+ icon+".svg')");
        }).join() + '};'
    require('font-awesome-svg-png/lib/generate')({
      color: 'white',
      sizes: '128',
      svg: true,
      png: false,
      icons: icons.join() ,
      _: []
    });
  },
};
scripts[process.argv[2]].apply({},process.argv.slice(3));