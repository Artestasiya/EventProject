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

export const fetchEvents = async (filters, currentPage) => {
    const { id_category, id_place, date } = filters;
    const queryParams = new URLSearchParams();

    if (id_category) queryParams.append('category', id_category);
    if (id_place) queryParams.append('place', id_place);
    if (date) queryParams.append('date', date);
    queryParams.append('page', currentPage);
    queryParams.append('limit', 10);

    const response = await fetch(`${API_BASE_URL}/events?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
};

export const searchEvents = (events, searchText) => {
    return events.filter(
        (event) =>
            event.name.toLowerCase().includes(searchText.toLowerCase()) ||
            event.id_event.toString().includes(searchText)
    );
};
