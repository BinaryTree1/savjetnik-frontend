// ThemeContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
// If using @fontsource
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('light');

    // Load theme from localStorage if available
    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setThemeMode(storedTheme);
        }
    }, []);

    // Update localStorage when theme changes
    useEffect(() => {
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);

    const theme = createTheme({
        palette: {
            mode: themeMode,
            background: {
                default: themeMode === 'light' ? '#ffffff' : '#141823', // Main background
                paper: themeMode === 'light' ? '#f8f9fa' : '#1a1f2d', // Adjusted for a softer light mode background
                sidebar: themeMode === 'light' ? '#f9fafb' : '#141823', // Sidebar background
            },
            text: {
                primary: themeMode === 'light' ? '#1a202c' : '#e2e8f0', // Primary text
                secondary: themeMode === 'light' ? '#4a5568' : '#a0aec0', // Secondary text
            },
            divider: themeMode === 'light' ? '#e2e8f0' : '#4a5568', // Divider color
            hover: themeMode === 'light' ? '#edf2f7' : '#242936', // Hover background
        },
        typography: {
            fontFamily: ['Inter', 'sans-serif'].join(','),
        },
        breakpoints: {
            values: {
                xs: 0, // Up to 480px
                sm: 480, // 480px and up
                md: 768, // Adjust as needed
                lg: 1024,
                xl: 1440,
            },
        },
    });

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline /> {/* Normalize styles across browsers */}
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};
