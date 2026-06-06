const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const { verifyUser, ensureMessageExists, ensureMessageParticipant, ensureMessageOwner } = require('../middleware/message.middleware');

router.get('/', verifyUser, messageController.getMessages);

router.post('/', verifyUser, messageController.createMessage);

router.put(
    '/:id',
    verifyUser,
    ensureMessageExists,
    ensureMessageOwner,
    messageController.updateMessage
);

router.delete(
    '/:id',
    verifyUser,
    ensureMessageExists,
    ensureMessageOwner,
    messageController.deleteMessage
);

module.exports = router;
