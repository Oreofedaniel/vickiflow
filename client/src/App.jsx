import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PatientRegister from './pages/PatientRegister';
import PatientCheckin from './pages/PatientCheckin';
import ClinicianDashboard from './pages/ClinicianDashboard';
import PatientPassport from './pages/PatientPassport';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <span className="brand">VickiFlow</span>
        <div className="nav-links">
          <Link to="/">Register Patient</Link>
          <Link to="/checkin">Log Vitals</Link>
          <Link to="/dashboard">Clinician Dashboard</Link>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<PatientRegister />} />
          <Route path="/checkin" element={<PatientCheckin />} />
          <Route path="/dashboard" element={<ClinicianDashboard />} />
          <Route path="/passport/:id" element={<PatientPassport />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
