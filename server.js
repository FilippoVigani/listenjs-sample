'use strict'

const io = require('socket.io')

// Read the .env file.
require('dotenv').config()

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const app = Fastify({
    logger: true,
    pluginTimeout: 10000
})

const socket = io(app.server)

socket.on('connection', function (socket) {
	console.log('Someone just connected!')

	socket.emit('message', 'Benvenuto!')

	socket.on('message', function (msg) {
		console.log(`Received message ${msg}`)
	})
	socket.on('disconnect', function () {
		console.log('Someone disconnected!')
	})
})

// Register your application as a normal plugin.
app.register(require('./app.js'))

// Start listening.
app.listen(process.env.PORT || 3000, (err) => {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
})