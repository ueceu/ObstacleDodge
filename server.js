// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas bağlantısı
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Schema & Model
const scoreSchema = new mongoose.Schema({
    username: String,   // player name
    hits: Number,
    time: Number,       // elapsed time
    penalty: Number,    // hits * 0.5
    total: Number       // time + penalty
});

const Score = mongoose.model('Score', scoreSchema);

// POST /submit → Skor ekle
app.post('/submit', async (req, res) => {
    try {
        const { name, hits, time } = req.body;
        const penalty = hits * 0.5;
        const total = time + penalty;  // total = süre + penalty
        const newScore = new Score({ username: name, hits, penalty, time, total });
        await newScore.save();
        res.json({ message: 'Score saved!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error saving score' });
    }
});

// GET /leaderboard → Top 10 skor
app.get('/leaderboard', async (req, res) => {
    try {
        // total yüksekten düşüğe sıralanacak
        const scores = await Score.find().sort({ total: -1 }).limit(10);
        res.json(scores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
