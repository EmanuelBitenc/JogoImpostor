import { renderToString } from 'react-dom/server';
import App from './App';

// Runs only during the build. Hosting remains completely static.
export function render() { return renderToString(<App />); }
