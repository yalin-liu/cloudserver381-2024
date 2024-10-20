const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get("/", (req,res) => {
	res.status(200).render('index',{title:"Home page"});	
});

app.listen(process.env.PORT || 8099);
