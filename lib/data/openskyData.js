const config = require('config');
const _ = require('lodash');

const NodeCache = require( "node-cache" );
const cache = new NodeCache( { stdTTL: 10 } );

let requestGenerator = require('../requestGenerator');

async function fetchAllCurrentFlightStates() {
        const flightData = cache.get('all-flights');

        if (flightData === undefined) {
            console.log('Cache miss for all-flights');

            try {
                const options = {
                    url: `${config.get('opensky.url')}/states/all`,
                    timeout: config.get('opensky.timeout'),
                    name: config.get('opensky.name')
                }

                const results = await requestGenerator.generateHttpGet(options);
                cache.set('all-flights', results);
                return JSON.parse(results).states;
            }
            catch (error) {
                console.log(`Error ocurred when processing opensky data: ${error}`);
                return [];
            }
        } else {
            console.log('Cache hit for all-flights');
            return JSON.parse(flightData).states;
        }
}

function createCallsignToIcao24Map(flights) {
    const filteredFlights = _.filter(flights, (flight) => {
        return  !_.isNil(flight[1]) &&
                !_.isEmpty(_.trim(flight[1]));
    });

    return _.map(filteredFlights, (flight) => {
        // A dynamic key, the callsign, with icao24 as the value
        return {
            [_.trim(flight[1])]: flight[0]
        };
    })
}

async function getCurrentFlightsMap() {
    const allFlightsRaw = await fetchAllCurrentFlightStates();
    const mappedFlights = createCallsignToIcao24Map(allFlightsRaw);
    return mappedFlights;
}

module.exports = {
    getCurrentFlightsMap: getCurrentFlightsMap
};
