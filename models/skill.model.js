const mongoose = require('mongoose');
const { getDb } = require('../config/mongo.config.js');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    }
}, { timestamps: true });

const db = getDb();
const Skill = db.model('Skill', skillSchema);

module.exports = Skill;
