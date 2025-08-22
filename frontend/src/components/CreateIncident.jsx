import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateIncident() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (title.length < 1) {
      setError("Title is required");
      return;
    }

    if (description.length < 1) {
      setError("Description is required");
      return;
    }
    try {
      setLoading(true);
      setError(""); // Clear any previous error
      const response = await fetch("http://localhost:5001/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response) {
        setError("failed to create incident");
        return;
      }

      if (response.status === 404) {
        setError("Route not found");
        return;
      }
      const json = await response.json();
      console.log(json);
      navigate("/");
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>

        <br />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <br />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button disabled={loading} onClick={handleSubmit}>
          {loading ? "creating" : "submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateIncident;
