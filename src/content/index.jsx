import React from 'react';
import ReactDOM from 'react-dom/client';

import { CONTENT_SCRIPT_ROOT_CLASS } from '@constants/index';
import Highlighter from '@content/Highlighter';

import './index.css';

// Content scripts don't use an HTML file, so we need to create our root element and append it to the DOM before mounting our React app

const root = document.createElement('div');
root.id = CONTENT_SCRIPT_ROOT_CLASS;
document.body.append(root);

ReactDOM.createRoot(document.getElementById('cs-root')).render(
  <React.StrictMode>
    <Highlighter />
  </React.StrictMode>
);
