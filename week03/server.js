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
        res.write(`
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                
                <body>
                    <div class="wrapper" data-meta='meta'>
                        <p>
                            <span>hellow word</span>
                        </p>
                    </div>
                </body>
            </html>
        `)
    })
}).listen(9000, () => {
    console.log('server on 9000')
});
