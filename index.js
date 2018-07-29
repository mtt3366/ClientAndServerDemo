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
    } else if(path === '/pay'){//如果请求的路径是pay,接受script的请求
        var amount = fs.readFileSync('./db','utf-8')
        var newAmount = amount-1;

        if(Math.random()>0.5){//模拟成功或失败
            fs.writeFileSync('./db',newAmount);//成功了就把数据写入数据库

            response.setHeader('Content-Type','applacation/javascript')//设置返回文件类型为javascript
            response.statusCode = 200;//返回码为200,说明成功
            response.write(`${query.callback}.call(undefined,{
                "success":true,
                "left":${newAmount}
            })`)//先获取查询字符串里的callbackName即从前台传过来的回调函数的函数名,然后再执行他,并把函数的参数定为success
        }else{
            response.statusCode = 400;//否则返回码为400,说明失败
            response.write('fail')
        }
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