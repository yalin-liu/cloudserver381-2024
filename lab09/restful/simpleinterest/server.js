const express = require('express');
const app = express();

app.set('view engine', 'ejs');

// curl -v -X GET localhost:8099/simpleinterest/10000/0.01/10
// curl -H "accept: application/json" -v -X GET "localhost:8099/simpleinterest/10000/0.01/10"
app.get('/simpleinterest/:principal/:rate/:time', function(req,res) {
	let r = new SimpleInterest(Number(req.params.principal), Number(req.params.rate), Number(req.params.time));
	if (req.headers['accept'] == 'application/json') {		
		res.status(200).json(r);
	} else {
		res.status(200).render('result',{result:r});
	}
});

class SimpleInterest {
	constructor(p,r,t) {
		this.principal = p;
		this.rate = r;
		this.time = t;
		this.interest = p * r * t;
	}
}

app.listen(process.env.PORT || 8099);
