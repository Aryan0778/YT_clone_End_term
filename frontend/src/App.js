import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import VideoPage from './pages/VideoPage';
import Auth from './pages/Auth';

// Context
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff0000',
    },
    background: {
      default: '#0f0f0f',
      paper: '#0f0f0f',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <div className="app__main">
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/video/:id" element={<VideoPage />} />
                <Route path="/auth" element={<Auth />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
