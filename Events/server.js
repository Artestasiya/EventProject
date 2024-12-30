const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sql = require('mssql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE', 
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
}));
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

const connectToDb = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('Connected to database.');
        return pool;
    } catch (err) {
        console.error('Database connection failed:', err.message);
        throw err;
    }
};

app.get('/api/events', async (req, res) => {
    const { place, category, date, page = 1, limit = 10 } = req.query;

    if (page < 1) {
        console.log('Invalid page:', page);
        return res.status(400).json({ message: 'Page must be greater than 0.' });
    }

    if (limit < 1) {
        console.log('Invalid limit:', limit);
        return res.status(400).json({ message: 'Limit must be greater than 0.' });
    }

    let query = `
        SELECT e.id_event, e.name, e.description, e.date, e.image, e.max_amount,
            p.name AS place_name, c.name AS category_name,
            (SELECT COUNT(*) FROM Member_event me WHERE me.id_event = e.id_event) AS participants_count
        FROM Events e
        INNER JOIN Place p ON e.id_place = p.id_place
        INNER JOIN Category c ON e.id_category = c.id_category
        WHERE 1=1
    `;
    const queryParams = [];

    if (place) {
        query += ` AND p.id_place = @place`;
        queryParams.push({ name: 'place', type: sql.Int, value: parseInt(place) });
    }
    if (category) {
        query += ` AND c.id_category = @category`;
        queryParams.push({ name: 'category', type: sql.Int, value: parseInt(category) });
    }
    if (date) {
        const formattedDate = new Date(date);
        if (isNaN(formattedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format.' });
        }
        query += ` AND CAST(e.date AS DATE) = @date`;
        queryParams.push({ name: 'date', type: sql.Date, value: formattedDate });
    }

    const offset = (page - 1) * limit;
    console.log('Pagination info - page:', page, 'limit:', limit, 'offset:', offset);
    query += ` ORDER BY e.date OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`;

    try {
        const pool = await connectToDb();
        const request = pool.request();

        queryParams.forEach(param => {
            request.input(param.name, param.type, param.value);
        });
        request.input('offset', sql.Int, offset);
        request.input('limit', sql.Int, limit);

        const eventsResult = await request.query(query);

        if (eventsResult.recordset.length === 0) {
            console.log('No events found with the given criteria.');
            return res.status(404).json({ message: 'No events found.' });
        }

        const totalResult = await pool
            .request()
            .query('SELECT COUNT(*) AS total FROM Events');

        const total = totalResult.recordset[0].total;

        res.json({
            events: eventsResult.recordset.map(e => ({
                id_event: e.id_event,
                name: e.name,
                description: e.description,
                date: e.date,
                image: e.image,
                max_amount: e.max_amount,
                place_name: e.place_name,
                category_name: e.category_name,
                participants_count: e.participants_count || 0,
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalCount: total,
                perPage: parseInt(limit),
            },
        });

    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    if (!firstName || !lastName || !email || !password || !dateOfBirth) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const pool = await connectToDb();

        const existingUser = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM Loggin WHERE email = @email');

        if (existingUser.recordset.length > 0) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool
            .request()
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('role', sql.Bit, false)
            .query('INSERT INTO Loggin (email, password, role) VALUES (@email, @password, @role)');

        await pool
            .request()
            .input('name', sql.NVarChar, firstName)
            .input('surname', sql.NVarChar, lastName)
            .input('email', sql.NVarChar, email)
            .input('data_birth', sql.Date, dateOfBirth)
            .query('INSERT INTO Member (name, surname, Email, data_birth) VALUES (@name, @surname, @email, @data_birth)');

        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const pool = await connectToDb();

        console.log('Checking user with email:', email); 

        const userResult = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id_loggin, email, role, password FROM Loggin WHERE email = @email');

        const user = userResult.recordset[0];

        if (!user) {
            console.log('User not found:', email); 
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        console.log('User found:', user.email); 

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            console.log('Incorrect password for user:', email); 
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        console.log('Password correct for user:', email); 

        const token = jwt.sign(
            { userId: user.id_loggin, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );

        console.log('Token generated for user:', email);

        res.json({
            message: 'Login successful.',
            token,
            role: user.role,
            email: user.email  
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.post('/api/add_events', async (req, res) => {
    const { name, description, date, id_place, id_category, max_amount, image } = req.body;

    if (!name || !description || !date || !id_place || !id_category || !max_amount || !image) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const pool = await connectToDb();

        await pool
            .request()
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('date', sql.DateTime, new Date(date))
            .input('id_place', sql.Int, id_place)
            .input('id_category', sql.Int, id_category)
            .input('max_amount', sql.Int, max_amount)
            .input('image', sql.NVarChar, image)
            .query(`
                INSERT INTO Events (name, description, date, id_place, id_category, max_amount, image)
                VALUES (@name, @description, @date, @id_place, @id_category, @max_amount, @image)
            `);

        res.status(201).json({ message: 'Event added successfully.' });
    } catch (err) {
        console.error('Error adding event:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/places', async (req, res) => {
    try {
        const pool = await connectToDb();
        const placesResult = await pool
            .request()
            .query('SELECT id_place, name FROM Place');

        if (placesResult.recordset.length === 0) {
            return res.status(404).json({ message: 'No places found.' });
        }

        res.json(placesResult.recordset);
    } catch (err) {
        console.error('Error fetching places:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const pool = await connectToDb();
        const categoriesResult = await pool
            .request()
            .query('SELECT id_category, name FROM Category');

        if (categoriesResult.recordset.length === 0) {
            return res.status(404).json({ message: 'No categories found.' });
        }

        res.json(categoriesResult.recordset);
    } catch (err) {
        console.error('Error fetching categories:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/events/:eventId', async (req, res) => {
    let { eventId } = req.params;

    const parsedEventId = parseInt(eventId, 10);

    if (isNaN(parsedEventId)) {
        return res.status(400).json({ message: 'Invalid eventId parameter.' });
    }

    try {
        const pool = await connectToDb();

        const eventResult = await pool
            .request()
            .input('eventId', sql.Int, parsedEventId)
            .query(`
                SELECT 
                    e.id_event, e.name, e.description, e.date, e.image, e.max_amount,
                    p.name AS place_name,
                    c.name AS category_name
                FROM Events e
                INNER JOIN Place p ON e.id_place = p.id_place
                INNER JOIN Category c ON e.id_category = c.id_category
                WHERE e.id_event = @eventId
            `);

        if (eventResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        const event = eventResult.recordset[0];

        const participantsResult = await pool
            .request()
            .input('eventId', sql.Int, parsedEventId)
            .query(`
                SELECT 
                    m.name, m.surname, m.email, me.reg_date
                FROM Member_event me
                INNER JOIN Member m ON me.id_member = m.id_member
                WHERE me.id_event = @eventId
            `);

        // Add participants with their registration dates
        event.participants = participantsResult.recordset.map(participant => ({
            ...participant,
            reg_date: participant.reg_date ? new Date(participant.reg_date).toISOString() : null
        }));

        res.json(event);
    } catch (err) {
        console.error('Error fetching event details:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});


app.post('/api/events/:eventId/register', authenticateToken, async (req, res) => {
    const { eventId } = req.params;
    const { email } = req.user;

    if (!eventId) {
        return res.status(400).json({ message: 'Event ID is required.' });
    }

    try {
        const pool = await connectToDb();

        const memberResult = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id_member FROM Member WHERE email = @email');

        if (memberResult.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const userId = memberResult.recordset[0].id_member;

        const eventResult = await pool
            .request()
            .input('id_event', sql.Int, eventId)
            .query('SELECT max_amount FROM Events WHERE id_event = @id_event');

        if (eventResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        const maxAmount = eventResult.recordset[0].max_amount;

        const participantCountResult = await pool
            .request()
            .input('id_event', sql.Int, eventId)
            .query('SELECT COUNT(*) AS count FROM Member_event WHERE id_event = @id_event');

        const currentCount = participantCountResult.recordset[0].count;

        if (currentCount >= maxAmount) {
            return res.status(400).json({ message: 'Event is fully booked.' });
        }

        const existingRegistration = await pool
            .request()
            .input('id_event', sql.Int, eventId)
            .input('id_member', sql.Int, userId)
            .query('SELECT * FROM Member_event WHERE id_event = @id_event AND id_member = @id_member');

        if (existingRegistration.recordset.length > 0) {
            return res.status(400).json({ message: 'You are already registered for this event.' });
        }

        await pool
            .request()
            .input('id_event', sql.Int, eventId)
            .input('id_member', sql.Int, userId)
            .input('reg_date', sql.DateTime, new Date())
            .query(`
                INSERT INTO Member_event (id_event, id_member, reg_date) 
                VALUES (@id_event, @id_member, @reg_date)
            `);

        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        console.error('Error registering for event:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});


app.put('/api/events/:eventId/update', async (req, res) => {
    const { eventId } = req.params;
    const { name, description, date, id_place, id_category, max_amount, image } = req.body;

    if (!name || !description || !date || !id_place || !id_category || !max_amount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const pool = await connectToDb();

        const result = await pool
            .request()
            .input('id_event', sql.Int, eventId)
            .input('name', sql.NVarChar, name)
            .input('description', sql.NVarChar, description)
            .input('date', sql.DateTime, new Date(date))
            .input('id_place', sql.Int, id_place)
            .input('id_category', sql.Int, id_category)
            .input('max_amount', sql.Int, max_amount)
            .input('image', sql.NVarChar, image || null)
            .query(`
                UPDATE Events
                SET name = @name,
                    description = @description,
                    date = @date,
                    id_place = @id_place,
                    id_category = @id_category,
                    max_amount = @max_amount,
                    image = @image
                WHERE id_event = @id_event
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.json({ message: 'Event updated successfully.' });
    } catch (err) {
        console.error('Error updating event:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/events/:eventId/edit', async (req, res) => {
    let { eventId } = req.params;

    const parsedEventId = parseInt(eventId, 10);

    if (isNaN(parsedEventId)) {
        return res.status(400).json({ message: 'Invalid eventId parameter.' });
    }

    try {
        const pool = await connectToDb();

        const eventResult = await pool
            .request()
            .input('eventId', sql.Int, parsedEventId) 
            .query(`
                SELECT 
                    e.id_event, e.name, e.description, e.date, e.image,
                    e.id_place, e.id_category, -- Добавляем id_place и id_category
                    e.max_amount, -- Добавляем max_amount
                    p.name AS place_name,
                    c.name AS category_name
                FROM Events e
                INNER JOIN Place p ON e.id_place = p.id_place
                INNER JOIN Category c ON e.id_category = c.id_category
                WHERE e.id_event = @eventId
            `);

        if (eventResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        const event = eventResult.recordset[0];

        const participantsResult = await pool
            .request()
            .input('eventId', sql.Int, parsedEventId) 
            .query(`
                SELECT m.name, m.surname, m.email
                FROM Member_event me
                INNER JOIN Member m ON me.id_member = m.id_member
                WHERE me.id_event = @eventId
            `);

        event.participants = participantsResult.recordset; 

        res.json(event);
    } catch (err) {
        console.error('Error fetching event details for editing:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.get('/api/profile', authenticateToken, async (req, res) => {
    const { email } = req.user;
    try {
        const pool = await connectToDb();

        const userResult = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT 
                    m.name, m.surname, m.email, m.data_birth,
                    l.email AS login_email, l.role,
                    e.id_event, e.name AS event_name, e.description AS event_description, e.date AS event_date
                FROM Member m
                JOIN Loggin l ON m.email = l.email
                LEFT JOIN Member_event me ON m.id_member = me.id_member
                LEFT JOIN Events e ON me.id_event = e.id_event
                WHERE m.email = @email
            `);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found or no events registered.' });
        }

        const userData = userResult.recordset[0];

        const events = userResult.recordset.map(event => ({
            id_event: event.id_event,
            event_name: event.event_name,
            event_description: event.event_description,
            event_date: event.event_date,
        }));

        res.json({
            user: {
                name: userData.name,
                surname: userData.surname,
                email: userData.email,
                login: userData.login_email,
                role: userData.role,
                data_birth: userData.data_birth,
            },
            events: events
        });

    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.delete('/api/profile/event/:eventId', authenticateToken, async (req, res) => {
    const { eventId } = req.params;
    const { email } = req.user;

    try {
        const pool = await connectToDb();
        const memberResult = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query('SELECT id_member FROM Member WHERE email = @email');

        if (memberResult.recordset.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const id_member = memberResult.recordset[0].id_member;

        const deleteResult = await pool
            .request()
            .input('id_member', sql.Int, id_member)
            .input('id_event', sql.Int, eventId)
            .query('DELETE FROM Member_event WHERE id_member = @id_member AND id_event = @id_event');

        if (deleteResult.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Event not found or not registered by user.' });
        }

        res.json({ message: 'Event removed successfully.' });
    } catch (err) {
        console.error('Error removing event:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.delete('/api/events/:eventId/delete', async (req, res) => {
    const { eventId } = req.params;
     
    try {
        const pool = await connectToDb();

        const result = await pool
            .request()
            .input('id_event', sql.Int, eventId)
            .query(`
                DELETE Events
                WHERE id_event = @id_event
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        res.json({ message: 'Event delete successfully.' });
    } catch (err) {
        console.error('Error delete event:', err.message);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
