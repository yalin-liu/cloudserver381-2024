var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.get('/perimeter', function(req,res) {
    let perimeter = req.query.length * 4;
    res.render('results',{answer: perimeter});
});

app.get('/area', function(req,res) {
    let area = req.query.length * req.query.length;
    res.render('results',{answer: area});
});

app.listen(app.listen(process.env.PORT || 8099));
