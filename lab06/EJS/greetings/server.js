const express = require('express');
const app = express();

app.set('view engine', 'ejs');

const greetingMsg = (name = null, includeTime = false) => {
    let today = new Date();
    let msg = (name != null) ? 'Hello ' + name + '! ' : 'Hello there!';
    if (includeTime) {
      msg += `  It is now ${today.toTimeString()}`;
    }
    return(msg);
  }
  
  app.get('/', (req, res) => {
    res.redirect('/greetings');
  });
  
  app.get('/greetings', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).render('welcome', {msg: greetingMsg(req.query.name, false)});
  });
  
  app.get('/greetings/sayHello', (req, res) => {
    res.redirect('/greetings');
  });
  
  app.get('/greetings/sayHelloWithTime', (req, res) => {
    res.set('Content-Type', 'text/html');
    res.status(200).render('welcome', {msg: greetingMsg(req.query.name, true)});
  });
  
  app.get('/*', (req, res) => {  // default route for anything else
    res.set('Content-Type', 'text/plain');
    res.status(404).render('welcome', {msg: '404 Not Found'});
  })
  
  const server = app.listen(process.env.PORT || 8099, () => {
    const port = server.address().port;
    console.log(`Server listening at port ${port}`);
  });
