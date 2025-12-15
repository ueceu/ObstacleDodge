const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const scoreSchema = new mongoose.Schema({
  username: String,
  hits: Number,
  time: Number,
  penalty: Number,
  total: Number
});

const Score = mongoose.model("Score", scoreSchema);

app.post("/submit", async (req, res) => {
  try {
    const { name, hits, time } = req.body;
    const penalty = hits * 0.5;
    const total = time + penalty;

    const score = new Score({
      username: name,
      hits,
      time,
      penalty,
      total
    });

    await score.save();
    res.json({ message: "Score saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/leaderboard", async (req, res) => {
  const scores = await Score.find()
    .sort({ total: 1 })
    .limit(10);

  res.json(scores);
});

module.exports = app;
