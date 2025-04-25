import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Box,
} from '@mui/material';
import {
    Home as HomeIcon,
    Explore as ExploreIcon,
    Subscriptions as SubscriptionsIcon,
    VideoLibrary as VideoLibraryIcon,
    History as HistoryIcon,
    WatchLater as WatchLaterIcon,
    ThumbUp as ThumbUpIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar = ({ open, onClose }) => {
    const navigate = useNavigate();

    const mainItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'Explore', icon: <ExploreIcon />, path: '/explore' },
        { text: 'Subscriptions', icon: <SubscriptionsIcon />, path: '/subscriptions' },
    ];

    const libraryItems = [
        { text: 'Library', icon: <VideoLibraryIcon />, path: '/library' },
        { text: 'History', icon: <HistoryIcon />, path: '/history' },
        { text: 'Watch Later', icon: <WatchLaterIcon />, path: '/watch-later' },
        { text: 'Liked Videos', icon: <ThumbUpIcon />, path: '/liked-videos' },
    ];

    const handleItemClick = (path) => {
        navigate(path);
        onClose();
    };

    return (
        <Drawer
            variant="persistent"
            anchor="left"
            open={open}
            onClose={onClose}
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: '#0f0f0f',
                    color: 'white',
                },
            }}
        >
            <Box sx={{ overflow: 'auto', mt: 8 }}>
                <List>
                    {mainItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleItemClick(item.path)}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
                <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                <List>
                    {libraryItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            onClick={() => handleItemClick(item.path)}
                        >
                            <ListItemIcon sx={{ color: 'white' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar; 