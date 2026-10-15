import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import '@fontsource-variable/dm-sans/wght.css';
import '@fontsource-variable/space-grotesk/wght.css';

const root = document.getElementById('root')!;
const app = <React.StrictMode><App /></React.StrictMode>;
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
