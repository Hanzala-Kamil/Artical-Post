import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId="409591594507-heq02m2g88aikoigsnvehsgs83msppc2.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>;
  </React.StrictMode>,
)
