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

// Sort file in descending order by creation date and time
fileSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Textfile', fileSchema)
