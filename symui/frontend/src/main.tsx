import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as Container } from 'inversify-react';
import { Provider } from 'react-redux';

import App from './App';
import './main.css';
import { container } from './adapters/container';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Container container={container}>
      <Provider store={store}>
        <App />
      </Provider>
    </Container>
  </React.StrictMode>,
);
