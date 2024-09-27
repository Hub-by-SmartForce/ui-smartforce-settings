import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.scss';

import { App } from './App/App';
import { ThemeTypeProvider } from '../src';

const root = document.querySelector('#root');

ReactDOM.render(
  <Router>
    <ThemeTypeProvider>
      <App />
    </ThemeTypeProvider>
  </Router>,
  root
);
