import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
import { AuthContextProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
