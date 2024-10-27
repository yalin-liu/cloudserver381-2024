const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req,res,next) => {  // logger middleware
	console.log('Date and time: ' + Date(Date.now()).toString());
	console.log('Incoming request: ' + req.method);
	console.log('Path: ' + req.path);
	console.log('Request body: ', req.body);
	console.log('name: ' + req.params.name);
	next();
})

// RESTful databse: users
var users = [
	{name: 'mary', age: 18},
	{name: 'peter', age: 20}
]

// RESTful services: READ ~ GET
app.get('/api/users',function(req,res) { // 0 - database resource - api/users
	res.status(200).type('json').json(users).end();
	// curl "localhost:8099/api/users"
});

app.listen(process.env.PORT || 8099);
