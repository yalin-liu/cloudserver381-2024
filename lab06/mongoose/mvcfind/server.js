const http = require('http');
const url = require('url');
const LISTENERING_PORT = process.env.PORT || 8099;
// Model
const uri = '';
const mongoose = require('mongoose');
const kittySchema = require('./models/kitty');
const Kitten = mongoose.model('Kitten', kittySchema);
// View
const renderResult = (res,kitties) => {
	res.writeHead(200, {"Content-Type": "text/html"});
	res.write('<html><body>');
	res.write('<H2>Details of all Kitties:</H2>');
	res.write('<ol>');
	for (var i = 0; i < kitties.length; i++) {
		res.write('<li>');
		res.write(JSON.stringify(kitties[i]));
		res.write('</li>')
	}
	res.write('</ol>');
	res.write('</H2>');
	res.write('</body></html>');
    res.end();
}
// Controller
const filterResult = (id) => {
	fields = (id == "admin") ? "name age -_id" : "name -_id";
	return(fields);
}
const handle_Show = async (res, criteria) => {
    try {
        let findResult = await Kitten.find({}, criteria);
        renderResult(res, findResult);
    } catch (err) {
        console.error(err);
    }
}
const server = http.createServer((req,res) => {
	let timestamp = new Date().toISOString();
	console.log(`Incoming request ${req.method}, ${req.url} received at ${timestamp}`);
	// http://localhost:${LISTENERING_PORT}/show?id=admin
	let parsedURL = url.parse(req.url,true); // true to get query as object 
	if (parsedURL.pathname == '/show') {
		let fields = filterResult(parsedURL.query.id);
		handle_Show(res, fields);
	} else {
		res.writeHead(404, {"Content-Type": "text/plain"});
		res.write("404 Not Found\n");
		res.end();
	}
});
async function main() {
	server.listen(LISTENERING_PORT);
	await mongoose.connect(uri);
	console.log('Mongoose Connected!')
}
main()
  .then(console.log(`Server created: http://localhost:${LISTENERING_PORT}/`))
  .catch((err) => console.log(err))
  .finally()
