const express = require('express');
const app = express();
const server = require('http').Server(app);
const path = require('path');
const logger = require('morgan');

const index = require('./routes/index');
const random = require('./routes/random');
const io = require('socket.io')(server);
const FlightSocket = require('./lib/socket/flightSocket.js');

app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index);
app.get('/random', random);

io.on('connection', (socket) => {
    var flightSocket = new FlightSocket(socket);
    flightSocket.startGreeting();

    socket.on('disconnect', function () {
        flightSocket.disconnect();
    });
});

// Catch 404s and pass onto error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = { app: app, server: server };
