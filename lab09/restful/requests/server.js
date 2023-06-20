const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

// RESTful resource: users
var users = [
	{name: 'mary', age: 18},
	{name: 'peter', age: 20}
]

// Path 0
app.get('/', function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	res.status(200).end('Connection closed');
});

// Path 1
// curl -X GET localhost:8099/users/name/peter
app.get('/users/name/:name', function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('name: ' + req.params.name);
	let results = users.filter((user) => {
		return user.name == req.params.name;
	});
	res.status(200).type('json').json(results).end();
});

// Path 2
// curl -X GET localhost:8099/users/age/20
app.get('/users/age/:age', function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('age: ' + req.params.age);
	let results = users.filter((user) => {
		return user.age == req.params.age;
	});
	res.status(200).type('json').json(results).end();
});

// Path 3
// curl -X GET localhost:8099/users/name/peter/age/20
app.get('/users/name/:name/age/:age', function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('name: ' + req.params.name);
	console.log('age: ' + req.params.age);
	let results = users.filter((user) => {
		return (user.age == req.params.age &&
		        user.name == req.params.name);
	});
	res.status(200).type('json').json(results).end();
});

// Path 4
// curl -X DELETE localhost:8099/users/name/peter
app.delete('/users/name/:name', function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('name: ' + req.params.name);
	let results = users.filter((user) => {
		return (user.name != req.params.name);
	});
	users = results;
	res.status(200).type('json').json(users).end();
});

// Path 5
// curl -H "Content-Type: application/json" -X POST -d '{"name":"peter","age": 20}' localhost:8099/users
app.post('/users',function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('name: ' + req.body.name);
	console.log('age: ' + req.body.age);
	let newUser = {};
	newUser['name'] = req.body.name;
	newUser['age'] = req.body.age;
	users.push(newUser);
	res.status(200).type('json').json(users).end();
});

// Path 6
// curl -H "Content-Type: application/json" -X PUT -d '{"name":"peter","age": 10}' localhost:8099/users/name/peter
app.put('/users/name/:name',function(req,res) {
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('name: ' + req.body.name);
	console.log('age: ' + req.body.age);
	users.forEach((user) => {
		if (user.name == req.params.name) {
			user.name = req.body.name;
			user.age = req.body.age;
		}
	})
	res.status(200).type('json').json(users).end();
});

app.listen(process.env.PORT || 8099);
