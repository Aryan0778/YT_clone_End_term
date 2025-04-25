import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Button,
    Typography,
    Card,
    CardMedia,
    CardContent,
    Chip,
} from '@mui/material';
import axios from 'axios';

const categories = [
    'All',
    'Music',
    'Gaming',
    'Education',
    'Entertainment',
    'News',
    'Sports',
];

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/videos`);
                setVideos(response.data);
            } catch (error) {
                console.error('Error fetching videos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [selectedCategory]);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const formatViews = (views) => {
        if (views >= 1000000) {
            return `${(views / 1000000).toFixed(1)}M views`;
        } else if (views >= 1000) {
            return `${(views / 1000).toFixed(1)}K views`;
        }
        return `${views} views`;
    };

    return (
        <Box sx={{ p: 3, mt: 8 }}>
            <Box sx={{ mb: 3, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {categories.map((category) => (
                    <Chip
                        key={category}
                        label={category}
                        onClick={() => handleCategoryClick(category)}
                        sx={{
                            mr: 1,
                            backgroundColor: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.1)',
                            color: selectedCategory === category ? 'black' : 'white',
                            '&:hover': {
                                backgroundColor: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.2)',
                            },
                        }}
                    />
                ))}
            </Box>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <Grid container spacing={3}>
                    {videos.map((video) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                            <Card
                                sx={{
                                    bgcolor: 'transparent',
                                    color: 'white',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        transform: 'scale(1.02)',
                                        transition: 'transform 0.2s',
                                    },
                                }}
                                onClick={() => navigate(`/video/${video._id}`)}
                            >
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={video.thumbnailURL}
                                    alt={video.title}
                                />
                                <CardContent>
                                    <Typography
                                        variant="subtitle1"
                                        component="div"
                                        sx={{
                                            fontWeight: 'bold',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {video.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {video.uploader?.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {formatViews(video.views)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Home; 