const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');

const openskyData = rewire('../../lib/data/openskyData');

describe('openskyData', () => {
    describe('#getCurrentFlights()', () => {
        let rewireResets = [];

        afterEach(() => {
            rewireResets.forEach((reset) => {
                reset();
            })
        });

        it('Should return a key:value map of icao24 and callsign', async () => {
            const mockFlightStatesData = [
                [ 'aa8c39', 'UAL252' ],
                [ 'ac494e', 'N891CS' ]
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

        it('Should trim whitespace from callsigns', async () => {
            const mockFlightStatesData = [
                [ 'aa56db', '  UAL253' ],
                [ 'a086ce', ' UAL540  ' ]
            ];

            rewireResets.push(
                openskyData.__set__('fetchAllCurrentFlightStates', sinon.stub().returns(mockFlightStatesData))
            );

            const expected = [
                { 'UAL253': 'aa56db' },
                { 'UAL540': 'a086ce' }
            ]
            const result = await openskyData.getCurrentFlightsMap();
            
            assert.deepEqual(result, expected);
        });

        it('Should remove flights with null callsigns', async () => {
            const mockFlightStatesData = [
                [ 'a92d6d', 'UAL86' ],
                [ 'ac058a', null ]
            ];

            rewireResets.push(
                openskyData.__set__('fetchAllCurrentFlightStates', sinon.stub().returns(mockFlightStatesData))
            );

            const expected = [
                { 'UAL86': 'a92d6d' }
            ]
            const result = await openskyData.getCurrentFlightsMap();
            
            assert.deepEqual(result, expected);
        });

        it('Should remove flights with empty callsigns', async () => {
            const mockFlightStatesData = [
                [ '4d0102', 'CLX810' ],
                [ 'a086ce', '   ' ],
                [ 'aa8c1b', '' ]
            ];

            rewireResets.push(
                openskyData.__set__('fetchAllCurrentFlightStates', sinon.stub().returns(mockFlightStatesData))
            );

            const expected = [
                { 'CLX810': '4d0102' }
            ]
            const result = await openskyData.getCurrentFlightsMap();
            
            assert.deepEqual(result, expected);
        });

        it('Should return an empty array if an empty result occurrs', async () => {
            const mockRequestGenerator = {
                generateHttpGet: async () => {
                    return await new Promise((resolve) => {
                        resolve('[]');
                    });
                }
            };

            rewireResets.push(
                openskyData.__set__(
                    'requestGenerator',
                   mockRequestGenerator
                )
            );

            const expected = []
            const result = await openskyData.getCurrentFlightsMap();

            assert.deepEqual(result, expected);
        });
    });
});
