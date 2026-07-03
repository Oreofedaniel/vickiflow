import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://localhost:5000/api';

const TIER_BADGE = {
  Red: { label: '🔴 Red — Visit Immediately', className: 'badge-red' },
  Yellow: { label: '🟡 Yellow — Monitor Closely', className: 'badge-yellow' },
  Green: { label: '🟢 Green — Stable', className: 'badge-green' },
};

export default function ClinicianDashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/vitals/dashboard`);
      setQueue(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  if (loading) return <div className="card"><p>Loading patient queue...</p></div>;

  return (
    <div className="card">
      <div className="dashboard-header">
        <div>
          <h2>Clinician Dashboard</h2>
          <p className="subtitle">Patients ranked by clinical urgency — most critical first</p>
        </div>
        <button className="btn-secondary" onClick={fetchDashboard}>Refresh</button>
      </div>

      <div className="summary-row">
        <div className="summary-box red">{queue.filter((v) => v.riskTier === 'Red').length} Critical</div>
        <div className="summary-box yellow">{queue.filter((v) => v.riskTier === 'Yellow').length} Monitor</div>
        <div className="summary-box green">{queue.filter((v) => v.riskTier === 'Green').length} Stable</div>
      </div>

      {queue.length === 0 ? (
        <p>No vitals logged yet. Patients need to complete their daily check-in.</p>
      ) : (
        <div className="patient-queue">
          {queue.map((entry) => (
            <div key={entry._id} className={`queue-card ${entry.riskTier.toLowerCase()}`}>
              <div className="queue-info">
                <h3>{entry.patientInfo.fullName}</h3>
                <p>{entry.patientInfo.conditions.join(', ')} • Age {entry.patientInfo.age ?? 'N/A'} • {entry.patientInfo.phone}</p>
                <p className="risk-reason">{entry.riskReason}</p>
                <p className="log-time">Last logged: {new Date(entry.createdAt).toLocaleString()}</p>
              </div>
              <div className="queue-meta">
                <span className={`badge ${TIER_BADGE[entry.riskTier].className}`}>
                  {TIER_BADGE[entry.riskTier].label}
                </span>
                {entry.systolic && <p>BP: {entry.systolic}/{entry.diastolic} mmHg</p>}
                {entry.bloodGlucose && <p>Glucose: {entry.bloodGlucose} mg/dL</p>}
                <Link to={`/passport/${entry.patientInfo._id}`} className="btn-link">View Passport →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
