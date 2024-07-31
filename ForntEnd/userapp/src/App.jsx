import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@coreui/coreui/dist/css/coreui.min.css';
import io from 'socket.io-client';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Otp from './pages/Otp';
import Home from './pages/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import ViewPost from './pages/Viewpost';
import Error from './pages/404';
import AdminSignup from './pages/AdminSignUp';
import AdminOtp from './pages/AdminOtp';
import AdminLogin from './pages/AdminLogin';
import AdminPanal from './pages/AdminPanal';
import AllUsers from './pages/AllUsers';
import Allposts from './pages/Allposts';

const socket = io('http://localhost:8000');

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/otp' element={<Otp />} />
        <Route path='/home' element={<Home socket={socket} />} />
        <Route path='/View-post' element={<ViewPost />} />
        <Route path='/admin-signup' element={<AdminSignup />} />
        <Route path='/admin-otp' element={<AdminOtp />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/admin-panal' element={<AdminPanal />} />
        <Route path='/all-users' element={<AllUsers />} />
        <Route path='/all-posts' element={<Allposts />} />
        <Route path='*' element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;