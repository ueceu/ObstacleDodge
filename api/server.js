const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

const scoreSchema = new mongoose.Schema({
  username: String,
  hits: Number,
  time: Number,
  penalty: Number,
  total: Number
});

const Score = mongoose.model('Score', scoreSchema);

app.post('/submit', async (req, res) => {
  try {
    const { name, hits, time } = req.body;
    const penalty = hits * 0.5;
    const total = time + penalty;
    const newScore = new Score({ username: name, hits, penalty, time, total });
    await newScore.save();
    res.json({ message: 'Score saved!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving score' });
  }
});

app.get('/leaderboard', async (req, res) => {
  try {
    const scores = await Score.find().sort({ total: -1 }).limit(10);
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = app;
