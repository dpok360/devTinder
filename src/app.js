const express = require('express');

const app = express();

//req handler
app.get('/user', (req, res) => {
  res.send({ name: 'deepak', lastname: 'surya' });
});
app.post('/user', (req, res) => {
  console.log('Save data to db');
  res.send('Data successfully saved in db');
});

app.listen(3000, () => {
  console.log('Server is successfully listening at port 3000');
});
