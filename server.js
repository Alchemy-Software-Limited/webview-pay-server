const db_connect = require('./db/connection')
const app = require('./app')
const http = require('http')
const httpServer = http.createServer(app)
const config = require('./config/index')
const { getSubscription } = require('./lib/customer')

db_connect &&
    httpServer.listen(config.db_port, async () => {
        console.log('Server is listening to port: ', config.db_port)
    })

// Initialize Socket.IO after the server starts listening
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})
io.on('connection', function (socket) {
    socket.on('get:subscription', async (data) => {
        const subscription = await getSubscription(data)
        const userInfo = {
            ...data,
            subscription,
        }
        io.emit(`user:subscription:${userInfo.email}`, userInfo)
    })
    socket.on('unsubscribe', (data) => {
        io.emit(`user:unsubscribe:${data.data.email}`, { ...data.data })
    })
})
