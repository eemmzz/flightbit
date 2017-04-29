const request = require('request');
const config = require('config');
const _ = require('lodash');

async function fetchAllCurrentFlightStates() {
    const options = {
        url: config.get('opensky.url') + '/states/all',
        timeout: 2000
    }

    return await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(new Error('Error occurred fetching open sky data'));
            }
        });
    }).then((result) => {
        // opensky returns an array of arrays
        return JSON.parse(result).states;
    }).catch((error) => {
        console.log(error);
        return [];
    })
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
}
