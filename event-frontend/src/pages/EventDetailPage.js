import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css';
import backgroundImage from '../images/background.jpg';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');
    const [userId, setUserId] = useState(1); 

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
                const data = await response.json();
                console.log('Event data:', data); // Это поможет увидеть, что возвращает сервер

                if (response.ok) {
                    setEvent(data);
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

        fetchEvent();
    }, [eventId]);


    const handleRegisterClick = async () => {
        if (!userId) {
            alert('Please log in first!');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }), // Передаем userId в запросе
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                // Опционально: обновить данные о событии после успешной регистрации
                setEvent((prevEvent) => ({
                    ...prevEvent,
                    participants: [...(prevEvent.participants || []), { id: userId, name: 'Your Name' }],
                }));
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

    return (
        <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="event-detail-container">
                           {serverError && <p className="error">{serverError}</p>}

                {event ? (
                    <div className="event-detail">
                        <button className="back-button" onClick={() => window.history.back()}>Back</button>

                        <img src={event.image} alt={event.name} className="event-image" />
                        <div className="event-info">
                            <h1>{event.name}</h1>
                            <p>{event.description}</p>
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Place: {event.place_name}</p>
                            <p>Category: {event.category_name}</p>

                            <h3>Participants:</h3>
                            <ul>
                                {event.participants && event.participants.length > 0 ? (
                                    event.participants.map((participant, index) => (
                                        <li key={index}>
                                            {participant.name} {participant.surname}
                                        </li>
                                    ))
                                ) : (
                                    <p>No participants yet.</p>
                                )}
                            </ul>

                            <button onClick={handleRegisterClick}>Register for Event</button>
                        </div>
                    </div>
                ) : (
                    <p>Event not found</p>
                )}
            </div>
        </div>
    );
};

export default EventDetailPage;
