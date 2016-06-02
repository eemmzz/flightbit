var FlightSocket = function (socket) {
    this.socket = socket;
    this.greetingTimeout;
};

FlightSocket.prototype.getUpdateFromIcao = function (icao24) {
    if (!icao24) { throw new Error('Invalid request'); }
};

FlightSocket.prototype.startGreeting = function () {
    this.greetingTimeout = setInterval(function () {
        this.socket.volatile.emit('greeting', 'Hello world!');
    }.bind(this), 2000);
};

FlightSocket.prototype.disconnect = function () {
    clearInterval(this.greetingTimeout);
};

module.exports = FlightSocket;
