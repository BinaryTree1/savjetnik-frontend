// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "@/components/ui/provider"
import App from './App.jsx';
import './index.css'; // Ensure this doesn't contain styles that hide content

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider>
            <App />
        </Provider>
    </React.StrictMode>
);
