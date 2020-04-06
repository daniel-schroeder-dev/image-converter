const fs = require('fs');
const path = require('path');
const express = require('express');
const multer  = require('multer')
const morgan = require('morgan');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid')

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

const createFileName = name => {
  return `${path.parse(name).name}__${Date.now()}__${uuidv4()}__.webp`;
};

const parseFileName = fileName => {
  return fileName.split('__')[0] + path.parse(fileName).ext;
};

const getTimeStamp = fileName => {
  return fileName.split('__')[1];
};

const calculateAgeOfFile = fileName => {
  Math.floor((Date.now() - getTimeStamp(fileName)) / 1000 / 60);
};

const cron = (name, interval, cb) => {
  setInterval(() => {
    console.log('Running cron job: ', name);
    cb();
  }, interval);
};

// cron('Wipe converted folder', 1000, () => {
//   console.log('callback');
// });


app.post('/convert', upload.single('image-upload'), async (req, res, next) => {

  let convertedDirExists;

  try {
    convertedDirExists = await ensureConvertedDirExists();
  } catch(e) {
    console.error(e);
  }

  const fileName = createFileName(req.file.originalname);

  if (convertedDirExists) {
    sharp(req.file.buffer)
      .webp({ lossless: true })
      .toFile(`${convertedDir}/${fileName}`)
      .then(info => {
        res.redirect(303, `/downloads/${fileName}`);
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
  res.render('download', { fileName: req.params.fileName, downloadName: parseFileName(req.params.fileName) });
});

app.listen(PORT, () => {
  console.log('Express up at: ', PORT);
});