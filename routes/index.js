const config = require('config');
const request = require('request');
const openskyData = require('./../lib/data/openskyData');

module.exports = (req, res, next) => {
    openskyData.getCurrentFlightsMap().then(() => {
        res.render('index', { title: 'Welcome to Flightbit' });
    })
};
