import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import backgroundImage from '../images/background.jpg';

const AdminPage = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [serverError, setServerError] = useState('');
    const [searchText, setSearchText] = useState('');
    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        id_category: '',
        id_place: '',
        date: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch places and categories
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

    // Fetch events based on the filter
    useEffect(() => {
        const fetchEvents = async () => {
            const { id_category, id_place, date } = formData;
            const queryParams = new URLSearchParams();

            if (id_category) queryParams.append('category', id_category);
            if (id_place) queryParams.append('place', id_place);
            if (date) queryParams.append('date', date);
            queryParams.append('page', currentPage);
            queryParams.append('limit', 10);

            try {
                const response = await fetch(`http://localhost:5000/api/events?${queryParams.toString()}`);
                if (response.ok) {
                    const eventsData = await response.json();
                    setEventData(eventsData.events);
                    setFilteredEvents(eventsData.events);
                    setTotalPages(eventsData.totalPages);
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
    }, [formData, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        const filtered = eventData.filter(event =>
            event.name.toLowerCase().includes(value.toLowerCase()) ||
            event.id_event.toString().includes(value)
        );
        setFilteredEvents(filtered);
    };

    const handleEventClick = (eventId) => {
        navigate(`/edit-event/${eventId}`);
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
                        placeholder="Search by name or ID..."
                        className="search-bar"
                        value={searchText}
                        onChange={handleSearchChange}
                    />
                    <button className="add_event" onClick={() => navigate('/add-event')}>
                        Add Event
                    </button>
                    <button className="user-icon" onClick={() => navigate('/profile')}>
                        👤
                    </button>
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
                    <button
                        className="pagination-button"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                    >
                        ←
                    </button>
                    <span>{`Page ${currentPage} of ${totalPages}`}</span>
                    <button
                        className="pagination-button"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AdminPage;
