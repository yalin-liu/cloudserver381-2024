const express = require('express');
const app = express();

app.use((req,res,next) => {  // logger middleware
  console.log(req.method + ' ' + req.url +  ' was requested at ' + Date(Date.now()).toString());
  next();
})

app.use((req,res,next) => {  // Mac disciminator middlware
  console.log(JSON.stringify(req.headers));
  if (req.headers['user-agent'].indexOf('Mac') >= 0) {
    res.end('We do not support Apple Computers!')
  } else {
    next();
  }
});

app.get('/', (req,res,next) => {
  res.send('Hello World!');
});

app.get('/help', (req,res,next) => {
  res.send('Nope.. nothing to see here');
});

app.listen(process.env.PORT || 8099);
