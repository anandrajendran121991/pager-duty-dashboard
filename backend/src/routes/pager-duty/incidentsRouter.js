import express from "express";
import {
  createIncident,
  getIncidents,
} from "../../controllers/incidentController.js";

const router = express.Router();

router.get("/", getIncidents); // GET /api/incidents
router.post("/", createIncident); // POST /api/incidents

export default router;
