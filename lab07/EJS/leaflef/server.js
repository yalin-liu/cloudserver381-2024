//http://localhost:8099/?lat=22.318663093040986&lon=114.17482973741627

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get("/", (req,res) => {
	res.render("leaflet.ejs", {
		lat:req.query.lat,
		lon:req.query.lon,
		zoom:req.query.zoom ? req.query.zoom : 15
	});
	res.end();
});

app.listen(process.env.PORT || 8099);
