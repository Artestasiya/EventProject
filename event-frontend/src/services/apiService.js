const API_BASE_URL = 'http://localhost:5000/api';

export const fetchPlaces = async () => {
    const response = await fetch(`${API_BASE_URL}/places`);
    if (!response.ok) throw new Error('Failed to fetch places');
    return response.json();
};

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const fetchEventData = async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/edit`);
    if (!response.ok) throw new Error('Failed to fetch event data');
    return response.json();
};

export const updateEvent = async (eventId, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...eventData,
            date: new Date(eventData.date).toISOString(), 
        }),
    });
    if (!response.ok) throw new Error('Failed to update event');
};

export const deleteEvent = async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/delete`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
};

export const addEvent = async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/add_events`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to add event');
    return response.json();
};
