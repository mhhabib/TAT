const Textfile = require("../models/tatModel")
const Textanalyzestatics = require('../Utils/textAnalyze')

exports.getFiles = (req, res, next) => {
    Textfile.find()
        .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
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

exports.createNewFile=(req, res, next)=>{
    if(!req.file){
        const error = new Error("No text file provided!");
        error.statusCode = 422;
        throw error;
    }
    const textUrl=req.file.path
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