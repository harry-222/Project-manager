const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, { 
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt' 
    } 
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
