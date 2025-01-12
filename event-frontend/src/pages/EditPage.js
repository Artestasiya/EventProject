import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditPage.css';
import backgroundImage from '../images/background.jpg';
import { fetchPlaces, fetchCategories, fetchEventData, updateEvent, deleteEvent } from '../services/apiService';

const EditPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        id_place: '',
        id_category: '',
        max_amount: '',
        image: '',
    });
    const [places, setPlaces] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Загрузка данных мест и категорий
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [placesData, categoriesData] = await Promise.all([fetchPlaces(), fetchCategories()]);
                setPlaces(placesData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error fetching places or categories:', err);
                setError('Failed to load places or categories. Please try again later.');
            }
        };
        loadInitialData();
    }, []);

    // Загрузка данных мероприятия
    useEffect(() => {
        const loadEventData = async () => {
            try {
                const eventData = await fetchEventData(eventId);
                setFormData({
                    name: eventData.name || '',
                    description: eventData.description || '',
                    date: new Date(eventData.date).toISOString().slice(0, 16),
                    id_place: eventData.id_place || '',
                    id_category: eventData.id_category || '',
                    max_amount: eventData.max_amount || '',
                    image: eventData.image || '',
                });
            } catch (err) {
                console.error('Error fetching event data:', err);
                setError('Failed to load event data. Please try again later.');
            }
        };
        loadEventData();
    }, [eventId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.name || !formData.description || !formData.date || !formData.id_place || !formData.id_category || !formData.max_amount) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        try {
            await updateEvent(eventId, formData);
            navigate('/admin');
        } catch (err) {
            console.error('Error updating event:', err);
            setError('Server error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await deleteEvent(eventId);
                navigate('/admin');
            } catch (err) {
                console.error('Error deleting event:', err);
                setError('Server error. Please try again later.');
            }
        }
    };

    const handleBackClick = () => navigate('/admin');

    return (
        <div className="edit-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <form className="edit-form" onSubmit={handleSubmit}>
                <button className="back" onClick={handleBackClick} type="button">
                    Back
                </button>
                <h1>Edit Event</h1>
                {error && <p className="error-message">{error}</p>}

                <label htmlFor="name">Event Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    required
                ></textarea>

                <label htmlFor="date">Date</label>
                <input
                    type="datetime-local"
                    id="date"
                    name="date"
                    value={formData.date || ''}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="id_place">Place</label>
                <select
                    id="id_place"
                    name="id_place"
                    value={formData.id_place || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a place</option>
                    {places.length > 0 ? (
                        places.map((place) => (
                            <option key={place.id_place} value={place.id_place}>
                                {place.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Loading places...</option>
                    )}
                </select>

                <label htmlFor="id_category">Category</label>
                <select
                    id="id_category"
                    name="id_category"
                    value={formData.id_category || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select a category</option>
                    {categories.length > 0 ? (
                        categories.map((category) => (
                            <option key={category.id_category} value={category.id_category}>
                                {category.name}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>Loading categories...</option>
                    )}
                </select>

                <label htmlFor="max_amount">Max Participants</label>
                <input
                    type="number"
                    id="max_amount"
                    name="max_amount"
                    value={formData.max_amount || ''}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="image">Image URL</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image || ''}
                    onChange={handleChange}
                    placeholder="Enter image URL or upload a file below"
                />


                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Submitting...' : 'Update Event'}
                </button>
                <button onClick={handleDelete} className="delete-btn">Delete Event</button>
            </form>
        </div>
    );
};

export default EditPage;
