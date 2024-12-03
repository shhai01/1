const ws = require('nodejs-websocket')
const PORT=8001
const TYPR_ENTER = 0
const TYPR_LEAVE = 1
const TYPR_MESSAGE = 2
let sum=0

const server=ws.createServer(function(conn){
    console.log('New User connected')
    sum++
    conn.UserName = 'User'+String(sum)
    broadcast({
        type:TYPR_ENTER,
        msg:conn.UserName + ' enter the ChatBox',
        time: new Date().toLocaleTimeString()
    })

    conn.on('text',function(data){
        console.log('Get message from user:'+data)
        broadcast({
            type:TYPR_MESSAGE,
            msg:data,
            time: new Date().toLocaleTimeString()
        })
    })

    conn.on('close',function(){
        console.log('Connection closed')
        broadcast({
            type:TYPR_LEAVE,
            msg:conn.UserName + ' leave the ChatBox',
            time: new Date().toLocaleTimeString()
        })
        sum--
    })
    
    conn.on('error',function(){
        console.log('Some error with the connection')
    })
})

function broadcast(msg){
    server.connections.forEach(function(conn){
        conn.send(JSON.stringify(msg))
    });
}

server.listen(PORT,function(){
    console.log('服务器启动，监听端口'+PORT)
})