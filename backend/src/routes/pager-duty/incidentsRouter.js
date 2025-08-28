import express from "express";
import {
  createIncident,
  getAllIncidents,
  syncIncidents,
  viewIncident,
  analyzeWithFastApi,
  analyzeWithInferenceApi,
} from "../../controllers/incidentController.js";

const router = express.Router();

// Sync incidents from PagerDuty
router.get("/sync", syncIncidents);
router.get("/", getAllIncidents); // GET /api/incidents
router.post("/", createIncident); // POST /api/incidents
router.get("/:id", viewIncident); // GET /api/incidents/id
router.post("/analyze", analyzeWithFastApi); // POST /api/incidents/analyze

export default router;
