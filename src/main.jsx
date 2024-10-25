import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.scss';

import { GlobalProvider } from './provider/GlobalProvider';

const container = document.getElementById('root');
const root = createRoot(container);


root.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
);
