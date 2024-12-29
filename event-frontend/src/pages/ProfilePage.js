import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setUser(data.user);
                    setEvents(data.events);
                } else {
                    setServerError(data.message || 'Failed to fetch profile data.');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                setServerError('Server error. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleBackClick = () => {
        if (user?.role === true || user?.role === 1) {
            navigate('/admin');
        } else {
            navigate('/event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/profile/event/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setEvents(events.filter(event => event.id_event !== eventId));
            } else {
                const data = await response.json();
                alert(data.message);
            }
        } catch (error) {
            console.error('Error removing event:', error);
            alert('Server error. Please try again later.');
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
                        <h2>{user.name} {user.surname}</h2>
                            <p>Email: {user.email}</p>
                            <p>Дата рождения: {user.data_birth ? new Date(user.data_birth).toISOString().split('T')[0] : 'Не указана'}</p>

                        <h3>Registered Events:</h3>
                        {events.length > 0 ? (
                            <ul>
                                {events.map(event => (
                                    <li key={event.id_event}>
                                        {event.event_name} - {event.event_date}
                                        <button
                                            onClick={() => handleDeleteEvent(event.id_event)}
                                            className="delete-btn">
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
