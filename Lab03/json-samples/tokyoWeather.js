const http = require('http');
const APIKEY='';       //**your API key***
const options = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?q=Tokyo,jp&units=metric&APPID=' + APIKEY,
    method: 'GET'
};

const req = http.request(options, (res) => {
    res.on('data', (data) => {
        var jsonObj = JSON.parse(data); // convert from string to json object
        console.log(jsonObj);
        if (res.statusCode == 200) {
            console.log(`Tokyo is located at [${jsonObj.coord.lon},${jsonObj.coord.lat}]`);
        } else {
            console.log(`Request failed. HTTP response code = ${res.statusCode}`);
        }
    });
});

req.on('error', (error) => {
    console.log(`Problem with request: ${error.message}`);
});

req.end();