const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer')
const morgan = require('morgan');
const sharp = require('sharp');

const PORT = process.env.PORT || 8080;

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const convertedDir = path.join(__dirname, 'converted');

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image', express.static(path.join(__dirname, 'converted')));

const ensureConvertedDirExists = () => {
  return new Promise((resolve, reject) => {
    fs.stat(convertedDir, (err, stat) => {
      if (err || !stat) {
        fs.mkdir(path.join(__dirname, 'converted'), err => {
          if (err) {
            console.error(err);
            return reject(false);
          }
          return resolve(true);
        });
      } else {
        return resolve(stat.isDirectory());
      }
    });
  });
};

app.post('/convert', upload.single('image-upload'), async (req, res, next) => {

  let convertedDirExists;

  try {
    convertedDirExists = await ensureConvertedDirExists();
  } catch(e) {
    console.error(e);
  }

  const fileName = path.parse(req.file.originalname).name;

  if (convertedDirExists) {
    sharp(req.file.buffer)
      .webp({ lossless: true })
      .toFile(`${convertedDir}/${fileName}.webp`)
      .then(info => {
        res.redirect(303, `/downloads/${fileName}.webp`);
      })
      .catch(console.error);  
  } else {
    res.redirect(303, '/');
  }

});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/downloads/:fileName', (req, res, next) => {
  res.render('download', { fileName: req.params.fileName });
});

app.listen(PORT, () => {
  console.log('Express up at: ', PORT);
});