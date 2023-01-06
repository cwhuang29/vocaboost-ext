import React from 'react';

import PopupManager from '@popup/PopupManager';
import PopupView from '@popup/PopupView';

import './App.css';

// import logo from '../assets/icons/logo.png';

const App = () => (
  <PopupManager className='App'>
    {/* <img src={Browser.runtime.getURL(logo)} alt='logo' /> */}
    <PopupView />
  </PopupManager>
);

export default App;
