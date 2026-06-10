import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Pointing to our single clean JSX component
import './App.css'; // Importing the style rules directly

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);