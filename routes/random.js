const config = require('config');
const openskyData = require('./../lib/data/openskyData');
const _ = require('lodash');

module.exports = (req, res, next) => {
    openskyData.getCurrentFlightsMap().then((result) => {
        const randomFlightIndex = _.random(0, result.length - 1);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result[randomFlightIndex]));
    })
};
