var FlightSocket = function (socket) {
    this.socket = socket;
    this.helloWorld;
};

FlightSocket.prototype.greet = function () {
    this.helloWorld = setInterval(function () {
        this.socket.volatile.emit('greeting', 'Hello world!');
    }.bind(this), 2000);
};

FlightSocket.prototype.disconnect = function () {
    clearInterval(this.helloWorld);
};

module.exports = FlightSocket;
