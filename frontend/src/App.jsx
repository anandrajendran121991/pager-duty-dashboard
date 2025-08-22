import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IncidentsTable from "./components/IncidentsTable";
import CreateIncident from "./components/createIncident";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<IncidentsTable />}></Route>
          <Route path="/create" element={<CreateIncident />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
