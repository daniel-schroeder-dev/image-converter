const path = require('path');
const express = require('express');
const multer  = require('multer')
const morgan = require('morgan');

const app = express();
const upload = multer({ dest: 'uploads/' })

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/convert', upload.single('image-upload'), (req, res, next) => {
  res.redirect(303, `/downloads/${req.file.filename}`);
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/downloads/:id', (req, res, next) => {
  res.render('download', { id: req.params.id });
});

app.listen(8080, () => {
  console.log('Express up at: 8080');
});