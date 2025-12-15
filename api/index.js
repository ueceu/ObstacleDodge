const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.post("/api/submit", async (req, res) => {
  const { name, hits, time } = req.body;
  const penalty = hits * 0.5;
  const total = time + penalty;

  await mongoose.model("Score").create({
    username: name,
    hits,
    time,
    penalty,
    total
  });

  res.json({ ok: true });
});

app.get("/api/leaderboard", async (req, res) => {
  const scores = await mongoose
    .model("Score")
    .find()
    .sort({ total: -1 })
    .limit(10);

  res.json(scores);
});

app.get('/', (req, res) => {
  res.json({ status: 'API working' });
});


module.exports = app;
