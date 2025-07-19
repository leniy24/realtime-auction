import React from 'react';
import { createRoot } from 'react-dom/client';
import './App.css';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Create a root.

// Initial render
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);