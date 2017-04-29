const request = require('request');

async function generateHttpGet(options) {
    return await new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body);
            } else {
                reject(new Error(`Error occurred fetching ${options.name} data`));
            }
        });
    }).then((result) => {
        return result;
    }).catch((error) => {
        console.log(error);
        return [];
    })
}

module.exports = {
    generateHttpGet: generateHttpGet 
};
