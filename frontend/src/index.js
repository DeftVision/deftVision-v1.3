import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./utilities/AuthContext";
import {NotificationProvider} from "./utilities/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <AuthProvider>
          <NotificationProvider>
              <Router>
                  <App />
              </Router>
          </NotificationProvider>
      </AuthProvider>
    </React.StrictMode>
);