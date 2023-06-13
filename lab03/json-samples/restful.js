/*
jsonplaceholder.typicode.com gives you error if you send frequet requests!
*/
const http = require('http');
const options = {
    host: 'jsonplaceholder.typicode.com',
    port: 80,
    path: '/users',
    method: 'GET'
};

const req = http.request(options, (res) => {
    res.on('data', (data) => {
        var jsonObj = JSON.parse(data); // convert from string to json object
        console.log(jsonObj);
        if (res.statusCode == 200) {
            console.log(`There are ${jsonObj.length} users`);
            for (let user of jsonObj) {
                console.log(user.name);
            }
        } else {
            console.log(`Request failed. HTTP response code = ${res.statusCode}`);
        }
    });
});

req.on('error', (error) => {
    console.log(`Problem with request: ${error.message}`);
});

req.end();