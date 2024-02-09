const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer')
const app = express();
const rootDir = require("./Utils/path")
const feedRoutes=require('./routes/feedRoutes')


app.set("view engine", "ejs");
app.set("views", "views");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
        cb(null, true); // Allow upload for text/plain MIME type
    } else {
        cb(null, false); // Reject upload for other MIME types
    }
  };
app.use(bodyParser.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('file')
);
app.use('/images', express.static(path.join(__dirname, 'images')));
  
app.use(express.static(path.join(rootDir, "public")));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(feedRoutes)

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });
  
mongoose.connect('mongodb+srv://mhhabibrex:JdgfcaH5KmEsEKcw@textanalyzer.2d0t32g.mongodb.net/tattools?retryWrites=true&w=majority')
.then(result => {
    app.listen(8080);
  })
  .catch(err => console.log("port is not running"));
