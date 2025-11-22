const express = require('express')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 4000

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id)

  socket.on('join-room', (room) => {
    console.log(`Socket ${socket.id} joining room ${room}`)
    socket.join(room)
    // notify others in room
    socket.to(room).emit('user-connected', socket.id)
  })

  socket.on('signal', (data) => {
    // data: { to, signal }
    if (data && data.to) {
      io.to(data.to).emit('signal', { from: socket.id, signal: data.signal })
    }
  })

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id)
    // notify others - broadcast to all rooms
    socket.broadcast.emit('user-disconnected', socket.id)
  })

  socket.on('ambulance-book', (payload) => {
    console.log('Ambulance booking received:', payload)
    // emit to all admins or interested parties; for demo, broadcast
    io.emit('ambulance-booked', { booking: payload, id: Date.now() })
  })
})

app.get('/', (req, res) => {
  res.send('Signaling server running')
})

server.listen(PORT, () => {
  console.log(`Signaling server listening on http://localhost:${PORT}`)
})
