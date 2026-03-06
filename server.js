const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve frontend from public folder (index.html must be inside /public/)
app.use(express.static(path.join(__dirname, "public")));

// ================== BIN STORAGE =====================
// Now includes updatedAt field from the start
let bins = {
  A: { id: "A", name: "Dustbin A", weight: 0, level: 100, fullBy: "none", updatedAt: null },
  B: { id: "B", name: "Dustbin B", weight: 0, level: 100, fullBy: "none", updatedAt: null },
  C: { id: "C", name: "Dustbin C", weight: 0, level: 100, fullBy: "none", updatedAt: null },
  D: { id: "D", name: "Dustbin D", weight: 0, level: 100, fullBy: "none", updatedAt: null },
};

// ================== GET all bins =====================
app.get("/api/bins", (req, res) => {
  res.json(Object.values(bins)); // front-end receives {id,name,weight,level,fullBy,updatedAt}
});

// ================== ESP POST UPDATE ==================
// Body Example:
// {
//   "binId":"C",
//   "weight":2.1,
//   "level":30,
//   "fullBy":"level"     // "none","weight","level"
// }

app.post("/api/update-bin", (req, res) => {
  const { binId, weight, level, fullBy } = req.body;
  const id = (binId || "").toUpperCase();

  if (!bins[id]) {
    return res.status(400).json({ error: "Invalid BIN ID" });
  }

  // update values if present
  if (typeof weight === "number") bins[id].weight = weight;
  if (typeof level === "number") bins[id].level = level;
  if (typeof fullBy === "string") bins[id].fullBy = fullBy;

  // store timestamp in ISO format
  bins[id].updatedAt = new Date().toISOString();

  return res.json({ status: "ok", bin: bins[id] });
});

// ================== START SERVER =====================
app.listen(PORT, () => {
  console.log(`🚀 Smart Dustbin Server Running → http://localhost:${PORT}`);
});
