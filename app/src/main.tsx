import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux';
import store from './redux/store';
import { ValidationProvider } from './context/validationContext';
import { AuthProvider } from './context/AuthContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
      <ValidationProvider>
        <App />
      </ValidationProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
