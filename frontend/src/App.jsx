import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5001/api")
      .then((res) => setMessage(res.data.message))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>React + Vite + Express + Docker</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;
