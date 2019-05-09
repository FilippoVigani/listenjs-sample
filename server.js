'use strict'

const util = require('util')

// Read the .env file.
require('dotenv').config()

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const app = Fastify({
	logger: true,
	pluginTimeout: 10000
})

const io = require('socket.io')(app.server)

io.on('connection', function (socket) {
	console.log(`Someone just connected!`)

	socket.emit('message', 'Welcome!')

	socket.on('disconnect', function () {
		console.log('Someone disconnected!')
	})
})

app.register(require('fastify-url-data'))

app.decorateReply('notify', () => {})
app.decorateReply('notifyParent', () => {})

app.addHook('preHandler', (request, reply, next) => {
	const urlData = request.urlData()
	const path = urlData.path
	reply.notify = function(payload){
		console.log(`Notifying ${path} of updated data!`)
		io.of(path).emit('update', payload)
	}
	next()
})

app.addHook('preHandler', (request, reply, next) => {
	const urlData = request.urlData()
	const path = urlData.path.split('/').slice(0, -1).join('/')
	reply.notifyParent = function(payload){
		console.log(`Notifying ${path} of updated data!`)
		io.of(path).emit('update', payload)
	}
	next()
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