const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// TEST ROUTE (çok önemli)
app.get('/', (req, res) => {
  res.json({ status: 'API working' });
});

// Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const scoreSchema = new mongoose.Schema({
  username: String,
  hits: Number,
  time: Number,
  penalty: Number,
  total: Number
});

const Score = mongoose.model('Score', scoreSchema);

// SUBMIT
app.post('/submit', async (req, res) => {
  try {
    const { name, hits, time } = req.body;
    const penalty = hits * 0.5;
    const total = time + penalty;

    await Score.create({
      username: name,
      hits,
      time,
      penalty,
      total
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// LEADERBOARD
app.get('/leaderboard', async (req, res) => {
  const scores = await Score.find()
    .sort({ total: -1 })
    .limit(10);

  res.json(scores);
});


module.exports = app;
