import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    AppBar,
    Toolbar,
    IconButton,
    InputBase,
    Box,
    Avatar,
    Menu,
    MenuItem,
    Typography,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Search as SearchIcon,
    VideoCall as VideoCallIcon,
    Apps as AppsIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import styled from '@emotion/styled';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '40ch',
        },
    },
}));

const Header = ({ onMenuClick }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleMenuClose();
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onMenuClick}
                >
                    <MenuIcon />
                </IconButton>

                <Box
                    component="img"
                    sx={{ height: 100, width: 100, cursor: 'pointer' }}
                    alt="YouTube"
                    src="./youtube-logo.svg"
                    onClick={() => navigate('/')}
                />

                <Box sx={{ flexGrow: 1 }} />

                <form onSubmit={handleSearch}>
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </Search>
                </form>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton color="inherit">
                        <VideoCallIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <AppsIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    {user ? (
                        <IconButton
                            color="inherit"
                            onClick={handleMenuOpen}
                        >
                            <Avatar
                                src={user.avatar}
                                sx={{ width: 32, height: 32 }}
                            />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="inherit"
                            onClick={() => navigate('/auth')}
                        >
                            <Avatar sx={{ width: 32, height: 32 }} />
                        </IconButton>
                    )}
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                        <Typography>Profile</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <Typography>Logout</Typography>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 