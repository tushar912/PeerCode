const express = require('express');
const router = express.Router();
const {
  generateRoom
} = require("../functions/generateRoom"); 

router.get('/generate', function(req, res, next) {
  const newRoomKey = generateRoom();
  console.log(newRoomKey);
  res.status(200).json({
    roomId: newRoomKey,
  });
});

module.exports = router;