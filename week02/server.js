const http = require('http');
http.createServer(function (req, res) {
    let body = [];
    req.on('error', (e) => {
        console.log(e);
    }).on('data', (chunk) => {
        console.log(chunk, 'data');
        body.push(chunk.toString())
    }).on('end', function () {
        body = body.toString();
        console.log(body, 'body');

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('Hellow word')
    })
}).listen(9000, () => {
    console.log('server on 9000')
});
