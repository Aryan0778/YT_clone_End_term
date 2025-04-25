import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Tabs,
    Tab,
    Avatar,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (activeTab === 0) {
                // Login
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.error);
                }
            } else {
                // Register
                const result = await register(
                    formData.username,
                    formData.email,
                    formData.password
                );
                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.error);
                }
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                p: 3,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    maxWidth: 400,
                    width: '100%',
                    bgcolor: 'background.paper',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <Avatar
                        src="/youtube-logo.png"
                        sx={{ width: 40, height: 40 }}
                    />
                </Box>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                    sx={{ mb: 3 }}
                >
                    <Tab label="Sign In" />
                    <Tab label="Sign Up" />
                </Tabs>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    {activeTab === 1 && (
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                    )}
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {activeTab === 0 ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Auth; 