const express = require('express');
const app = express();

app.set('view engine', 'ejs');

class SimpleInterest {
	constructor(p,r,t) {
		this.principal = p;
		this.rate = r;
		this.time = t;
		this.interest = p * r * t;}
}

// Web services
app.get('/simpleinterest', function(req,res) {
	let r = new SimpleInterest(Number(req.query.principal), Number(req.query.rate), Number(req.query.time));
	if (req.headers['accept'] == 'application/json') {		
		res.status(200).type('json').json(r).end();
		// provide a json response 
		// curl -H "accept: application/json" "localhost:8099/simpleinterest?principal=10000&rate=0.01&time=10"
	} else {
		res.status(200).render('result',{result:r}).end();
		// provide an EJS response 
		// curl localhost:8099/simpleinterest?principal=10000&rate=0.01&time=10
	}
});

// RESTful services
app.get('/api/simpleinterest/:principal/:rate/:time', function(req,res) {
	let r = new SimpleInterest(Number(req.params.principal), Number(req.params.rate), Number(req.params.time));
	res.status(200).type('json').json(r).end();
	// provide a json result
	// curl "localhost:8099/api/simpleinterest/10000/0.01/10"
});

app.listen(process.env.PORT || 8099);
