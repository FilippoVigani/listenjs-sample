'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const app = require('fastify')();
const io = require('socket.io')(app.server);

module.exports = function (fastify, opts, next) {
    // Place here your custom code!

    // Do not touch the following lines

    // This loads all plugins defined in plugins
    // those should be support plugins that are reused
    // through your application
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'plugins'),
        options: Object.assign({}, opts)
    })

    // This loads all plugins defined in services
    // define your routes in one of these
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, 'services'),
        options: Object.assign({}, opts)
    })

    //fastify.register(require('fastify-websocket'), {handle})

    /*function handle(stream, updateRequest) {
        console.log(conn)
    }*/

    io.on('connection', function (socket) {
        console.log('Someone just connected!')
        socket.on('message', function (msg) {
            console.log(`Received message ${msg}`);
        });
        socket.on('disconnect', function () {
            console.log('Someone disconnected!')
        });
    });

    // Make sure to call next when done
    next()
}
