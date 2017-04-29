const requestGenerator = require('../requestGenerator');
const config = require('config');
const _ = require('lodash');

async function fetchAllCurrentFlightStates() {
    const options = {
        url: config.get('opensky.url') + '/states/all',
        timeout: config.get('opensky.timeout')
    }

    const results = await requestGenerator.generateHttpGet(options);
    return JSON.parse(results).states;
}

function createCallsignToIcao24Map(flights) {
    const filteredFlights = _.filter(flights, (flight) => {
        return  !_.isNil(flight[1]) &&
                !_.isEmpty(_.trim(flight[1]));
    });

    return _.map(filteredFlights, (flight) => {
        // A dynamic key, the callsign, with icao24 as the value
        const flightIcaoAndNumber = {
            [_.trim(flight[1])]: flight[0]
        }
        return flightIcaoAndNumber;
    } )
}

async function getCurrentFlightsMap() {
    const allFlightsRaw = await fetchAllCurrentFlightStates();
    const mappedFlights = createCallsignToIcao24Map(allFlightsRaw);
    return mappedFlights;
}

module.exports = {
    getCurrentFlightsMap: getCurrentFlightsMap
};
