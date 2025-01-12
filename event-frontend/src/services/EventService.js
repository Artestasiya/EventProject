const API_BASE_URL = 'http://localhost:5000/api';

export const EventService = {
    async fetchEventDetails(eventId) {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch event details');
        }
        return response.json();
    },

    async registerForEvent(eventId) {
        const token = localStorage.getItem('authToken');
        if (!token) throw new Error('Please log in to register for the event.');

        const response = await fetch(`${API_BASE_URL}/events/${eventId}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register for event');
        }
        return response.json();
    }
};
