const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    videoId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    videoURL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    channelId: {
        type: String,
        required: true
    },
    uploader: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: String,
        ref: 'User'
    }],
    dislikes: [{
        type: String,
        ref: 'User'
    }],
    uploadDate: {
        type: Date,
        default: Date.now
    },
    comments: [{
        commentId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video; 