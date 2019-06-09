'use strict'

const listen = require('@filippovigani/listenjs-server')

// Read the .env file.
require('dotenv').config()

// Require the framework
const Fastify = require('fastify')

// Instantiate Fastify with some config
const app = Fastify({
	logger: {
		level: 'debug',
		prettyPrint: true
	},
	pluginTimeout: 10000
})

app.register(require('fastify-cors'), {})

listen.setup({server: app.server})

app.register(require('fastify-url-data'))

app.decorateReply('notify', () => {})
app.decorateReply('notifyParent', () => {})

app.addHook('preHandler', (request, reply, next) => {
	const urlData = request.urlData()
	const path = urlData.path
	reply.notify = function(payload){
		console.log(`Notifying ${path} of updated data!`)
		listen.notify(path, payload)
	}
	reply.notifyDelete = function(){
		console.log(`Notifying ${path} of deleted data!`)
		listen.notify(path, null)
	}
	const parentPath = urlData.path.split('/').slice(0, -1).join('/')
	reply.notifyParent = function(payload){
		console.log(`Notifying ${parentPath} of updated data!`)
		listen.notify(parentPath, payload)
	}
	next()
})

// Register your application as a normal plugin.
app.register(require('./app.js'))

// Start listening.
const port = process.env.PORT || 8000
const address = process.env.ADDRESS || "0.0.0.0"
app.listen(port, address, (err) => {
	if (err) {
		app.log.error(err)
		process.exit(1)
	}
})
console.log(`Listening on ${address}:${port}`)