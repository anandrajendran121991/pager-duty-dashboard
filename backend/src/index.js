import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import incidentsRouter from "./routes/pager-duty/incidentsRouter.js"; // fixed path
import { loadModel } from "./services/LLM.js";

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

let modelReady = false;

// Load model on startup
loadModel()
  .then(() => {
    modelReady = true;
  })
  .catch((err) => {
    console.error("Failed to load model:", err);
  });

// Mount your routes **before** app.listen
app.use("/api/incidents", incidentsRouter);

// Root route
app.get("/api", (req, res) => {
  res.json({ message: "The application is up and running!" });
});

app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
