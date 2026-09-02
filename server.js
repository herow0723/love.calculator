const express = require("express");
const path = require("path");
const Database = require("better-sqlite3");
const session = require("express-session");

const app = express();

app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

const ADMIN_PASSWORD = String(process.env.ADMIN_PASSWORD || "").trim();
const SESSION_SECRET = String(process.env.SESSION_SECRET || "").trim();

if (!ADMIN_PASSWORD || !SESSION_SECRET) {
    console.error("Missing ADMIN_PASSWORD or SESSION_SECRET.");
    process.exit(1);
}


// =========================
// DATABASE
// =========================

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


// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);


// =========================
// WEBSITE
// =========================

app.use(express.static(path.join(__dirname, "public")));

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "admin.html"));
});


// =========================
// LOVE CALCULATOR
// =========================

app.post("/api/calculate", (req, res) => {
    const boy = String(req.body.boy || "").trim();
    const girl = String(req.body.girl || "").trim();

    if (!boy || !girl) {
        return res.status(400).json({
            error: "Please enter both names."
        });
    }

    const boyLower = boy.toLowerCase();
    const girlLower = girl.toLowerCase();

    let percentage;

    if (boyLower === "pavan" && girlLower === "aditi") {
        percentage = 100;
    } else if (girlLower === "aditi") {
        percentage = Math.floor(Math.random() * 50);
    } else {
        percentage = Math.floor(Math.random() * 91);
    }

    db.prepare(`
        INSERT INTO checks (boy, girl, percentage)
        VALUES (?, ?, ?)
    `).run(boy, girl, percentage);

    res.json({
        percentage: percentage
    });
});


// =========================
// ADMIN LOGIN
// =========================

app.post("/api/admin/login", (req, res) => {
    const password = String(req.body.password || "").trim();

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({
            error: "Incorrect password."
        });
    }

    req.session.isAdmin = true;

    req.session.save((error) => {
        if (error) {
            console.error("Session save error:", error);

            return res.status(500).json({
                error: "Could not create admin session."
            });
        }

        res.json({
            success: true
        });
    });
});


// =========================
// ADMIN AUTHENTICATION
// =========================

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin === true) {
        next();
        return;
    }

    res.status(401).json({
        error: "Unauthorized."
    });
}


// =========================
// GET ADMIN HISTORY
// =========================

app.get("/api/admin/checks", requireAdmin, (req, res) => {
    const entries = db.prepare(`
        SELECT boy, girl, percentage, created_at
        FROM checks
        ORDER BY id DESC
    `).all();

    res.json(entries);
});


// =========================
// DELETE ADMIN HISTORY
// =========================

app.delete("/api/admin/checks", requireAdmin, (req, res) => {
    db.prepare("DELETE FROM checks").run();

    res.json({
        success: true
    });
});


// =========================
// ADMIN LOGOUT
// =========================

app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                error: "Could not log out."
            });
        }

        res.json({
            success: true
        });
    });
});


// =========================
// START SERVER
// =========================

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});