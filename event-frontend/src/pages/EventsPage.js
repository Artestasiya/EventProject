import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventsPage.css';
import backgroundImage from '../images/background.jpg';
import { fetchPlaces, fetchCategories, fetchEvents, searchEvents } from '../services/eventsService'; 



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
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [placesData, categoriesData] = await Promise.all([
                    fetchPlaces(),
                    fetchCategories(),
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

    useEffect(() => {
        const fetchEventsData = async () => {
            try {
                const eventsData = await fetchEvents(formData, currentPage);
                setEventData(eventsData.events);
                setFilteredEvents(eventsData.events);
                setTotalPages(eventsData.totalPages);
            } catch (err) {
                console.error('Error fetching events:', err);
                setServerError('Error fetching events. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventsData();
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
        const searchTerm = e.target.value;
        setFilteredEvents(searchEvents(eventData, searchTerm));
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handleEventClick = (eventId) => {
        navigate(`/event/${eventId}`);
    };

    return (
        <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="container">
                <div className="top-bar">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                        onChange={handleSearchChange}
                    />
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

export default EventsPage;
