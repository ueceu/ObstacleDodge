const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Schema
const scoreSchema = new mongoose.Schema({
  username: String,
  hits: Number,
  time: Number,
  penalty: Number,
  total: Number
});

const Score = mongoose.model("Score", scoreSchema);

// TEST ROUTE (ÇOK ÖNEMLİ)
app.get("/", (req, res) => {
  res.json({ status: "API working" });
});

// SUBMIT
app.post("/submit", async (req, res) => {
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
});

// LEADERBOARD
app.get("/leaderboard", async (req, res) => {
  const scores = await Score.find()
    .sort({ total: 1 })
    .limit(10);

  res.json(scores);
});

// 🔥 EN KRİTİK SATIR
module.exports = (req, res) => {
  app(req, res);
};
