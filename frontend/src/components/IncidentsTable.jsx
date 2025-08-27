// @ts-ignore
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function IncidentsTable() {
  const [isFetching, setIsFetching] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
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

  const handleCreate = () => navigate("/incident/create");

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch(`http://localhost:5001/api/incidents/sync`);
      if (!response.ok) throw new Error("Failed to sync");
      await response.json();
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

  const handleSearch = () => fetchIncidents();

  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  // @ts-ignore
  if (isFetching) return <div style={styles.loading}>Loading incidents...</div>;
  // @ts-ignore
  if (error) return <p style={styles.error}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 
// @ts-ignore
      style={styles.heading}>PagerDuty Incidents</h2>

      {/* Actions */}
      <div 
// @ts-ignore
      style={styles.actions}>
        <button style={styles.primaryButton} onClick={handleCreate}>
          + Create Incident
        </button>

        <div style={styles.searchContainer}>
          <input
            style={styles.searchInput}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search incidents..."
          />
          <button style={styles.secondaryButton} onClick={handleSearch}>
            Search
          </button>
        </div>

        <button
          style={styles.syncButton}
          onClick={handleSync}
          disabled={isSyncing}
        >
          {isSyncing ? "Syncing..." : "Sync PagerDuty"}
        </button>
      </div>

      {/* Table */}
      <table 
// @ts-ignore
      style={styles.table}>
        <thead>
          <tr>
            <th 
// @ts-ignore
            style={styles.tableHeader}>ID</th>
            <th 
// @ts-ignore
            style={styles.tableHeader}>Title</th>
            <th 
// @ts-ignore
            style={styles.tableHeader}>Status</th>
            <th 
// @ts-ignore
            style={styles.tableHeader}>Service</th>
            <th
              // @ts-ignore
              style={{ ...styles.tableHeader, cursor: "pointer" }}
              onClick={() => handleSort("created_at")}
            >
              Created At{" "}
              {sortBy === "created_at" ? (order === "asc" ? "▲" : "▼") : ""}
            </th>
            <th 
// @ts-ignore
            style={styles.tableHeader}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "15px" }}>
                No incidents found
              </td>
            </tr>
          ) : (
            incidents.map((incident) => (
              <tr key={incident._id} style={styles.tableRow}>
                <td style={styles.cell}>{incident._id}</td>
                <td style={styles.cell}>{incident.title}</td>
                <td style={styles.cell}>{incident.status}</td>
                <td style={styles.cell}>
                  {incident.service?.summary || "N/A"}
                </td>
                <td style={styles.cell}>
                  {new Date(incident.created_at).toLocaleString()}
                </td>
                <td style={styles.cell}>
                  <Link
                    style={styles.viewLink}
                    to={`/incident/${incident._id}`}
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          style={styles.secondaryButton}
          onClick={handlePrev}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          style={styles.secondaryButton}
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ✅ Styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "20px",
    color: "#333",
    textAlign: "center",
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "12px",
  },
  primaryButton: {
    backgroundColor: "#28a745",
    color: "#fff",
    padding: "10px 15px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  secondaryButton: {
    backgroundColor: "#007BFF",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  syncButton: {
    backgroundColor: "#6c757d",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  },
  searchContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  searchInput: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    width: "200px",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
    marginTop: "15px",
  },
  tableHeader: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f4f6f9",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  tableRow: {
    backgroundColor: "#fff",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    borderRadius: "6px",
  },
  cell: {
    padding: "12px",
    borderBottom: "1px solid #eee",
  },
  viewLink: {
    textDecoration: "none",
    color: "#007BFF",
    fontWeight: "bold",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "20px",
    alignItems: "center",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: "20px",
  },
};

export default IncidentsTable;
