const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

// Database
const db = new Database("love-calculator.db");

db.prepare(`
  CREATE TABLE IF NOT EXISTS checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    boy TEXT NOT NULL,
    girl TEXT NOT NULL,
    percentage INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your website
app.use(express.static(path.join(__dirname, "public")));

// Calculate compatibility
app.post("/api/calculate", (req, res) => {
  const boy = String(req.body.boy || "").trim();
  const girl = String(req.body.girl || "").trim();

  if (!boy || !girl) {
    return res.status(400).json({ error: "Please enter both names." });
  }

  const boyLower = boy.toLowerCase();
  const girlLower = girl.toLowerCase();

  let percentage;

  // Special combination
  if (boyLower === "pavan" && girlLower === "aditi") {
    percentage = 100;
  }

  // Any boy + Aditi = below 50
  else if (girlLower === "aditi") {
    percentage = Math.floor(Math.random() * 50);
  }

  // All other combinations = 0–90
  else {
    percentage = Math.floor(Math.random() * 91);
  }

  // Save history
  db.prepare(`
    INSERT INTO checks (boy, girl, percentage)
    VALUES (?, ?, ?)
  `).run(boy, girl, percentage);

  res.json({ percentage });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});