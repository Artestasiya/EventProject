import React, { useState, useEffect } from 'react';

const EventsList = ({ filter }) => {
    const [events, setEvents] = useState([]);

    // Запрос на сервер с фильтрами
    useEffect(() => {
        const fetchEvents = async () => {
            const queryParams = new URLSearchParams(filter).toString();
            const response = await fetch(`http://localhost:5000/api/events?${queryParams}`);
            const data = await response.json();
            setEvents(data);
        };

        fetchEvents();
    }, [filter]);

    return (
        <div>
            {events.length > 0 ? (
                <ul>
                    {events.map(event => (
                        <li key={event.id_event}>
                            <h2>{event.name}</h2>
                            <p>{event.description}</p>
                            <p>{new Date(event.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No events found</p>
            )}
        </div>
    );
};

export default EventsList;
