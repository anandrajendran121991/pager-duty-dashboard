// @ts-nocheck
import { use, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ViewIncident() {
  const { id } = useParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [incident, setIncident] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    const fetchIncidentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/incidents/${id}`
        );
        if (!response || response.status !== 200)
          throw new Error(`Failed to fetch the incident details`);
        const jsonData = await response.json();

        setIncident(jsonData.incident);

        // Build dynamic prompt
        const generatedPrompt = `
Analyze the following incident:
- Title: ${jsonData.incident.title}
- Status: ${jsonData.incident.status}
- Urgency: ${jsonData.incident.urgency}

Please provide a root cause analysis and recommendations.
        `;
        setPrompt(generatedPrompt);
      } catch (error) {
        console.log(`${error.message}`);
        setError("Failed to fetch the incident details");
      } finally {
        setLoading(false);
      }
    };
    fetchIncidentDetails();
  }, [id]);

  const handleAnalyze = async () => {
    setAnalysisLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/incidents/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) throw new Error("Failed to analyze incident");

      const jsonData = await response.json();
      setAnalysis(jsonData.analysis);
    } catch (error) {
      console.error(error.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={styles.container}>
      <Link to="/incident" style={styles.backLink}>
        ← Back
      </Link>
      <h2 style={styles.heading}>Incident Analysis</h2>

      {incident ? (
        <div style={styles.card}>
          <h3 style={styles.incidentTitle}>{incident.title}</h3>
          <p>
            <strong>Status:</strong> {incident.status}
          </p>
          <p>
            <strong>Urgency:</strong> {incident.urgency}
          </p>

          {/* Prompt Section */}
          <div style={styles.promptBox}>
            <h4 style={styles.subHeading}>Generated Prompt:</h4>
            <textarea
              rows={10}
              cols={70}
              style={styles.textarea}
              value={prompt}
              onChange={(e) => handlePromptChange(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={handleAnalyze}>
            {analysisLoading ? "analyzing....." : "analyze"}
          </button>

          {/* Display Analysis */}
          {analysis && (
            <div style={styles.analysisBox}>
              <h4 style={styles.subHeading}>Analysis Result:</h4>
              {Object.entries(analysis).map(([section, text], index) => (
                <div key={index} style={{ marginBottom: "15px" }}>
                  <h5 style={{ fontWeight: "bold" }}>{section}:</h5>
                  <p style={styles.resultText}>{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p>Loading incident details...</p>
      )}
    </div>
  );
}

// ✅ Inline Styles (can be moved to CSS file)
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  backLink: {
    textDecoration: "none",
    color: "#007BFF",
    marginBottom: "15px",
    display: "inline-block",
  },
  heading: {
    fontSize: "24px",
    marginBottom: "15px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  incidentTitle: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  promptBox: {
    marginTop: "20px",
  },
  subHeading: {
    marginBottom: "8px",
    fontSize: "16px",
    fontWeight: "bold",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  button: {
    marginTop: "15px",
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
  },
  analysisBox: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f8f9fa",
    borderLeft: "4px solid #28a745",
    borderRadius: "4px",
  },
  resultText: {
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "10px",
  },
};

export default ViewIncident;
