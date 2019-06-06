'use strict'

const appointments = require('../sample-data/appointments')

module.exports = function (fastify, opts, next) {
	fastify.get('/appointments', function (request, reply) {
		reply.send(appointments)
	})

	fastify.post('/appointments', function (request, reply) {
		const appointment = {
			id: appointments.map(it => it.id).reduce((prev, next) => Math.max(prev, next) + 1),
			title: request.body.title,
			startDate: request.body.startDate,
			endDate: request.body.endDate,
			location: request.body.location,
			notes: request.body.notes,
		}
		appointments.push(appointment)
		reply.notify(appointments)
		reply.send(200)
	})

	fastify.put('/appointments/:id', function (request, reply) {
		const appointment = {
			id: +request.params.id,
			title: request.body.title,
			startDate: request.body.startDate,
			endDate: request.body.endDate,
			location: request.body.location,
			notes: request.body.notes,
		}
		const index = appointments.findIndex(it => it.id === +request.params.id)
		if (index === -1) return reply.send(404)
		appointments[index] = appointment
		reply.notify(appointment)
		reply.notifyParent(appointments)
		reply.send(200)
	})

	fastify.delete('/appointments/:id', function (request, reply) {
		const index = appointments.findIndex(it => it.id === +request.params.id)
		if (index === -1) return reply.send(404)
		appointments.splice(index)
		reply.notifyDelete()
		reply.notifyParent(appointments)
		reply.send(200)
	})

	fastify.get('/appointments/:id', function (request, reply) {
		const appointment = appointments.find(it => it.id === +request.params.id)
		if (!appointment) return reply.send(404)
		reply.send(appointment)
	})

	next()
}