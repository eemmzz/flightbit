const config = require('config');
const request = require('request');
const openskyData = require('./../lib/data/openskyData');

module.exports = (req, res, next) => {
    openskyData.getCurrentFlightsMap().then((result) => {
        const viewData = {
            title: 'Welcome to Flightbit',
            data: JSON.stringify(result)
        }
        res.render('index', viewData);
    })
};
