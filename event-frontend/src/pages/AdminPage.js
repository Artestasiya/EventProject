import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import backgroundImage from '../images/background.jpg';

const AdminPage = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]); // Для хранения отфильтрованных событий
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');
    const [searchText, setSearchText] = useState(''); // Состояние для текста поиска

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/events');
                const data = await response.json();
                if (response.ok) {
                    setEventData(data);
                    setFilteredEvents(data); // Изначально отображаем все события
                } else {
                    setServerError(data.message || 'Error fetching events');
                }
            } catch (error) {
                console.error('Error fetching events:', error);
                setServerError('Server error. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Обработчик изменения текста в поле поиска
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        // Фильтрация событий по названию или id_event
        const filtered = eventData.filter(event =>
            event.name.toLowerCase().includes(value.toLowerCase()) ||
            event.id_event.toString().includes(value)
        );
        setFilteredEvents(filtered); // Обновляем фильтрованные события
    };

    const handleEventClick = (eventId) => {
        navigate(`/edit-event/${eventId}`); // Переход к редактированию события
    };

    return (
        <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="container">
                <div className="top-bar">
                    <input
                        type="text"
                        placeholder="Search by name or ID..."
                        className="search-bar"
                        value={searchText}
                        onChange={handleSearchChange} // Обработчик ввода текста
                    />
                    <button className="add_event" onClick={() => navigate('/add-event')}>
                        Add Event
                    </button>
                    <button className="user-icon" onClick={() => navigate('/profile')}>
                        👤
                    </button>
                </div>

                {serverError && <p className="error">{serverError}</p>}

                <div className="event-cards">
                    {isLoading ? (
                        <p>Loading events...</p>
                    ) : filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <div
                                className="card"
                                key={event.id_event}
                                onClick={() => handleEventClick(event.id_event)} // Обработчик клика
                            >
                                <img src={event.image} alt={event.name} />
                                <div className="card-info">
                                    <h3>{event.name}</h3>
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>There are no events now</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
