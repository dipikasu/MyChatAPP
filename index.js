//Node server which will handle socket io connections
const io = require('socket.io')(8000) //io initialize http instance will listen the incoming events
const users = {};
io.on('connection', socket => { //socket.io instance which listen multiple socket io (ex:dipika,sayu) connect
    socket.on('new-user-joined', name => { //particular connection handle by socket.on
        // console.log("New user", name)
        users[socket.id] = name; //username who just joint 
        socket.broadcast.emit('user-joined', name); //new user will join and its name will broadcast all other join user
    });
    //If someone sends a message, Broadcast it to others
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
                message: message,
                name: users[socket.id]
            })
            //If someone leaves the chat , let other know
        socket.on('disconnect', message => {
            socket.broadcast.emit('left', users[socket.id]);
            delete users[socket.id];
        });
    }); //when someone send msg it will handle by socket.broadcast to all connection

})