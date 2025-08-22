import express from "express";
import {
  createIncident,
  getAllIncidents,
  syncIncidents,
} from "../../controllers/incidentController.js";

const router = express.Router();

// Sync incidents from PagerDuty
router.get("/sync", syncIncidents);
router.get("/", getAllIncidents); // GET /api/incidents
router.post("/", createIncident); // POST /api/incidents

export default router;
