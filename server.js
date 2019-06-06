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

listen.setup(app.server)

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
		listen.notifyDeletion(path)
	}
	const parentPath = urlData.path.split('/').slice(0, -1).join('/')
	reply.notifyParent = function(payload){
		console.log(`Notifying ${parentPath} of updated data!`)
		listen.notify(parentPath, payload)
	}
	next()
})

app.addHook('preHandler', (request, reply, next) => {
	const urlData = request.urlData()
	const path = urlData.path.split('/').slice(0, -1).join('/')
	reply.notifyParent = function(payload){
		console.log(`Notifying ${path} of updated data!`)
		listen.notify(path, payload)
	}
	next()
})

// Register your application as a normal plugin.
app.register(require('./app.js'))

// Start listening.
app.listen(process.env.PORT || 8000, (err) => {
	if (err) {
		app.log.error(err)
		process.exit(1)
	}
})