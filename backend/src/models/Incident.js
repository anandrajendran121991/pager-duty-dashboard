import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  status: String,
  created_at: Date,
  urgency: String,
});

export default mongoose.model("Incident", incidentSchema);
