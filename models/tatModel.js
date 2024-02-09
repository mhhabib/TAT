const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const fileSchema=new Schema({
    textUrl: {
        type: String,
        required: true
    },
    words: {
        type: String,
        required: false
    },
    characters: {
        type: String,
        required: false
    },
    sentences: {
        type: String,
        required: false
    },
    paragraphs: {
        type: String,
        required: false
    },
    longestparagraphs: {
        type: String,
        required: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Textfile', fileSchema)


// - Create an API to return the number of words.
// - Create an API to return the number of characters.
// - Create an API to return the number of sentences.
// - Create an API to return the number of paragraphs.
// - Create an API to return the longest words in paragraphs.