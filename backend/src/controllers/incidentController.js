import { IncidentService } from "../services/incidentService.js";
import { connectDB } from "../config/database.js";
import { MongoClient, ObjectId } from "mongodb";
import axios from "axios";
import { suggestFix } from "../services/LLM.js";

export const getAllIncidents = async (req, res) => {
  try {
    const db = await connectDB();
    const searchTerm = req.query.searchTerm || "";
    const sortBy = req.query.sortBy || "created_at"; // default sort
    const order = req.query.order === "asc" ? 1 : -1; // MongoDB uses 1 for ASC, -1 for DESC
    const query = searchTerm
      ? {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },
            { id: { $regex: searchTerm, $options: "i" } },
            { urgency: { $regex: searchTerm, $options: "i" } },
            { date: { $regex: searchTerm, $options: "i" } }, // assuming date is a string
            { status: { $regex: searchTerm, $options: "i" } },
          ],
        }
      : {};

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalRecords = await db.collection("incidents").countDocuments(query);
    const totalPages = Math.ceil(totalRecords / limit);

    const incidents = await db
      .collection("incidents")
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: order })
      .toArray(); // fetch all docs
    res.json({ totalPages: totalPages, incidents });
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

export const viewIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    const incident = await db
      .collection("incidents")
      .findOne({ _id: new ObjectId(id) });
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }
    res.json({ incident: incident });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const analyzeWithFastApi = async (req, res) => {
  try {
    const { prompt } = req.body;
    const fix = await suggestFix(prompt);
    res.json({ analysis: fix });
  } catch (error) {
    console.error("Error calling Python model API:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
};

export const analyzeWithInferenceApi = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      "http://host.docker.internal:8000/generate",
      {
        prompt,
      }
    );
    res.json({ analysis: response.data.response });
  } catch (error) {
    console.error("Error calling Hugging Face local model:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
};
