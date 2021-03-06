var optimist = require('optimist');

var options = optimist.usage('Run webdata server\nUsage: $0')
    .describe('h', 'Display the usage')
      .alias('h', 'help')
    .describe('p', 'a port to listen').default('p',7532)
      .alias('p', 'port')
    .describe('s','shutdown server').boolean('s')
      .alias('s', 'shutdown')
    .describe('d','a directory to publish').default('d','.')
      .alias('d','dir');

var argv = options.argv;

if (argv._.length > 0){
  console.log("Unknown options:", argv._ );
  argv.help = true;
}
if (argv.help) {
  optimist.showHelp();
  process.exit(0);
}

var http = require('http');
var req = http.request({
    hostname: 'localhost', port: argv.port, path: '/.pid'
  },function (res){
    var pid = '';
    res.on('data', function (chunk) {
      pid += chunk;
    });
    res.on('end', function () {
      console.log('sending SIGINT to:',pid);
      process.kill(pid, 'SIGINT');
      setTimeout( start_server, argv.shutdown ? 10 : 1000);
    });
  }
);

req.on('error', start_server);
req.end();

function start_server (){
  if(argv.shutdown){
    process.exit(0);
  }
  var app = require('./app')(argv.dir);

  var server = app.listen(argv.port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Webdata app is listening: http://%s:%s', host, port);
  });

  process.on('SIGINT', function() {
    console.log('shutdown');
    server.close();
    process.exit(0)
  });
}

