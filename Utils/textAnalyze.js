const fs = require('fs');

// Function to calculate statistics from a text file
function textFileStatistics(textUrl, callback) {
    fs.readFile(textUrl, 'utf8', (err, data) => {
        if (err) {
            // Handle error while reading the file
            console.error(err);
            return callback(err, null);
        }

        // Calculate statistics
        const wordCount = data.split(/\s+/).filter(word => word !== '').length;
        const charCount = data.length;
        const sentenceCount = data.split(/[.!?]+/).length - 1;
        const paragraphCount = data.split(/\n\s*\n/).length;
        const paragraphs = data.split(/\n\s*\n/);

        let longestparagraphs="";
        paragraphs.forEach(paragraph=>{
            if(longestparagraphs.length<paragraph.length){
                longestparagraphs=paragraph;
            }
        })
        // Return statistics as dictionary
        const statistics = {
            wordCount: wordCount,
            charCount: charCount,
            sentenceCount: sentenceCount,
            paragraphCount: paragraphCount,
            longestWordsInParagraphs: longestparagraphs
        };

        callback(null, statistics);
    });
}

module.exports = textFileStatistics;
