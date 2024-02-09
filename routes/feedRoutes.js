const express = require('express')
const feedController= require('../controllers/feed')
const router=express.Router()

// GET /posts
router.get('/posts', feedController.getPosts);
// POST /post
router.post('/post', feedController.postPost);
module.exports = router