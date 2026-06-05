const mongoose = require('mongoose');
const { getDb } = require('../config/mongo.config.js');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: {
        type: [String],
        required: true
    },
    githubLink: {
        type: String,
        required: true
    },
    liveLink: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const db = getDb();
const Project = db.model('Project', projectSchema);

module.exports = Project;