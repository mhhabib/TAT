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
exports.createNewFile = (req, res, next)=>{
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
    processFile(textUrl, async (err, statistics) => {
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
        await textfile
        .save()
        .then(async result => {
          res.status(201).json({
            message: 'New file created successfully!',
            textfile: result
          });
            try {
                const cachedData = await redisClient.get('getalltextfiles');
                if (cachedData) {
                    const parsedData = JSON.parse(cachedData);
                    parsedData.push(result); 
                    await redisClient.setEx('getalltextfiles', REDIS_TIME_EXPIRATION, JSON.stringify(parsedData));
                } else {
                    await redisClient.setEx('getalltextfiles', REDIS_TIME_EXPIRATION, JSON.stringify([result]));
                }
                logger.info('Cache updated successfully');
            } catch (err) {
                logger.error(`Error updating cache: ${err}`);
            }
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
exports.getWords = async (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();
    const fileId = req.params.fileId;
    const cacheKey= `getwords${fileId}`
    try{
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info('Fetching words data from cache');
            logger.info(JSON.parse(cachedData))
            res.status(200).json(JSON.parse(cachedData));
            logger.info(`Fetching words count API time: ${performance.now()-startTime} milliseconds`);
            return;
        }
    } catch (err) {
        logger.error(`Redis words cache error: ${err}`);
    }
    
    try {
        const file = await Textfile.findById(fileId);
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        // Store the fetched data in the cache
        await redisClient.setEx(cacheKey, REDIS_TIME_EXPIRATION, JSON.stringify(file.words) );
        logger.info(`Fetching words id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of words fetched', words: file.words });
        logger.info("Fetching words successfull!");
        logger.info(`Fetching words count API time: ${performance.now()-startTime} milliseconds`);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        logger.error(err);
        next(err);
    } 
};

// Characters counter controller
exports.getCharacters = async (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();
    const fileId = req.params.fileId;
    const cacheKey= `getchars${fileId}`
    try{
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info('Fetching Characters data from cache');
            logger.info(JSON.parse(cachedData))
            res.status(200).json(JSON.parse(cachedData));
            logger.info(`Fetching Characters count API time: ${performance.now()-startTime} milliseconds`);
            return;
        }
    } catch (err) {
        logger.error(`Redis Characters cache error: ${err}`);
    }
    
    try {
        const file = await Textfile.findById(fileId);
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        // Store the fetched data in the cache
        await redisClient.setEx(cacheKey, REDIS_TIME_EXPIRATION, JSON.stringify(file.characters) );
        logger.info(`Fetching Characters id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of words fetched', characters: file.characters });
        logger.info("Fetching Characters successfull!");
        logger.info(`Fetching Characters count API time: ${performance.now()-startTime} milliseconds`);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        logger.error(err);
        next(err);
    } 
};

// Sentences counter controller
exports.getSentences = async (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();
    const fileId = req.params.fileId;
    const cacheKey= `getsentence${fileId}`
    try{
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info('Fetching sentences data from cache');
            logger.info(JSON.parse(cachedData))
            res.status(200).json(JSON.parse(cachedData));
            logger.info(`Fetching sentences count API time: ${performance.now()-startTime} milliseconds`);
            return;
        }
    } catch (err) {
        logger.error(`Redis sentences cache error: ${err}`);
    }
    
    try {
        const file = await Textfile.findById(fileId);
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        // Store the fetched data in the cache
        await redisClient.setEx(cacheKey, REDIS_TIME_EXPIRATION, JSON.stringify(file.sentences) );
        logger.info(`Fetching sentences id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of words fetched', sentences: file.sentences });
        logger.info("Fetching sentences successfull!");
        logger.info(`Fetching sentences count API time: ${performance.now()-startTime} milliseconds`);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        logger.error(err);
        next(err);
    } 
};

// Paragraphs counter controller
exports.getParagraphs = async (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();
    const fileId = req.params.fileId;
    const cacheKey= `getparagraph${fileId}`
    try{
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info('Fetching paragraphs data from cache');
            logger.info(JSON.parse(cachedData))
            res.status(200).json(JSON.parse(cachedData));
            logger.info(`Fetching paragraphs count API time: ${performance.now()-startTime} milliseconds`);
            return;
        }
    } catch (err) {
        logger.error(`Redis paragraphs cache error: ${err}`);
    }
    
    try {
        const file = await Textfile.findById(fileId);
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        // Store the fetched data in the cache
        await redisClient.setEx(cacheKey, REDIS_TIME_EXPIRATION, JSON.stringify(file.paragraphs) );
        logger.info(`Fetching paragraphs id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of words fetched', paragraphs: file.paragraphs });
        logger.info("Fetching paragraphs successfull!");
        logger.info(`Fetching paragraphs count API time: ${performance.now()-startTime} milliseconds`);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        logger.error(err);
        next(err);
    } 
};

// Getting longest words controller
exports.getLongestwords = async (req, res, next) => {
    // Performance time calcultions
    const startTime = performance.now();
    const fileId = req.params.fileId;
    const cacheKey= `getlongestword${fileId}`
    try{
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            logger.info('Fetching longest words data from cache');
            logger.info(JSON.parse(cachedData))
            res.status(200).json(JSON.parse(cachedData));
            logger.info(`Fetching longest words count API time: ${performance.now()-startTime} milliseconds`);
            return;
        }
    } catch (err) {
        logger.error(`Redis longest words cache error: ${err}`);
    }
    
    try {
        const file = await Textfile.findById(fileId);
        if (!file) {
            logger.error(`Could not find file with ID: ${fileId.toString()}. File not found.`);
            const error = new Error('Could not find files.');
            error.statusCode = 404;
            throw error;
        }
        // Store the fetched data in the cache
        await redisClient.setEx(cacheKey, REDIS_TIME_EXPIRATION, JSON.stringify(file.longestparagraphs) );
        logger.info(`Fetching longest words id: ${fileId.toString()}.`);
        res.status(200).json({ message: 'Number of words fetched', longestparagraphs: file.longestparagraphs });
        logger.info("Fetching longest words successfull!");
        logger.info(`Fetching longest words count API time: ${performance.now()-startTime} milliseconds`);

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        logger.error(err);
        next(err);
    } 
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
      .then(async result => {
        logger.info(`Deleted file id: ${fileId.toString()}.`);
        logger.info("File deleted from database successfully!");

        const cachedData = await redisClient.get('getalltextfiles');
        const cachedTextfiles = JSON.parse(cachedData);
        logger.info(`XYZ DATA : ${cachedTextfiles}`)
        try {
            const updatedTextfiles = cachedTextfiles.filter(file => file._id !== fileId); // Remove deleted file
            await redisClient.setEx('getalltextfiles', REDIS_TIME_EXPIRATION, JSON.stringify(updatedTextfiles));
            logger.info(`Deleted file id: ${fileId.toString()} from database and cache.`);
            res.status(200).json({ message: 'Deleted post.' });
        } catch (err) {
            logger.error(`Redis delete cache error: ${err}`);
        } finally {
            logger.info("File deleted from cache successfully!");
        }

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