import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg'; 

// Creating the express app
const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

//creating the connection to the database
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'postgres-db',
    database: 'feedbackdb',
    password: 'password',
    port: 5432,
});


// creating the feedback Table
const createTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS feedback (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                text TEXT NOT NULL
            );
        `);
        console.log('Table created successfully');
    } catch (error) {
        console.error('Error creating table:', error);
    }
};

createTable();

// Determining directory and file location
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const feedbackDirPath = path.join(__dirname, 'data');
const feedbackFilePath = path.join(feedbackDirPath, 'feedback.json');

// Helper functions
const loadFeedback = async () => {
    try {
        const data = await fs.readFile(feedbackFilePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }   
}

const saveFeedback = async (feedback) => {
    await fs.writeFile(feedbackFilePath, JSON.stringify(feedback, null, 2));
}

// POST /feedback - fuegt neues Feedback hinzu
app.post('/feedback', async (req, res) => {
    const { title, text } = req.body;

    if (!title || !text ) {
        return res.status(400).json({ message: "title und text sind im body erforderlich." })
    }
    
    try {
        const query = 'INSERT INTO feedback (title, text) VALUES ($1, $2);';
        await pool.query(query, [title, text]);
        res.status(201).json({ message: "Feedback erfolgreich gespeichert."});
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Speichern des Feedbacks." });
    }

});

// GET /feedback - gibt alle Feedback Eintraege zurueck
app.get('/feedback', async (req, res) => {

    try {
        const query = 'SELECT * FROM feedback;';
        const result = await pool.query(query);
        res.status(200).json(result.rows);

    } catch (error) {
        res.status(500).json({ message: "Fehler beim Abrufen des Feedbacks." });
    }

});


// DELETE /feedback/title - Loescht Feeback mit dem gegebenen title
app.delete('/feedback/:title', async (req, res) => {
    const { title } = req.params;

    try {
        const query = 'DELETE FROM feedback WHERE title = $1';
        await pool.query(query, [title]);
        

        if ( result. rowCount === 0) {
            return res.status(404).json({ message: "Feedback nicht gefunden. " });
        }

        
        res.status(200).json({ message: "Feedback erfolgreich geloescht." });

    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Loeschen des Feedbacks.' });
    }

});


app.listen(PORT, ()=> {
    console.log(`Server laeuft auf http://localhost:${PORT}`);
});