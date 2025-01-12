import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';
import { fetchProfile, deleteEvent } from '../services/profileService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const data = await fetchProfile(token);  
                setUser(data.user);
                setEvents(data.events);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setServerError(error.message || 'Server error. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleBackClick = () => {
        navigate(user?.role === true || user?.role === 1 ? '/admin' : '/event');
    };

    const handleDeleteEvent = async (eventId) => {
        const token = localStorage.getItem('authToken');
        try {
            await deleteEvent(eventId, token);  
            setEvents(events.filter((event) => event.id_event !== eventId)); 
        } catch (error) {
            console.error('Error removing event:', error);
            alert(error.message || 'Server error. Please try again later.');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-info">
                <button className="back-button" onClick={handleBackClick}>
                    ⬅ Back
                </button>

                {serverError && <p className="error">{serverError}</p>}

                {isLoading ? (
                    <p>Loading profile...</p>
                ) : user ? (
                    <>
                        <h2>
                            {user.name} {user.surname}
                        </h2>
                        <p>Email: {user.email}</p>
                        <p>
                            Дата рождения:{' '}
                            {user.data_birth
                                ? new Date(user.data_birth).toISOString().split('T')[0]
                                : 'Не указана'}
                        </p>

                        <h3>Registered Events:</h3>
                        {events.length > 0 ? (
                            <ul>
                                {events.map((event) => (
                                    <li key={event.id_event}>
                                        {event.event_name} -
                                        {new Date(event.event_date).toLocaleDateString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                        <br />
                                        <button
                                            onClick={() => handleDeleteEvent(event.id_event)}
                                            className="delete-btn"
                                        >
                                            ❌
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No events registered.</p>
                        )}
                    </>
                ) : (
                    <p>Failed to load user data.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
