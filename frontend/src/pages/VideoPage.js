import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Avatar,
    TextField,
    Divider,
    IconButton,
} from '@mui/material';
import {
    ThumbUp as ThumbUpIcon,
    ThumbDown as ThumbDownIcon,
    Share as ShareIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VideoPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [video, setVideo] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/videos/${id}`);
                setVideo(response.data);
            } catch (error) {
                console.error('Error fetching video:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/videos/${id}/like`);
            setVideo(prev => ({
                ...prev,
                likes: prev.likes + 1
            }));
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const handleDislike = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/videos/${id}/dislike`);
            setVideo(prev => ({
                ...prev,
                dislikes: prev.dislikes + 1
            }));
        } catch (error) {
            console.error('Error disliking video:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/auth');
            return;
        }
        if (!newComment.trim()) return;

        try {
            // Debug: Log the current token and headers
            const token = localStorage.getItem('token');
            console.log('Current token:', token);
            console.log('Axios default headers:', axios.defaults.headers.common);

            const response = await axios.post(`http://localhost:5000/api/videos/comment/${id}`, {
                text: newComment
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setVideo(prev => ({
                ...prev,
                comments: [response.data, ...prev.comments]
            }));
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
            if (error.response?.status === 401) {
                navigate('/auth');
            }
        }
    };

    const handleCommentUpdate = async (commentId, newText) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        try {
            const response = await axios.put(`http://localhost:5000/api/videos/comment/${id}/${commentId}`, {
                text: newText
            });

            setVideo(prev => ({
                ...prev,
                comments: prev.comments.map(comment =>
                    comment.commentId === commentId ? response.data : comment
                )
            }));
        } catch (error) {
            console.error('Error updating comment:', error);
            if (error.response?.status === 401) {
                navigate('/auth');
            }
        }
    };

    const handleCommentDelete = async (commentId) => {
        if (!user) {
            navigate('/auth');
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/videos/comment/${id}/${commentId}`);

            setVideo(prev => ({
                ...prev,
                comments: prev.comments.filter(comment => comment.commentId !== commentId)
            }));
        } catch (error) {
            console.error('Error deleting comment:', error);
            if (error.response?.status === 401) {
                navigate('/auth');
            }
        }
    };

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (!video) {
        return <Typography>Video not found</Typography>;
    }

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <Box sx={{ mb: 3 }}>
                <iframe
                    width="100%"
                    height="400"
                    src={video.videoURL}
                    style={{ backgroundColor: 'black', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                    title="Video Player"
                />

            </Box>

            <Typography variant="h5" sx={{ mb: 1 }}>
                {video.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                    {formatViews(video.views)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={handleLike}>
                        <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {video.likes}
                    </Typography>
                    <IconButton onClick={handleDislike}>
                        <ThumbDownIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        {video.dislikes}
                    </Typography>
                    <IconButton>
                        <ShareIcon />
                    </IconButton>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                    sx={{ width: 40, height: 40, mr: 2 }}
                />
                <Box>
                    <Typography variant="subtitle1">
                        {video.uploader}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {video.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Uploaded on {formatDate(video.uploadDate)}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
                Comments ({video.comments?.length || 0})
            </Typography>

            {user ? (
                <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                },
                            }}
                        />
                    </Box>
                </Box>
            ) : (
                <Button
                    variant="contained"
                    onClick={() => navigate('/auth')}
                    sx={{ mb: 3 }}
                >
                    Sign in to comment
                </Button>
            )}

            {video.comments?.map((comment) => (
                <Box key={comment.commentId} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <Avatar
                            sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2">
                                {comment.userId}
                            </Typography>
                            <Typography variant="body2">
                                {comment.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {formatDate(comment.timestamp)}
                            </Typography>
                            {user && user.id === comment.userId && (
                                <Box sx={{ mt: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() => handleCommentUpdate(comment.commentId, prompt('Edit comment:', comment.text))}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleCommentDelete(comment.commentId)}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default VideoPage; 