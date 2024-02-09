const Textfile = require("../models/tatModel")

exports.getFiles=(req, res, next)=>{
    Textfile.find()
        .then(textfiles => {
        res
            .status(200)
            .json({ message: 'Fetched posts successfully.', textfiles: textfiles });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.createNewFile=(req, res, next)=>{
    if(!req.file){
        const error = new Error("No text file provided!");
        error.statusCode = 422;
        throw error;
    }
    const textUrl=req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    const textfile = new Textfile({
        title: title,
        content: content,
        textUrl: textUrl
    });
    textfile
    .save()
    .then(result => {
      res.status(201).json({
        message: 'New file created successfully!',
        textfile: result
      });
    })
    .catch(err => {
      console.log(err);
    });
}

exports.getFile = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Text file fetched.', file: file });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};