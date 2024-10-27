const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());
// support parsing of application/x-www-form-urlencoded post data
// the statement `extended: true` precises that the req.body object will contain values of any type instead of just strings.
app.use(bodyParser.urlencoded({ extended: true }));

// web services
app.post('/post/', (req,res) => {
    res.status(200).write('Reecived POST request\n');
    res.write(`Request body: ${JSON.stringify(req.body)}\n`);
    res.write(`name: ${req.body.name}\n` + req.body.name);
    res.end(`age: ${JSON.stringify(req.body.age)}\n`);
	// curl -X POST -d 'name=coco&age=10' "localhost:8099/post"
	// curl -H 'Content-Type: application/json' -X POST -d '{"name":"coco","age":10}' "localhost:8099/post"
	// curl --header "Content-Type: application/json" --request POST --data '{"name":"coco","age":10}' "localhost:8099/post"
});

// RESTful services
app.post('/api/post/', (req,res) => {
    res.status(200).type('json').json(req.body).end();
	// curl -X POST -d 'name=coco&age=10' "localhost:8099/api/post"
	// curl -H 'Content-Type: application/json' -X POST -d '{"name":"coco","age":10}' "localhost:8099/api/post"
});

app.listen(process.env.PORT || 8099);
