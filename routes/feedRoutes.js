const express = require('express')
const feedController= require('../controllers/tatController')
const router=express.Router()

// GET /posts
router.get('/posts', feedController.getFiles);
// POST /post
router.post('/post', feedController.createNewFile);
module.exports = router