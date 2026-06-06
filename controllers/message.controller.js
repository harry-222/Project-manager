const Message = require('../models/message.model.js');

class MessageController {
  async createMessage(req, res) {
    const message = req.body?.message || undefined;
    try {
      const newMessage = new Message({ sender: req.user._id, message });
      await newMessage.save();
      res.status(201).json({ message: 'Message sent', data: newMessage });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateMessage(req, res) {
    const { id } = req.params;
    const newMessage = req.body?.message || undefined;

    if (!newMessage) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    try {
      const message = await Message.findById(id);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
      message.message = newMessage;
      await message.save();
      res.status(201).json({ message: 'Message received', data: message });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      res.json({ message: 'Messages retrieved', data: messages });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteMessage(req, res) {
    const { id } = req.params;

    try {
      const message = await Message.findByIdAndDelete(id);

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.json({ message: `Message ${id} deleted` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new MessageController();
