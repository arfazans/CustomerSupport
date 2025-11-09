const express = require('express')
const router = express.Router();
const {chatWithBot} = require("../controller/BotController")

router
.post('/botreply',chatWithBot)

module.exports = router;
