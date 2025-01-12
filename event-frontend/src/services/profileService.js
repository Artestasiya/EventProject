const API_BASE_URL = 'http://localhost:5000/api'; 

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
    }
    return response.json();
};

export const fetchProfile = async (token) => {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return handleResponse(response);
};

export const deleteEvent = async (eventId, token) => {
    const response = await fetch(`${API_BASE_URL}/profile/event/${eventId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
    return handleResponse(response);
};
