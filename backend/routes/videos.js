const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Video = require('../models/Video');

router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        const videos = await Video.find(query)
            .populate('uploader', 'username avatar')
            .sort({ uploadDate: -1 });

        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Increment views
        video.views += 1;
        await video.save();

        res.json(video);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/comment/:id', auth, async (req, res) => {
    try {
        const { text } = req.body;
        const { id } = req.params;

        const video = await Video.findById(id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const newComment = {
            commentId: Date.now().toString(),
            userId: req.user.id,
            text,
            timestamp: new Date()
        };

        video.comments.push(newComment);
        await video.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/comment/:videoId/:commentId', auth, async (req, res) => {
    try {
        const { videoId, commentId } = req.params;
        const { text } = req.body;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const comment = video.comments.find(c => c.commentId === commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the comment author
        if (comment.userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        comment.text = text;
        await video.save();

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/comment/:videoId/:commentId', auth, async (req, res) => {
    try {
        const { videoId, commentId } = req.params;

        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const commentIndex = video.comments.findIndex(c => c.commentId === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if user is the comment author
        if (video.comments[commentIndex].userId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        video.comments.splice(commentIndex, 1);
        await video.save();

        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:id/like', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user has already liked
        if (video.likes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already liked this video' });
        }

        // Remove from dislikes if exists
        const dislikeIndex = video.dislikes.indexOf(req.user.id);
        if (dislikeIndex !== -1) {
            video.dislikes.splice(dislikeIndex, 1);
        }

        // Add to likes
        video.likes.push(req.user.id);
        await video.save();

        res.json({ message: 'Video liked successfully' });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/:id/dislike', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        // Check if user has already disliked
        if (video.dislikes.includes(req.user.id)) {
            return res.status(400).json({ message: 'You have already disliked this video' });
        }

        // Remove from likes if exists
        const likeIndex = video.likes.indexOf(req.user.id);
        if (likeIndex !== -1) {
            video.likes.splice(likeIndex, 1);
        }

        // Add to dislikes
        video.dislikes.push(req.user.id);
        await video.save();

        res.json({ message: 'Video disliked successfully' });
    } catch (error) {
        console.error('Dislike error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 