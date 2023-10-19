const express = require('express');
const app = express();

app.use(express.static('public'));  // folder for static contents
app.use("/download",express.static('public/assets'));  // virtual path /download -> public/assets

app.get('/',(req,res) => {
    res.render('index.html');
})

const server = app.listen(process.env.PORT || 3000, () => { // https://www.quora.com/Why-is-port-3000-used-when-running-a-Node-js-application
    const port = server.address().port;
    console.log(`Server is listening at port ${port}`); 
});
