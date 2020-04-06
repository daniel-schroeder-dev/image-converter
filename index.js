const express = require('express');
const path = require('path');
const app = express();

app.use('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(8080, () => {
  console.log('Express up at: 8080');
});