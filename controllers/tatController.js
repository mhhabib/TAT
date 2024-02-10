require('dotenv').config();
const Textfile = require("../models/tatModel")
const processFile = require('../Utils/processTextFile')
const { performance } = require('perf_hooks');
const logger = require("../logger/Logger");
const Redis = require('redis')

const redisClient = Redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT, 
});

(async () => {
    try {
        await redisClient.connect();
        logger.info('Redis Client Connected');
    } catch (err) {
        logger.error(`Redis Client Connection Error ${err}`);
    }
})();

const REDIS_TIME_EXPIRATION = process.env.REDIS_TIME_EXPIRATION


// Fetching all created files controller
exports.getFiles = async (req, res, next) => {
    // Performance time calculations
    const startTime = performance.now();

    const cacheKey = 'getalltextfiles';
    try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        logger.info('Fetching data from cache');
        res.status(200).json(JSON.parse(cachedData));
        logger.info(`Fetching all published files API time: ${performance.now() - startTime} milliseconds`);
        return;
    }
    } catch (err) {
        logger.error(`Redis cache error: ${err}`);
    }
    try {
        const textfiles = await Textfile.find();
        // Store the fetched data in the cache
        await redisClient.setEx(cacheKey, REDIS_TIME_EXPIRATION, JSON.stringify(textfiles));
        logger.info("Fetching all published files successful!");
        res.status(200).json({ message: 'Fetching all published files successful!', textfiles });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        logger.error(err);
        next(err);
    }
    logger.info(`Fetching all published files API time: ${performance.now() - startTime} milliseconds`);
};
// Creating new file and text analyze controller
exports.createNewFile=(req, res, next)=>{
    // Performance time calcultions
    const startTime = performance.now();

    if(!req.file){
        logger.error("No text file provided")
        const error = new Error("No text file provided!");
        error.statusCode = 422;
        throw error;
    }
    const textUrl=req.file.path
    logger.info("Analyzing imported text file....")
    processFile(textUrl, (err, statistics) => {
        if (err) {
            logger.error(`File processing went wrong: ${err}`);
            return next(err);
        }
        const textfile = new Textfile({
            textUrl: textUrl,
            words: statistics?.wordCount?.toString(),
            characters: statistics?.charCount?.toString(),
            sentences: statistics?.sentenceCount?.toString(),
            paragraphs: statistics?.paragraphCount?.toString(),
            longestparagraphs: statistics?.longestWord
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
    logger.info(`New file creation API time: ${performance.now()-startTime} milliseconds`);
}

// Words counter controller
exports.getWords = (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();

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
    logger.info(`Fetching words count API time: ${performance.now()-startTime} milliseconds`);
};

// Characters counter controller
exports.getCharacters = (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();

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
    logger.info(`Fetching characters count API time: ${performance.now()-startTime} milliseconds`);
};

// Sentences counter controller
exports.getSentences = (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();

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
    logger.info(`Fetching sentences count API time: ${performance.now()-startTime} milliseconds`);
};

// Paragraphs counter controller
exports.getParagraphs = (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();

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
    logger.info(`Fetching paragraphs count API time: ${performance.now()-startTime} milliseconds`);
};

// Getting longest words controller
exports.getLongestwords = (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();

    const fileId = req.params.fileId;
    Textfile.findById(fileId)
        .then(file => {
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        
        logger.info(`Fetching longest words id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Longest words fetched', longestparagraphs: file.longestparagraphs });
        logger.info("Fetching longest words successfull!");

        })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
            logger.error(err)
        }
        next(err);
    });
    logger.info(`Fetching longest words API time: ${performance.now()-startTime} milliseconds`);
};

// File delete controller
exports.deleteFile=(req, res, next)=>{
    // Performance time calcultions
    const startTime = performance.now();

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
    logger.info(`Deleting file API time: ${performance.now()-startTime} milliseconds`);
}