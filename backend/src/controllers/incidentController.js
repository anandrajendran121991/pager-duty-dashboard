import { IncidentService } from "../services/incidentService.js";
import { connectDB } from "../config/database.js";

export const getAllIncidents = async (req, res) => {
  try {
    const db = await connectDB();
    const incidents = await db.collection("incidents").find({}).toArray(); // fetch all docs
    res.json({ count: incidents.length, incidents });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({ error: error.message });
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

export const syncIncidents = async (req, res) => {
  try {
    const provider = req.query.provider || "pagerduty";
    const data = await IncidentService.getIncidents(provider);

    const db = await connectDB();
    const collection = db.collection("incidents");

    // Prepare bulk operations
    const bulkOps = data.incidents.map((incident) => ({
      updateOne: {
        filter: { id: incident.id },
        update: {
          $set: {
            id: incident.id,
            title: incident.title,
            status: incident.status,
            created_at: incident.created_at,
            urgency: incident.urgency,
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      const result = await collection.bulkWrite(bulkOps);
      res.json({
        message: "Incidents synced",
        matched: result.matchedCount,
        modified: result.modifiedCount,
        upserted: result.upsertedCount,
      });
    } else {
      res.json({ message: "No incidents to sync" });
    }
  } catch (error) {
    console.error("Error syncing incidents:", error);
    res.status(500).json({ error: error.message });
  }
};
