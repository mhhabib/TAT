# Text Analyser Tool 
Text Analyser Tool is a Node.js application that provides RESTful APIs for performing various analyses on text files. It is designed to handle large files efficiently, avoiding resource-intensive methods like built-in JavaScript split functions.

### Features

- Analyze word, character, sentence, and paragraph count.
- Extract the longest words from each paragraph.
- Create and manage text files.
- Efficiently handles large files through streaming-based processing.
- Uses MongoDB and Mongoose for storing text data and metadata.
- Implements Node.js MVC pattern for API creation.


### API Informations

API Route | Description
--- | ---
`GET /getfiles` | Lists all available text files.
`POST /createfiles` | Creates a new text file.
`GET /words/:fileId `| Returns the number of words in a specific file.
`GET /characters/:fileId` | Returns the number of characters in a specific file.
`GET /sentences/:fileId` | Returns the number of sentences in a specific file.
`GET /paragraphs/:fileId` | Returns the number of paragraphs in a specific file.
`GET /longest-words/:fileId` | Returns the longest words in each paragraph of a specific file.
`DELETE /file/:fileId` | Deletes a specific text file.

### Installation & Usage

1. Clone this repository: ```git clone https://github.com/mhhabib/TAT.git ```
2. Install dependencies: `npm install`
3. Set environment variables (database connection details etc.)
4. Start the server: `npm start`
5. Use the provided API routes to analyze your text files.
