import React from 'react';

import PopupManager from '@popup/PopupManager';
import PopupView from '@popup/PopupView';

import './App.css';

const App = () => (
  <PopupManager className='App'>
    <PopupView />
  </PopupManager>
);

export default App;
