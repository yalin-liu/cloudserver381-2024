const express = require('express');
const app = express();

app.get('/', (req,res) => {
  res.status(200).end(`Node version: ${process.version}\n`);
});

app.listen(process.env.PORT || 8099);