var http = require('http')
var fs = require('fs')
var url = require('url')

var port = process.env.PORT || 8888;

var server = http.createServer(function (request, response) {

    var temp = url.parse(request.url, true)
    var path = temp.pathname
    var query = temp.query
    var method = request.method

    //从这里开始看，上面不要看

    if (path === '/') {  // 如果用户请求的是 / 路径
        var string = fs.readFileSync('./index.html')  // 就读取 index.html 的内容
        var amount = fs.readFileSync('./db','utf-8')//****从数据库(db文件)同步读取数据,放到amount变量里
        string = string.toString().replace('&&&amount&&&',amount)//将后台的amount替换为前台的占位符&&&amount&&&

        response.setHeader('Content-Type', 'text/html;charset=utf-8')  // 设置响应头 Content-Type
        response.write(string)   // 设置响应消息体
        response.end();
    } else if (path === '/style.css') {   // 如果用户请求的是 /style.css 路径
        var string = fs.readFileSync('./style.css')
        response.setHeader('Content-Type', 'text/css')
        response.write(string)
        response.end()
    } else if (path === '/main.js') {  // 如果用户请求的是 /main.js 路径
        var string = fs.readFileSync('./main.js')
        response.setHeader('Content-Type', 'application/javascript')
        response.write(string)
        response.end()
    } else if(path === '/pay' && method.toUpperCase() === 'POST'){//如果请求的路径是pay且方法为post
        var amount = fs.readFileSync('./db','utf-8')
        var newAmount = amount-1;
        fs.writeFileSync('./db',newAmount);
        response.write('success')
        response.end()
    }else {  // 如果上面都不是用户请求的路径
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')  // 设置响应头 Content-Type
        response.write('找不到对应的路径，你需要自行修改 index.js')
        response.end()
    }

    // 代码结束，下面不要看
    console.log(method + ' ' + request.url)
})

server.listen(port)
console.log('监听 ' + port + ' 成功，请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)