const Message = require('../models/message.model.js');
const { ApplicationError } = require('../middleware/error.middleware.js');

class MessageController {
  async createMessage(req, res) {
    const message = req.body?.message || undefined;
    try {
      const newMessage = new Message({ sender: req.user._id, message });
      await newMessage.save();
      res.status(201).json({ message: 'Message sent', data: newMessage });
    } catch (error) {
      throw new ApplicationError(error.message || 'Server error', 500);
    }
  }

  async updateMessage(req, res) {
    const { id } = req.params;
    const newMessage = req.body?.message || undefined;

    if (!newMessage) {
      throw new ApplicationError('Message content is required', 400);
    }

    try {
      const message = await Message.findById(id);
      if (!message) {
        throw new ApplicationError('Message not found', 404);
      }
      message.message = newMessage;
      await message.save();
      res.status(201).json({ message: 'Message received', data: message });
    } catch (error) {
      throw new ApplicationError(error.message || 'Server error', 500);
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await Message.find().populate('sender', 'username').sort({ createdAt: -1 });
      res.json({ message: 'Messages retrieved', data: messages });
    } catch (error) {
      throw new ApplicationError(error.message || 'Server error', 500);
    }
  }

  async deleteMessage(req, res) {
    const { id } = req.params;

    try {
      const message = await Message.findByIdAndDelete(id);

      if (!message) {
        throw new ApplicationError('Message not found', 404);
      }

      res.json({ message: `Message ${id} deleted` });
    } catch (error) {
      throw new ApplicationError(error.message || 'Server error', 500);
    }
  }
}

module.exports = new MessageController();
