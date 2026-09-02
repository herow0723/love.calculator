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