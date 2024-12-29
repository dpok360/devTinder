const express = require('express');

const app = express();

//req handler
app.use('/test', (req, res) => {
  res.send('Hello form server');
});

app.listen(3000, () => {
  console.log('Server is successfully listening at port 3000');
});
