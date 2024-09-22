const http = require('http');
const APIKEY='';//**your API key***
const options = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?q=Tokyo,jp&units=metric&APPID=' + APIKEY,
    method: 'GET'
};

const req = http.request(options, (res) => {
    res.on('data', (data) => {
		console.log(`${data}`);
    });
});

req.on('error', (error) => {
    console.log(`Problem with request: ${error.message}`);
});

req.end();
