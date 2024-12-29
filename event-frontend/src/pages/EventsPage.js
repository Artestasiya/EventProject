import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import backgroundImage from '../images/background.jpg';

const EventsPage = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [formData, setFormData] = useState({
        id_category: '',
        id_place: '',
        date: '',
    });
    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');

    // Состояние для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Загружаем категории и места
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [placesResponse, categoriesResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/places'),
                    fetch('http://localhost:5000/api/categories'),
                ]);

                if (!placesResponse.ok || !categoriesResponse.ok) {
                    throw new Error('Failed to fetch places or categories.');
                }

                const [placesData, categoriesData] = await Promise.all([
                    placesResponse.json(),
                    categoriesResponse.json(),
                ]);

                setPlaces(placesData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error fetching places or categories:', err);
                setServerError('Error fetching places or categories.');
            }
        };

        fetchData();
    }, []);

    // Загружаем события при изменении фильтров или текущей страницы
    useEffect(() => {
        const fetchEvents = async () => {
            const { id_category, id_place, date } = formData;
            const queryParams = new URLSearchParams();

            if (id_category) queryParams.append('category', id_category);
            if (id_place) queryParams.append('place', id_place);
            if (date) queryParams.append('date', date);
            queryParams.append('page', currentPage);  // Добавляем текущую страницу
            queryParams.append('limit', 10);  // Например, показываем по 10 событий на странице

            console.log('Request Params:', queryParams.toString());

            try {
                const response = await fetch(`http://localhost:5000/api/events?${queryParams.toString()}`);
                if (response.ok) {
                    const eventsData = await response.json();
                    console.log('Received Events Data:', eventsData);
                    setEventData(eventsData.events);  // Принимаем события
                    setFilteredEvents(eventsData.events);  // Отображаем только эти события
                    setTotalPages(eventsData.totalPages);  // Устанавливаем количество страниц
                } else {
                    setServerError('Failed to fetch events.');
                }
            } catch (err) {
                console.error('Error fetching events:', err);
                setServerError('Error fetching events. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [formData, currentPage]);  // Добавили currentPage в зависимости

    // Обработчик изменения фильтров
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCurrentPage(1);  // Сброс текущей страницы на 1 при изменении фильтров
    };

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="container">
                <div className="top-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        onChange={(e) =>
                            setFilteredEvents(
                                eventData.filter((event) =>
                                    event.name.toLowerCase().includes(e.target.value.toLowerCase())
                                )
                            )
                        }
                    />
                    <button className="user-icon" onClick={() => navigate('/profile')}>👤</button>
                </div>

                <div className="filters">
                    <select
                        id="id_category"
                        name="id_category"
                        value={formData.id_category}
                        onChange={handleFilterChange}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id_category} value={category.id_category}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <select
                        id="id_place"
                        name="id_place"
                        value={formData.id_place}
                        onChange={handleFilterChange}
                    >
                        <option value="">Select a place</option>
                        {places.map((place) => (
                            <option key={place.id_place} value={place.id_place}>
                                {place.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleFilterChange}
                    />
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
                                onClick={() => handleEventClick(event.id_event)}
                            >
                                <img src={event.image} alt={event.name} />
                                <div className="card-info">
                                    <h3>{event.name}</h3>
                                    <p>{event.description}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>

                <div className="pagination">
                    <button onClick={goToPreviousPage} disabled={currentPage === 1}>←</button>
                    <span>{`Page ${currentPage} of ${totalPages}`}</span>
                    <button onClick={goToNextPage} disabled={currentPage === totalPages}>→</button>
                </div>
            </div>
        </div>
    );
};

export default EventsPage;
