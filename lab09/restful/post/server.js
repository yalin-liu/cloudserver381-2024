const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
// the statement `extended: true` precises that the req.body object will contain values of any type instead of just strings.
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', (req,res) => {
    res.status(200).write('Reecived POST request\n');
    res.write(`Request body: ${JSON.stringify(req.body)}\n`);
    res.write(`name: ${req.body.name}\n`);
    res.end(`age: ${req.body.age}\n`);
});

app.listen(process.env.PORT || 8099);
