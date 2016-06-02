var assert = require('assert'),
    sinon = require('sinon'),
    FlightSocket = require(__dirname + '/../../socket/flightSocket');

describe('Flight Socket', function () {
    var socketStub = {
        volatile: {
            emit: sinon.spy()
        }
    },
    flightSocket,
    greetingTimeoutTimeMs = 2000;

    afterEach(function () {
        socketStub.volatile.emit.reset();
    });

    describe('startGreeting()', function () {
        var clock;

        beforeEach(function () {
            clock = sinon.useFakeTimers();
        });

        afterEach(function () {
            clock.restore();
        });

        it('should emit a hello world after ' + greetingTimeoutTimeMs + ' ms', function () {
            var flightSocket = new FlightSocket(socketStub);
            flightSocket.startGreeting();
            clock.tick(greetingTimeoutTimeMs + 1);
            flightSocket.disconnect();
            assert(
                flightSocket.socket.volatile.emit.calledOnce,
                'Expected emit to be called once'
            );
        });

        it('should emit a second hello world after another ' + greetingTimeoutTimeMs + ' ms', function () {
            var flightSocket = new FlightSocket(socketStub);
            flightSocket.startGreeting();
            clock.tick((greetingTimeoutTimeMs * 2) + 1);
            flightSocket.disconnect();
            assert(
                flightSocket.socket.volatile.emit.calledTwice,
                'Expected emit to be called twice'
            );
        });
    });

    describe('getUpdateFromIcao()', function () {
        it('should return an error when no parameter specified', function () {
            var flightSocket = new FlightSocket(socketStub);
            assert.throws(
                function () { flightSocket.getUpdateFromIcao() },
                Error
            );
        });
    });
});
