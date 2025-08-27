import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateIncident() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:5001/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        setError(`Error: ${response.statusText}`);
        return;
      }

      const json = await response.json();
      console.log(json);
      navigate("/incident");
    } catch (err) {
      console.error(err.message);
      setError("Failed to create incident");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/incident");
  };

  return (
    <div style={styles.container}>
      <h2
        // @ts-ignore
        style={styles.heading}
      >
        Create Incident
      </h2>
      <form
        onSubmit={handleSubmit}
        // @ts-ignore
        style={styles.form}
      >
        <div
          // @ts-ignore
          style={styles.formGroup}
        >
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            placeholder="Enter incident title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
        </div>

        <div
          // @ts-ignore
          style={styles.formGroup}
        >
          <label style={styles.label}>Description:</label>
          <textarea
            placeholder="Enter incident description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            // @ts-ignore
            style={styles.textarea}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.primaryButton,
              backgroundColor: loading ? "#aaa" : "#007bff",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Creating..." : "Submit"}
          </button>
          <button
            type="button"
            onClick={handleBack}
            style={styles.secondaryButton}
          >
            Back to List
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateIncident;

// ✅ Reusable styles
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "40px auto",
    padding: "25px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "6px",
    fontWeight: "bold",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    resize: "vertical",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "10px",
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    color: "#333",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
