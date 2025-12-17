const express = require('express');
const { 
  createGroup, 
  joinGroup, 
  getUserGroups,
  getAllGroups, 
  getGroupMessages,
  sendGroupMessage
} = require('../controller/GroupController');

const router = express.Router();

// Group management routes
router.post('/create', createGroup);
router.post('/join', joinGroup);
router.get('/my-groups', getUserGroups);
router.get('/all-groups', getAllGroups);
router.get('/:groupId/messages', getGroupMessages);

// Group messaging routes
router.post('/send-message', sendGroupMessage);

module.exports = router;