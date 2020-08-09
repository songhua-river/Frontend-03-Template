const net = require('net');
const { throws } = require('assert');
class Request {
    constructor(options) {
        this.method = options.method || 'GET'
        this.host = options.host
        this.port = options.port || 80
        this.path = options.path || '/'
        this.body = options.body || {}
        this.headers = options.headers || {};
        if (!this.headers['Content-type']) {
            this.headers['Content-type'] = 'application/x-www-form-urlencoded'
        }
        if (this.headers['Content-type'] === 'application/json') {
            this.bodyText = JSON.stringify(this.body);
        } else if (this.headers['Content-type'] === 'application/x-www-form-urlencoded') {
            this.bodyText = Object.keys(this.body).map(key => `${key}=${this.body[key]}`).join('&')
        }
        this.headers['Content-length'] = this.bodyText.length;
    }
    toString() {
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
    }
    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParse()
            if (connection) {
                connection.write(this.toString())
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    console.log(this.toString())
                    connection.write(this.toString())
                })
            }
            connection.on('data', data => {
                console.log(data.toString());
                parser.recevie(data.toString());
                if (parser.isFinished) {
                    resolve(parser.response)
                    connection.end()
                }
                connection.end()
            })
            connection.on('error', (error) => {
                console.log('error');
                reject(error)
            })
        })
    }
}

class ResponseParse {
    constructor() {
        // 解析相应行 响应头的字符串
        this.WAITING_STATUS_LINE = 0//接收到/r 的状态
        this.WAITING_STATUS_LINE_END = 1//接收到/n 的状态
        this.WAITING_HEADER_NAME = 2//header name
        this.WAITING_HEADER_SPACE = 3//header 等待空格的状态
        this.WAITING_HEADER_VALUE = 4
        this.WAITING_HEADER_LINE_END = 5
        this.WAITING_HEADER_BLOCK_END = 6
        this.WAITING_BODY = 7
        this.WAITING_STATUS_CODE_START = 8
        this.WAITING_STATUS_CODE_END = 9

        this.current = this.WAITING_STATUS_LINE //初始化状态
        this.statusLine = ''
        this.headers = {}
        this.headerName = ''
        this.headerValue = ''
        this.statusCode = ''
        this.bodyParser = null;
    }
    recevie(string) {
        for (let i = 0; i < string.length; i++) {
            this.recevieChar(string[i])
        }
    }
    get isFinished() {
        return this.bodyParser && this.bodyParser.Finished
    }
    get response() {
        this.statusLine.match(/HTTP\/1.1 ([0-9])+ ([\s\S]+)/)
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    recevieChar(char) {
        if (this.current === this.WAITING_STATUS_LINE) {
            if (char === ' ') {
                this.current = this.WAITING_STATUS_CODE_START
            } else if (char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END
            } else {
                this.statusLine += char
            }
        } else if (this.current === this.WAITING_STATUS_CODE_START) {
            if (char === ' ') {
                this.current = this.WAITING_STATUS_CODE_end
            }
            this.statusCode += char
            this.statusLine += char
        }
        else if (this.current = this.WAITING_STATUS_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current = this.WAITING_HEADER_NAME) {
            if (char === ':') {
                this.current = this.WAITING_HEADER_SPACE
            } else if (char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END
                if (this.headers['Transfer-Encoding'] === 'chunked') {
                    this.bodyParser = new TrunkBodyParser()
                }
            } else {
                this.headerName += char
            }
        } else if (this.current = this.WAITING_HEADER_SPACE) {
            if (char === ' ') {
                this.current = this.WAITING_HEADER_VALUE
            }
        } else if (this.current === this.WAITING_HEADER_VALUE) {
            if (char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END
                this.headers[this.headerName] = this.headerValue
                this.headerName = ''
                this.headerValue = ''
            } else {
                this.headerValue += char
            }
        } else if (this.current === this.WAITING_HEADER_LINE_END) {
            if (char === '\n') {
                this.current = this.WAITING_HEADER_NAME
            }
        } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
            if (char === '\n') {
                this.current = this.WAITING_BODY
                this.bodyParser.recevieChar(char)
            }
        }
    }
}

class TrunkBodyParser {
    constructor() {
        this.WAITING_LENGTH = 0 //一个十六进制数字开头
        this.WAITING_LENGTH_LINE_END = 1 // 
        this.READY_CHUNK = 2
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4
        this.length = 0;
        this.content = []
        this.Finished = false;
        this.current = this.WAITING_LENGTH
    }
    recevieChar(char) {
        if (this.current === this.WAITING_LENGTH) {
            if (this.char === '\r') {
                if (this.length === 0) {
                    this.Finished = true
                }
                this.current = this.WAITING_LENGTH_LINE_END

            } else {
                this.length *= 16;
                this.length += parseInt(char, 16)
            }
        } else if (this.current === this.WAITING_LENGTH_LINE_END) {
            if (char === '\n') {
                this.current = this.READY_CHUNK
            }
        } else if (this.current === this.READY_CHUNK) {
            this.content.push(char)
            this.length--
            if (this.length === 0) {
                this.current = this.WAITING_NEW_LINE
            }
        } else if (this.current === this.WAITING_NEW_LINE) {
            if (char === '\r') {
                this.current === this.WAITING_NEW_LINE_END
            }
        } else if (this.current === this.WAITING_NEW_LINE_END) {
            if (char === '\n') {
                this.current === this.WAITING_LENGTH
            }
        }
    }

}

void async function () {
    const request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: 9000,
        path: '/',
        headers: {
            ['X-foo2']: 'customed'
        },
        body: {
            name: 'winter'
        }
    })
    let response = await request.send()
    console.log(response)
}()