import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import JobList from "./pages/JobList";
import JobDetails from "./pages/JobDetails";
import AddJob from "./pages/AddJob";
import { RootLayout } from "./pages/RootLayout";
import { Dashboard } from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="jobs" element={<JobList />} />
          <Route path="/job/:jobId" element={<JobDetails />} />

          {/* <Route path="job/:id" element={<JobDetails />} /> */}
          <Route path="add-job" element={<AddJob />} />
        </Route>
      </Routes>
    </Router>
  );
}
