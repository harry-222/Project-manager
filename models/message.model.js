const mongoose = require('mongoose');
const { getDb } = require('../config/mongo.config.js');

const MessageSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true 
    },
    subject: { 
        type: String, 
        trim: true 
    },
    message: { 
        type: String, 
        required: true 
    }
}, { 
    timestamps: { 
        createdAt: 'createdAt', 
        updatedAt: 'updatedAt' 
    } 
});

const db = getDb();
const Message = db.model('Message', MessageSchema);

module.exports = Message;
