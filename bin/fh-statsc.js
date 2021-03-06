var os = require('os');
var fhstats = require('stats');

// fh-stat settings
var stats_host = 'localhost';
var stats_port = 8145;
var stats_enabled = true;

var prefix = process.argv[2] || "test";
var stats = fhstats.FHStats({host: stats_host, port: stats_port, enabled: stats_enabled});

stats.inc(prefix + '_counter', function (err, bytes) {
  if (err) {
    console.log('ERROR: ', err);
  }
  console.log('called back with ', bytes);
  stats.timing(prefix + '_timer', Math.floor(Math.random()*51) + 50, function (err2, bytes2) {
    if (err2) {
      console.log('ERROR: ', err2);
    }
    console.log('called back with ', bytes2);

    stats.gauge(prefix + '_memory', (os.totalmem() - os.freemem())/os.totalmem()*100, function (err2, bytes2) {
      if (err2) {
        console.log('ERROR: ', err2);
      }
      console.log('called back with ', bytes2);
      stats.gauge(prefix + '_cpu_load', os.loadavg()[0], function (err2, bytes2) {
        if (err2) {
          console.log('ERROR: ', err2);
        }
        console.log('called back with ', bytes2);
        stats.close();
      });
    });
  });
});

// jshint ignore:start
function get_cpu_idle() {
  var idle = 0;
  var cpus = os.cpus();
  var i, len;
  for (i=0, len = cpus.length; i < len; i += 1) {
    var cpu = cpus[i];
    var total = cpu.times.sys + cpu.times.idle + cpu.times.user + cpu.times.nice + cpu.times.irq;
    idle += (cpu.times.idle/total*100);
  }
  idle = idle / cpus.length;
  return idle;
}
// jshint ignore:end



