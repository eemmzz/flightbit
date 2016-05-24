var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

    path = require('path'),
    logger = require('morgan'),
    index = require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

io.on('connection', function (socket) {
    var helloWorld = setInterval(function () {
        socket.volatile.emit('greeting', 'Hello world!');
    }, 2000);

    socket.on('disconnect', function () {
        clearInterval(helloWorld);
    });
});

// Catch 404s and pass onto error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
              message: err.message,
              error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
        res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = { app: app, server: server };
