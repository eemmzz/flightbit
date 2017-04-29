const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');

const openskyData = rewire('../../lib/data/openskyData');

describe('openskyData', () => {
    let rewireResets = [];

    describe('#getCurrentFlights()', () => {
        after(() => {
            rewireResets.forEach((reset) => {
                reset();
            })
        });

        it('Should return a key:value map of icao24 and callsign', async () => {
            const mockFlightStatesData = [
                [ "aa8c39", "UAL252" ],
                [ "ac494e", "N891CS" ]
            ];

            rewireResets.push(
                openskyData.__set__('fetchAllCurrentFlightStates', sinon.stub().returns(mockFlightStatesData))
            );

            const expected = [
                { 'UAL252': 'aa8c39' },
                { 'N891CS': 'ac494e' }
            ]
            const result = await openskyData.getCurrentFlightsMap();
            
            assert.deepEqual(result, expected);
        });
    });
});
