var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

const FILE_LOCATION = 'name=[name].[ext]';

function abs_dir(r) {
  return path.resolve(__dirname, r);
}

function url_loader(mime) {
  return 'url?limit=10000&' + FILE_LOCATION +
      '&minetype=' + mime;
}

var name = 'webdata';

function cfg(entry_point, out_file) {
  var c = {
    entry: entry_point,
    output: {
      path: abs_dir('app'),
      filename: out_file,
      publicPath: "/.app/",
      library: name
    },
    devtool: "source-map",
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loaders: ['jshint'],
          include: ["web"].map(abs_dir)
        }
      ],
      loaders: [
        { test: /.jsx$/,
          loader: 'babel',
          exclude: /node_modules/,
          query: { presets: ['es2015', 'react','stage-1'] } },
        { test: /\.js$/,
          loader: "uglify" },
        { test: /\.css$/,
          loader: 'style?minimize!css' },
        { test: /\.scss$/,
          loader: 'style?minimize!css!sass?sourceMap' },
        { test: /\.(png|jpg)$/,
          loader: 'file?' + FILE_LOCATION},
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: url_loader("image/svg+xml")},
        { test: /\.html?$/,
          loader: 'raw'},
        { test: /\.wdf$/,
          loader: 'wdf'},
        { test: /\.json$/,
          loader: 'json'},

      ],
    },
    plugins: [
      new webpack.IgnorePlugin(/jsdom/),
      new CopyWebpackPlugin([
        {from: 'web/tests.html'},
        {from: 'web/index.html'},
      ])
    ]
  };
  return c;
}

module.exports = [
  cfg("./web/index.jsx",       name + ".js"),
  cfg("mocha!./web/tests.js", "testBundle.js")
];