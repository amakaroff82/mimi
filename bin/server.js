
var httpProxy = require('./node-http-proxy');

var options = {
  changeOrigin: true,
  target: {
    https: true
  }
}

httpProxy.createServer(443, 'test.moduleq.com', options).listen(3004);