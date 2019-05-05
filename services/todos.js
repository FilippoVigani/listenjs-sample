'use strict'

const todos = [
	{
		text: "Take out the trash",
		status: "todo"
	},
	{
		text: "Purchase train ticket",
		status: "done"
	},
	{
		text: "Call landlord",
		status: "todo"
	}]

module.exports = function (fastify, opts, next) {
	fastify.get('/todos', function (request, reply) {
		reply.send(todos)
	})

	fastify.post('/todos', function (request, reply) {
		todos.push({text: request.body.text || "", status: request.body.text || "todo"})
		reply.send(200)
	})

	next()
}