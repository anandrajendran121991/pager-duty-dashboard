import { IncidentService } from "../services/incidentService.js";

export const getIncidents = async (req, res) => {
  try {
    const provider = req.query.provider || "pagerduty"; // can pass ?provider=pagerduty
    const data = await IncidentService.getIncidents(provider);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new incident

export const createIncident = async (req, res) => {
  try {
    const { title, description } = req.body;
    const provider = req.query.provider || "pagerduty";
    const incident = await IncidentService.createIncident(
      { title, description },
      provider
    );

    res.status(201).json({
      message: `Incident created successfully in ${provider}`,
      incident,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
