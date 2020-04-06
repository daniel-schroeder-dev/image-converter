const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer')
const morgan = require('morgan');
const sharp = require('sharp');

const PORT = process.env.PORT || 8080;

const app = express();
const upload = multer({ dest: 'uploads/' })

const uploadsDir = path.join(__dirname, 'uploads');
const convertedDir = path.join(__dirname, 'converted');

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'converted')));

const removeUpload = filename => {
  const fileToRemovePath = `${uploadsDir}/${filename}`;
  fs.unlink(fileToRemovePath, err => {
    if (err) console.error(err);
    console.log(`Removed ${fileToRemovePath}`);
  });
};

app.post('/convert', upload.single('image-upload'), (req, res, next) => {
  
  sharp(`${uploadsDir}/${req.file.filename}`)
    .webp({ lossless: true })
    .toFile(`${convertedDir}/${req.file.filename}.webp`)
    .then(info => {
      removeUpload(req.file.filename);
      res.redirect(303, `/downloads/${req.file.filename}`);
    })
    .catch(console.error);

});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/downloads/:id', (req, res, next) => {
  res.render('download', { id: req.params.id });
});

app.listen(PORT, () => {
  console.log('Express up at: ', PORT);
});