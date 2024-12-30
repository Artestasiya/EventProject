import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css';
import backgroundImage from '../images/background.jpg';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                const data = await response.json();
                if (response.ok) {
                    setEventData({
                        ...data,
                        participants: data.participants || [],
                    });
                } else {
                    setServerError(data.message || 'Error fetching event details');
                }
            } catch (error) {
                console.error('Error fetching event:', error);
                setServerError('Server error. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        } else {
            setServerError('Event not found.');
            setIsLoading(false);
        }
    }, [eventId]);

    const handleRegisterClick = async () => {
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert('Please log in first!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error registering for event:', error);
            alert('Server error during registration');
        }
    };

    if (isLoading) {
        return <p>Loading event details...</p>;
    }

    if (!eventData) {
        return <p>{serverError || 'Event not found'}</p>;
    }

    return (
        <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="event-detail-container">
                {serverError && <p className="error">{serverError}</p>}

                <div className="event-detail">
                    <button className="back-button" onClick={() => window.history.back()}>Back</button>

                    <img src={eventData.image || 'default-image.jpg'} alt={eventData.name} className="event-image" />
                    <div className="event-info">
                        <h1>{eventData.name}</h1>
                        <p>{eventData.description}</p>
                        <p>Date: {new Date(eventData.date).toLocaleString()}</p>
                        <p>Place: {eventData.place_name}</p>
                        <p>Category: {eventData.category_name}</p>

                        <p>Maximum Participants: {eventData.max_amount != null ? eventData.max_amount : 'No limit'}</p>

                        <h3>Participants ({eventData.participants.length}{eventData.max_amount != null ? `/${eventData.max_amount}` : ''}):</h3>
                        <ul>
                            {eventData.participants.length > 0 ? (
                                eventData.participants.map((participant, index) => (
                                    <li key={index}>
                                        {participant.name} {participant.surname}
                                        {/* Displaying registration date and time */}
                                        - Registered on: {new Date(participant.reg_date).toLocaleString('ru-RU', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                            hour12: true,
                                        })}
                                    </li>
                                ))
                            ) : (
                                <p>No participants yet.</p>
                            )}
                        </ul>

                        <button
                            onClick={handleRegisterClick}
                            disabled={eventData.max_amount && eventData.participants.length >= eventData.max_amount}
                        >
                            {eventData.max_amount && eventData.participants.length >= eventData.max_amount
                                ? 'Event Full'
                                : 'Register for Event'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
