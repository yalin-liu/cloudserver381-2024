const express = require('express');
const app = express();

app.use(express.static('public'));  // folder for static contents
app.use("/download",express.static('public/assets'));  // virtual path /download -> public/assets

app.get('/',(req,res) => {
    res.render('index.html');
})

const server = app.listen(process.env.PORT || 8099, () => {
    const port = server.address().port;
    console.log(`Server is listening at port ${port}`); 
});