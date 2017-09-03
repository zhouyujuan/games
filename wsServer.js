var app = require('http').createServer();
var io = require('socket.io')(app);

var PORT = 3000;

app.listen(PORT);

//客户端的计数
var clientCount = 0;

//用来存储客户端的socket
var socketMap = {};

var bindListener = function(socket, event) {
    socket.on(event, function(data) {
        if (socket.clientNum % 2 == 0) {
            //有两个人了
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit(event, data);
            }
        } else {
        	if(socketMap[socket.clientNum + 1]){
        		socketMap[socket.clientNum + 1].emit(event, data);
        	}
            
        }
    })
}

io.on('connection', function(socket) {
    clientCount = clientCount + 1;
    // 把clientCount 存储在socket中
    socket.clientNum = clientCount;
    socketMap[clientCount] = socket;
    if (clientCount % 2 == 1) {
        socket.emit('waiting', 'waiting for another persion');
    } else {
        //配对的socket
        if(socketMap[(clientCount - 1)]){
        	socket.emit('start');
        	socketMap[(clientCount - 1)].emit('start');
        }else{
        	socket.emit('leave');
        }
        
    }

    bindListener(socket, 'init');
    bindListener(socket, 'next');
    bindListener(socket, 'rotate');
    bindListener(socket, 'right');
    bindListener(socket, 'down');
    bindListener(socket, 'left');
    bindListener(socket, 'fall');
    bindListener(socket, 'fixed');
    bindListener(socket, 'line');
    bindListener(socket, 'time');
    bindListener(socket, 'lose');
    bindListener(socket, 'bottomLines');
    bindListener(socket, 'addTailLines');


    // socket.on('init', function(data) {
    //     if (socket.clientNum % 2 == 0) {
    //         //有两个人了
    //         socketMap[socket.clientNum - 1].emit('init', data);
    //     } else {
    //         socketMap[socket.clientNum + 1].emit('init', data);
    //     }
    // });

    // socket.on('next', function(data) {
    //     if (socket.clientNum % 2 == 0) {
    //         //有两个人了
    //         socketMap[socket.clientNum - 1].emit('next', data);
    //     } else {
    //         socketMap[socket.clientNum + 1].emit('next', data);
    //     }
    // });
    socket.on('disconnect', function() {
          if (socket.clientNum % 2 == 0) {
            //有两个人了
            if (socketMap[socket.clientNum - 1]) {
                socketMap[socket.clientNum - 1].emit('leave');
            }
        } else {
        	if(socketMap[socket.clientNum + 1]){
        		socketMap[socket.clientNum + 1].emit('leave');
        	}
            
        }

        delete(socketMap[socket.clientNum]);
    });

})

console.log('websocket listening on port' + PORT);