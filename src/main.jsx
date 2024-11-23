import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Ensure the correct path to your `App` component
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </React.StrictMode>
    );
} else {
    console.error('Root element not found');
}
