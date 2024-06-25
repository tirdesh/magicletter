import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './redux/store';
import { ValidationProvider } from './context/validationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ValidationProvider>
        <App />
      </ValidationProvider>
    </Provider>
  </React.StrictMode>,
)
