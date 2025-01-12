import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './EventDetailPage.css';
import backgroundImage from '../images/background.jpg';
import { EventService } from '../services/EventService';

const EventDetailPage = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        const loadEvent = async () => {
            try {
                const data = await EventService.fetchEventDetails(eventId);  // Используем сервис для получения данных
                setEventData(data);
            } catch (error) {
                setServerError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            loadEvent();
        } else {
            setServerError('Event not found.');
            setIsLoading(false);
        }
    }, [eventId]);

    const handleRegisterClick = async () => {
        try {
            await EventService.registerForEvent(eventId);  // Используем сервис для регистрации
            alert('Successfully registered for the event!');
            const updatedData = await EventService.fetchEventDetails(eventId);  // Обновляем данные события
            setEventData(updatedData);
        } catch (error) {
            alert(error.message);
        }
    };

    if (isLoading) return <p>Loading event details...</p>;
    if (!eventData) return <p>{serverError || 'Event not found'}</p>;

    return (
        <div
            className="background"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="event-detail-container">
                {serverError && <p className="error">{serverError}</p>}
                <div className="event-detail">
                    <button className="back-button" onClick={() => window.history.back()}>
                        Back
                    </button>
                    <img
                        src={eventData.image || 'default-image.jpg'}
                        alt={eventData.name}
                        className="event-image"
                    />
                    <div className="event-info">
                        <h1>{eventData.name}</h1>
                        <p>{eventData.description}</p>
                        <p>Date: {new Date(eventData.date).toLocaleString()}</p>
                        <p>Place: {eventData.place_name}</p>
                        <p>Category: {eventData.category_name}</p>
                        <p>
                            Maximum Participants:{' '}
                            {eventData.max_amount != null ? eventData.max_amount : 'No limit'}
                        </p>
                        <h3>
                            Participants ({eventData.participants.length}
                            {eventData.max_amount != null ? `/${eventData.max_amount}` : ''}):
                        </h3>
                        <ul>
                            {eventData.participants.length > 0 ? (
                                eventData.participants.map((participant, index) => (
                                    <li key={index}>
                                        {participant.name} {participant.surname} - Registered on:{' '}
                                        {new Date(participant.reg_date).toLocaleString('ru-RU', {
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
                            disabled={
                                eventData.max_amount &&
                                eventData.participants.length >= eventData.max_amount
                            }
                        >
                            {eventData.max_amount &&
                                eventData.participants.length >= eventData.max_amount
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
