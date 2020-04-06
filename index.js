const path = require('path');
const express = require('express');
const multer  = require('multer')
const morgan = require('morgan');

const app = express();
const upload = multer({ dest: 'uploads/' })

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/convert', upload.single('image-upload'), (req, res, next) => {
  console.log(req.file.filename);
  res.redirect(303, '/');
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.listen(8080, () => {
  console.log('Express up at: 8080');
});