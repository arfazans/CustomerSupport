

const express = require('express');
const router = express.Router();
const {getUserForSidebar,getMessages,sendMessage,getRecentMessages } = require('../controller/MessageController');

router
.get('/users',getUserForSidebar)
.get('/recent-messages', getRecentMessages)
.get('/:id', getMessages)
.post('/send/:id',sendMessage)
module.exports = router;