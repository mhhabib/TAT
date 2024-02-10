const express = require('express')
const feedController= require('../controllers/tatController')
const router=express.Router()

// GET /get all files
router.get('/getfiles', feedController.getFiles);

// POST /create new file
router.post('/createfiles', feedController.createNewFile);

// GET /number of words/:fileId
router.get('/words/:fileId',feedController.getWords )

// GET /number of characters/:fileId
router.get('/characters/:fileId',feedController.getCharacters )

// GET /number of sentences/:fileId
router.get('/sentences/:fileId',feedController.getSentences )

// GET /number of paragraphs/:fileId
router.get('/paragraphs/:fileId',feedController.getParagraphs )

// GET /longest-paragraphs/:fileId
router.get('/longest-paragraphs/:fileId',feedController.getLongestparagraphs )

// DELETE /file/:fileId
router.delete('/file/:fileId',feedController.deleteFile )

module.exports = router