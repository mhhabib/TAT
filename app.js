const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose')
const multer = require('multer')
const app = express();
const rootDir = require("./Utils/path")
const feedRoutes=require('./routes/feedRoutes')

// const mongoConnect=require('./Utils/databaseConnection')

app.set("view engine", "ejs");
app.set("views", "views");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'files');
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().toISOString()+'-'+file.originalname);
    }
})

app.use(bodyParser.json());
app.use(express.static(path.join(rootDir, "public")));
app.use('/files', express.static(path.join(__dirname, "files")));
app.use((req, res, next)=>{
    res.setHeader('Acess-Control-Allow-Origin', '*');
    res.setHeader('Acess-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Acess-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use(feedRoutes)

mongoose.connect('mongodb+srv://mhhabibrex:JdgfcaH5KmEsEKcw@textanalyzer.2d0t32g.mongodb.net/?retryWrites=true&w=majority')
.then(result=>{
    console.log()
    app.listen(3000)
})
.catch(err=> console.log(err))