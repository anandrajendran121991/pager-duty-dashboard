import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function IncidentsTable() {
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/incidents");
        if (!response.ok) throw new Error("Failed to fetch incidents");
        const jsonData = await response.json();
        setIncidents(jsonData.incidents || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const handleCreate = () => {
    navigate("/create");
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/incidents/query?${searchTerm}`
      );

      if (!response) {
        setError("failed to fetch incidents");
        return;
      }

      const jsonData = await response.json();
      setIncidents(jsonData.incidents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>please wait...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>PagerDuty Incidents</h2>
      <button onClick={handleCreate}>Create Incident</button>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Service</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td>No incidents found</td>
            </tr>
          ) : (
            incidents.map((incident) => (
              <tr key={incident.id}>
                <td>{incident.id}</td>
                <td>{incident.title}</td>
                <td>{incident.status}</td>
                <td>{incident.service?.summary || "N/A"}</td>
                <td>{incident.created_at}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentsTable;
