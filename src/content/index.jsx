import React from 'react';
import ReactDOM from 'react-dom/client';

import Highlighter from '@content/Highlighter';

import './index.css';

// Content scripts don't use an HTML file, so we need to create our root element and append it to the DOM before mounting our React app

const root = document.createElement('div');
root.id = 'cs-root';
document.body.append(root);

ReactDOM.createRoot(document.getElementById('cs-root')).render(
  <React.StrictMode>
    <Highlighter />
  </React.StrictMode>
);
