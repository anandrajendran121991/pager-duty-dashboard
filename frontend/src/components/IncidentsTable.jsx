import React, { useEffect, useState } from "react";

function IncidentsTable() {
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5001/api/incidents");
        if (!response.ok) throw new Error("Failed to fetch incidents");
        const data = await response.json();
        setIncidents(data.incidents || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  if (loading) return <div>please wait...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>PagerDuty Incidents</h2>
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
                <td>{new Date(incident.created_at).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentsTable;
