# Text Analyser Tool 
Text Analyser Tool is a Node.js application that provides RESTful APIs for performing various analyses on text files. It is designed to handle large files efficiently, avoiding resource-intensive methods like built-in JavaScript split functions. It employs various technologies for efficient performance like caching, logging, and leveraging MongoDB for persistence

## Features

- Analyze word, character, sentence, and paragraph count.
- Extract the longest words from each paragraph.
- Create and manage text files.
- Efficiently handles large files through streaming-based processing.
- Uses [MongoDB](https://www.npmjs.com/package/mongodb) and [Mongoose](https://www.npmjs.com/package/mongoose) for storing text data and metadata.
- Implements Node.js **MVC pattern** for API creation.
- Leverages server-side [Redis](https://www.npmjs.com/package/redis) cache for improved application performance.
- Collect logs for visualization using [Winston library](https://www.npmjs.com/package/winston).
- Visualizes logs and API performance with [Logtail](https://betterstack.com/docs/logs/javascript/winston/).



## API Informations

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



## Dependencies

- **Redis**: This application requires a running Redis instance for caching functionalities. Please refer to the official Redis documentation for installation and configuration instructions: https://redis.io/download/

- **MongoDB**: The application persists data in MongoDB using Mongoose. You can either set up a local MongoDB instance or register for a MongoDB cloud service like MongoDB Atlas and configure the connection URI in your environment variables. Refer to the Mongoose documentation for more information: https://www.mongodb.com/developer/languages/javascript/getting-started-with-mongodb-and-mongoose/


## Additional Configuration:
Make sure to set the following environment variables before running the application:

- `PORT` : API connection
- `NODE_ENV` : Application running environment for collecting logs
- `MONGODB_UR` I: The connection URI for your MongoDB instance.
- `REDIS_HOST` : The hostname of your Redis server.
- `REDIS_PORT` : The port of your Redis server.
- `REDIS_TIME_EXPIRATION`: Redis time expiration 
- `SOURCE_TOKEN`: Betterstack connection token for log visualizations



## Installation & Usage

1. Clone this repository: ```git clone https://github.com/mhhabib/TAT.git ```
2. Install dependencies: `npm install`
3. Set environment variables (database connection details etc.)
4. Start the server: `npm start`
5. Use the provided API routes to analyze your text files.


# Fontend set up
A ReactJS frontend that provides interactive single-page applications (SPAs) for analyzing text files.  Tailwind-css-based [Flowbite-React ](https://flowbite.com/docs/getting-started/react/#install-tailwind-css) is used as a UI library. 

## Installation & Usage
- Navigate to the [frontend directory](https://github.com/mhhabib/TAT/tree/main/views/frontend) within the cloned repository.
- Open a new terminal 
- Install dependencies: `npm install`
- Start the development server: `npm start`   (To avoid port conflict check the backend and run different PORT )       
<img width="1418" alt="Screenshot 2024-02-10 at 5 34 11 PM" src="https://github.com/mhhabib/TAT/assets/17263976/fe838e6e-457b-4300-89b1-e62bdfc2d2d2">
<img width="1418" alt="Screenshot 2024-02-10 at 5 35 00 PM" src="https://github.com/mhhabib/TAT/assets/17263976/d10bcdb7-c0b9-419c-8e64-5f694848b4c7">


## Technologies
- **Backend**: Node.js, ExpressJS
- **Frontend**: ReactJS, Axios
- **Styling**: Tailwind CSS, Flowbite React UI library
- **Caching**: Redis
- **Database**: MongoDB, Mongoose
- **Logger**:  Winston, Logtail

_**Thank you for reading this long history**_ 🙏 
