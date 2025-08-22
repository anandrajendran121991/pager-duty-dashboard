import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import incidentsRouter from "./routes/pager-duty/incidentsRouter.js"; // fixed path

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Mount your routes **before** app.listen
app.use("/api/incidents", incidentsRouter);

// Root route
app.get("/api", (req, res) => {
  res.json({ message: "The application is up and running!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
