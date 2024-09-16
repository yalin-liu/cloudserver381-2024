const express = require('express');
const app = express();

const cafes = [
	{name: 'Pacific Coffee', address: '30 Good Shepherd Street', seats: 30, id:'001'},
	{name: 'Starbucks', address: '1 Victory Road', id:'002'},
	{name: 'UCC Cafe', address: 'New Town Plaza', seats: 120, 'id': '003'}
];

app.set('view engine', 'ejs');

app.get("/read", (req,res) => {
	res.status(200).render("table", {c: cafes});	
});

app.listen(process.env.PORT || 8099);
