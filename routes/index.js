const config = require('config');
const request = require('request');

module.exports = (req, res, next) => {
    const options = {
        url: config.get('opensky.url'),
        timeout: 2000
    }

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(new Error('Error occurred fetching open sky data'));
            }
        });
    }).then((result) => {
        console.log(result);
        res.render('index', { title: 'Welcome to Flightbit' });
    })
};
