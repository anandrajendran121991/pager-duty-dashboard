import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IncidentsTable from "./components/IncidentsTable";
import CreateIncident from "./components/createIncident";
import ViewIncident from "./components/ViewIncident";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/incident" element={<IncidentsTable />}></Route>
          <Route path="/incident/create" element={<CreateIncident />}></Route>
          <Route path="/incident/:id" element={<ViewIncident />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
