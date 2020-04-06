const path = require('path');
const express = require('express');
const multer  = require('multer')

const app = express();
const upload = multer({ dest: 'uploads/' })

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