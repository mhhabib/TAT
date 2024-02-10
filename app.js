require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer')
const app = express();
const rootDir = require("./Utils/path")
const feedRoutes=require('./routes/feedRoutes')

// Multer file upload handler
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'textfiles');
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
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('file'));
app.use('/textfiles', express.static(path.join(__dirname, 'textfiles')));

// Implement cors policy
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routing handler
app.use(feedRoutes)

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  });
  

// DB connection and port controller
mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT);
        console.log("Database connection succesfull and port is running...")
    })
    .catch(err => console.log("port is not running"));
