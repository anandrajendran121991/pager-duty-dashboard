import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function IncidentsTable() {
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchIncidents = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `http://localhost:5001/api/incidents?searchTerm=${searchTerm}&sortBy=${sortBy}&order=${order}&page=${page}&limit=${limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch incidents");
      const jsonData = await response.json();
      setIncidents(jsonData.incidents || []);
      setTotalPages(jsonData.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [sortBy, order, page]);

  const handleCreate = () => {
    navigate("/create");
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:5001/api/incidents/sync`);
      if (!response.ok) throw new Error("Failed to sync");
      const result = await response.json();
      console.log("Sync result:", result);
      await fetchIncidents();
      alert("Incidents synced successfully!");
    } catch (err) {
      console.error(err.message);
      alert("Failed to sync incidents");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const handleSearch = async () => {
    fetchIncidents();
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (isFetching) return <div>Loading incidents...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>PagerDuty Incidents</h2>
      <div
        className="actions"
        style={{ display: "flex", gap: "20px", marginBottom: "15px" }}
      >
        <div>
          <button onClick={handleCreate}>Create Incident</button>
        </div>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div>
          <button onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? "Syncing..." : "Sync PagerDuty"}
          </button>
        </div>
      </div>

      <table
        border={1}
        cellPadding="8"
        style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Service</th>
            <th
              onClick={() => handleSort("created_at")}
              style={{ cursor: "pointer" }}
            >
              Created At{" "}
              {sortBy === "created_at" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td colSpan={5}>No incidents found</td>
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
      <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
        <button onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default IncidentsTable;
