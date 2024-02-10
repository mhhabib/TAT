const Textfile = require("../models/tatModel")
const Textanalyzestatics = require('../Utils/textAnalyze')
const { performance } = require('perf_hooks');
const fs = require('fs');

// Fetching all created files controller
exports.getFiles = (req, res, next) => {
    Textfile.find()
        .then(textfiles => {
            res.status(200).json({ message: 'Fetched posts successfully.', textfiles: textfiles });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

// Creating new file and text analyze controller
exports.createNewFile=(req, res, next)=>{
    if(!req.file){
        const error = new Error("No text file provided!");
        error.statusCode = 422;
        throw error;
    }
    const textUrl=req.file.path
    const startTime = performance.now();
    Textanalyzestatics(textUrl, (err, statistics) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        const textfile = new Textfile({
            textUrl: textUrl,
            words: statistics?.wordCount?.toString(),
            characters: statistics?.charCount?.toString(),
            sentences: statistics?.sentenceCount?.toString(),
            paragraphs: statistics?.paragraphCount?.toString(),
            longestparagraphs: statistics?.longestWordsInParagraphs?.toString()
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
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
    });    
    const endTime = performance.now();
    // Calculate the elapsed time
    const elapsedTime = endTime - startTime;

    console.log(`Time taken by myFunction: ${elapsedTime} milliseconds`);
}

// Words counter controller
exports.getWords = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Number of words fetched', words: file.words });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

// Characters counter controller
exports.getCharacters = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Number of characters fetched', characters: file.characters });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

// Sentences counter controller
exports.getSentences = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Number of sentences fetched', sentences: file.sentences });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

// Paragraphs counter controller
exports.getParagraphs = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Number of paragraphs fetched', paragraphs: file.paragraphs });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

// Getting longest paragraph controller
exports.getLongestparagraphs = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ message: 'Longest paragraphs fetched', longestparagraphs: file.longestparagraphs });
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
};

// File delete controller
exports.deleteFile=(req, res, next)=>{
    const fileId=req.params.fileId;
    Textfile.findById(fileId)
    .then(file => {
        if (!file) {
          const error = new Error('Could not find post.');
          error.statusCode = 404;
          throw error;
        }
        return Textfile.findByIdAndDelete(fileId);
      })
      .then(result => {
        res.status(200).json({ message: 'Deleted post.' });
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    });
}