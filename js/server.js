const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Yasmeenbegum@123',
    database: 'rahman'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { first_name, last_name, password, confirm_password, phone_number, gender } = req.body;

    // Validate password
    if (!password || !confirm_password) {
        return res.status(400).json({ error: 'Password fields are required.' });
    }

    if (password !== confirm_password) {
        return res.status(400).json({ error: 'Passwords do not match.' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into the database using the hashed password
        const sql = 'INSERT INTO user_info (first_name, last_name, password, phone_number, gender) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [first_name, last_name, hashedPassword, phone_number, gender], (error, results) => {
            if (error) {
                console.error('Error executing query:', error); // Log the error
                return res.status(500).json({ error: 'An error occurred while processing your request.' });
            }
            res.status(201).json({ message: 'User created successfully!', userId: results.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error); // Log the error for debugging
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});