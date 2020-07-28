const app = require('./app')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMessage} = require('./utils/messages')
const {getUser, getUsersInRoom, addUser, removeUser} = require('./utils/users')

const port = process.env.PORT || 3000
const server = http.createServer(app)
const io = socketio(server)


io.on('connection', (socket)=>{
   

    socket.on('join', ({username, room}, callback) =>{
        
        const {error, user} = addUser({id:socket.id, username, room})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
         //only this client
        socket.emit('message', generateMessage("Admin",`Welcome ${user.username}!`))

        // all clients exclude himself
        socket.broadcast.to(user.room).emit('message',generateMessage("Admin", `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users:getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
       if(filter.isProfane(message)){
           return callback('Bad words is not allowed!')
       }
        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation',(location, callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username, location) )
        callback()
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message', generateMessage("Admin", `${user.username} has left this room!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users:getUsersInRoom(user.room)
            })
        }
       
    })
})


server.listen(port, ()=>{
    console.log('Server is listening to port %d',port)
})