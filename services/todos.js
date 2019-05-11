'use strict'

const todos = [
	{
		id: 0,
		text: "Take out the trash",
		description: "Remember to take out the trash at 8 pm!",
		status: "todo"
	},
	{
		id: 1,
		text: "Purchase train ticket",
		description: "Buy the train ticket to Bologna.",
		status: "done"
	},
	{
		id: 2,
		text: "Call landlord",
		description: "Call the landlord and ask him about getting a new mattress.",
		status: "todo"
	}]

module.exports = function (fastify, opts, next) {
	fastify.get('/todos', function (request, reply) {
		reply.send(todos)
	})

	fastify.post('/todos', function (request, reply) {
		todos.push({
			id: todos.map(it => it.id).reduce((prev, next) => Math.max(prev, next) + 1),
			text: request.body.text,
			status: request.body.status || "todo",
		})
		reply.notify(todos)
		reply.send(200)
	})

	fastify.put('/todos/:id', function (request, reply) {
		const todo = request.body
		const index = todos.findIndex(it => it.id === +request.params.id)
		if (index === -1) return reply.send(404)
		todos[index] = todo
		reply.notify(todo)
		reply.notifyParent(todos)
		reply.send(200)
	})

	fastify.get('/todos/:id', function (request, reply) {
		const todo = todos.find(it => it.id === +request.params.id)
		if (!todo) return reply.send(404)
		reply.send(todo)
	})

	next()
}