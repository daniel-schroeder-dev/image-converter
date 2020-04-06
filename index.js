const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.post('/convert', (req, res, next) => {
  
  res.send('ok');
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(8080, () => {
  console.log('Express up at: 8080');
});