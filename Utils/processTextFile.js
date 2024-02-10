const fs = require('fs');
const readline = require('readline');
const logger = require("../logger/Logger");

function processFile(filePath, callback) {
    let wordCount = 0;
    let charCount = 0;
    let sentenceCount = 0;
    let paragraphCount = 0;
    let longestWord = '';

    const inputStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: inputStream,
        crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        charCount++;
        charCount += line.length;
        if (line.trim() === '') {
            paragraphCount++;
        } else {
            const words = line.split(/\s+/);
            wordCount += words.length;
            

            // Check for the longest word in the line
            const longest = words.reduce((longest, current) => {
                return current.length > longest.length ? current : longest;
            }, '');
            if (longest.length > longestWord.length) {
                longestWord = longest.replace(/[.!?]+$/, '');
            }

            // Count sentences using punctuation marks as separators
            sentenceCount += line.split(/[.!?]+/).length - 1
        }
    });

    rl.on('close', () => {
        // Increment paragraph count if the last line is not empty
        if (charCount > 0) {
            paragraphCount++;
        }

        const analysisResult = {
            wordCount: wordCount,
            charCount: charCount-1,
            sentenceCount: sentenceCount,
            paragraphCount: paragraphCount,
            longestWord: longestWord
        };
        logger.info("Text analysis successful.")
        callback(null, analysisResult);
    });

    rl.on('error', (err) => {
        callback(err, null);
        logger.error(err)
    });
}
module.exports = processFile;