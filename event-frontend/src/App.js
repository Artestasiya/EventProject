import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage'; 
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage'; 
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';  
import AddPage from './pages/AddPage';
import EventDetailPage from './pages/EventDetailPage';
import EditPage from './pages/EditPage';

const App = () => {
    return (
        <AuthProvider> 
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/event" element={<EventsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/add-event" element={<AddPage />} />
                <Route path="/event/:eventId" element={<EventDetailPage />} />
                <Route path="/edit-event/:eventId" element={<EditPage />} /> 
            </Routes>
        </AuthProvider>
    );
};

export default App;
