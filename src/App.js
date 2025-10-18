import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import BrowseServices from './pages/BrowseServices';
import BookingForm from './pages/BookingForm';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import RegisterProvider from './pages/RegisterProvider';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={styles.content}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<BrowseServices />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register-provider" element={<RegisterProvider />} />
          <Route path="/userdashboard" element={<Profile />} />

          
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

const styles = {
  content: {
    minHeight: '80vh',
    padding: '1rem',
    backgroundColor: '#fff',
  },
};

export default App;
