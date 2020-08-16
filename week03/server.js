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

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
            <html lang="en">
                <style>
                    body div #myid {
                        width: 100px;
                        background-color: #ff5000;
                    }
                    body div img {
                        width: 10px;
                        background-color: #ff1111;
                    }
                    .class1 {
                        height: 20px;
                    }
                    .class2 {
                        width: 10px;
                    }
                </style>
                <head>
                    <meta charset="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <title>Document</title>
                </head>
                
                <body>
                    <div class="wrapper" data-meta='meta'>
                        <p>
                            <span>hellow word</span>
                        </p>
                        <div>
                            <img id="myid"/>
                        </div>
                        <input type='text' />
                    </div>
                </body>
            </html>
        `)
    })
}).listen(9000, () => {
    console.log('server on 9000')
});
