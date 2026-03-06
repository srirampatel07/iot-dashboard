const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Render requires dynamic PORT
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// Root route (loads dashboard)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ================== BIN STORAGE =====================
let bins = {
  A: { id: "A", name: "Dustbin A", weight: 0, level: 100, fullBy: "none", updatedAt: null },
  B: { id: "B", name: "Dustbin B", weight: 0, level: 100, fullBy: "none", updatedAt: null },
  C: { id: "C", name: "Dustbin C", weight: 0, level: 100, fullBy: "none", updatedAt: null },
  D: { id: "D", name: "Dustbin D", weight: 0, level: 100, fullBy: "none", updatedAt: null },
};

// ================== GET all bins =====================
app.get("/api/bins", (req, res) => {
  res.json(Object.values(bins));
});

// ================== ESP POST UPDATE ==================
app.post("/api/update-bin", (req, res) => {
  const { binId, weight, level, fullBy } = req.body;
  const id = (binId || "").toUpperCase();

  if (!bins[id]) {
    return res.status(400).json({ error: "Invalid BIN ID" });
  }

  if (typeof weight === "number") bins[id].weight = weight;
  if (typeof level === "number") bins[id].level = level;
  if (typeof fullBy === "string") bins[id].fullBy = fullBy;

  bins[id].updatedAt = new Date().toISOString();

  return res.json({ status: "ok", bin: bins[id] });
});

// ================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Smart Dustbin Server Running → http://localhost:${PORT}`);
});