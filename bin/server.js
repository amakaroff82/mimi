
var httpProxy = require('./node-http-proxy');

var options = {
    changeOrigin: true,
    proxyPaths: [
        '/v1/',
        '/images/',
        '/thumb/'
    ]
}

httpProxy.createServer(80, 'mimi-shop.com.ua', options).listen(3004);