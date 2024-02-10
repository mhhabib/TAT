const Textfile = require("../models/tatModel")
const Textanalyzestatics = require('../Utils/textAnalyze')
const { performance } = require('perf_hooks');
const logger = require("../logger/Logger");

// Fetching all created files controller
exports.getFiles = (req, res, next) => {
    Textfile.find()
        .then(textfiles => {
            logger.info("Fetching all published file");
            res.status(200).json({ message: 'Fetching all published file successfull!', textfiles: textfiles });
            logger.info("Fetching all published file successfull!");
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
                logger.error(err)
            }
            next(err);
        });
};

// Creating new file and text analyze controller
exports.createNewFile=(req, res, next)=>{
    if(!req.file){
        logger.error("No text file provided")
        const error = new Error("No text file provided!");
        error.statusCode = 422;
        throw error;
    }
    const textUrl=req.file.path
    const startTime = performance.now();
    logger.info("Analyzing imported text file....")
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
          logger.info("Successfully created new file and stored to database")
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
                logger.error(err)
            }
            next(err);
        });
    });   
    logger.info("New text analyzing is sucessfull!") 
    logger.info(`New file creation time: ${performance.now()-startTime} milliseconds`);
}

// Words counter controller
exports.getWords = (req, res, next) => {
    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        logger.info(`Fetching words id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of words fetched', words: file.words });
        logger.info("Fetching words successfull!");
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            logger.error(err)
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
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        logger.info(`Fetching characters id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of characters fetched', characters: file.characters });
        logger.info("Fetching characters successfull!");
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            logger.error(err)
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
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        logger.info(`Fetching sentences id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of sentences fetched', sentences: file.sentences });
        logger.info("Fetching sentences successfull!");
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            logger.error(err)
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
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        logger.info(`Fetching paragraphs id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of paragraphs fetched', paragraphs: file.paragraphs });
        logger.info("Fetching paragraphs successfull!");
        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            logger.error(err)
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
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        
        logger.info(`Fetching longest paragraphs id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Longest paragraphs fetched', longestparagraphs: file.longestparagraphs });
        logger.info("Fetching longest paragraphs successfull!");

        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            logger.error(err)
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
            logger.error(`Could not delete file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
        }
        return Textfile.findByIdAndDelete(fileId);
      })
      .then(result => {
        logger.info(`Deleted file id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Deleted post.' });
        logger.info("File deleted successfully!");
      })
      .catch(err => {
        if (!err.statusCode) {
          err.statusCode = 500;
          logger.error(err)
        }
        next(err);
    });
}