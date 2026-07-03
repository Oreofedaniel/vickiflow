import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const tierColor = { Green: '#10b981', Yellow: '#f59e0b', Red: '#ef4444' };

export default function PatientPassport() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/patients/${id}`),
      axios.get(`${API}/vitals/patient/${id}`),
    ]).then(([pRes, vRes]) => {
      setPatient(pRes.data);
      setVitals(vRes.data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="card"><p>Loading patient passport...</p></div>;
  if (!patient) return <div className="card"><p>Patient not found.</p></div>;

  const latest = vitals[0];

  return (
    <div className="card">
      <Link to="/dashboard" className="btn-link back-link">← Back to Dashboard</Link>

      <div className="passport-header">
        <div className="passport-avatar">{patient.fullName.charAt(0)}</div>
        <div>
          <h2>{patient.fullName}</h2>
          <p>{patient.conditions.join(', ')} • Age {patient.age ?? 'N/A'} • {patient.phone}</p>
          {latest && (
            <span className="badge" style={{ background: tierColor[latest.riskTier], color: '#fff', marginTop: '8px', display: 'inline-block' }}>
              Current Status: {latest.riskTier}
            </span>
          )}
        </div>
      </div>

      <div className="passport-grid">
        <div className="info-block">
          <h4>Medical Information</h4>
          <p><strong>Condition(s):</strong> {patient.conditions.join(', ')}</p>
          <p><strong>Medications:</strong> {patient.medications || 'Not recorded'}</p>
          <p><strong>Allergies:</strong> {patient.allergies || 'None recorded'}</p>
          <p><strong>Assigned Doctor:</strong> {patient.assignedDoctor || 'Not assigned'}</p>
          <p><strong>Registered:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="info-block">
          <h4>Latest Readings</h4>
          {latest ? (
            <>
              {latest.systolic && <p><strong>Blood Pressure:</strong> {latest.systolic}/{latest.diastolic} mmHg</p>}
              {latest.bloodGlucose && <p><strong>Blood Glucose:</strong> {latest.bloodGlucose} mg/dL</p>}
              {latest.heartRate && <p><strong>Heart Rate:</strong> {latest.heartRate} bpm</p>}
              <p><strong>Medication Taken:</strong> {latest.medicationTaken ? 'Yes' : 'No'}</p>
              {latest.symptoms.length > 0 && <p><strong>Symptoms:</strong> {latest.symptoms.join(', ')}</p>}
              <p><strong>Risk Assessment:</strong> {latest.riskReason}</p>
            </>
          ) : (
            <p>No vitals logged yet.</p>
          )}
        </div>
      </div>

      <div className="vitals-history">
        <h4>Vitals History</h4>
        {vitals.length === 0 ? (
          <p>No records yet.</p>
        ) : (
          <table className="vitals-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>BP</th>
                <th>Glucose</th>
                <th>Medication</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {vitals.map((v) => (
                <tr key={v._id}>
                  <td>{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td>{v.systolic ? `${v.systolic}/${v.diastolic}` : '—'}</td>
                  <td>{v.bloodGlucose || '—'}</td>
                  <td>{v.medicationTaken ? '✅' : '❌'}</td>
                  <td style={{ color: tierColor[v.riskTier], fontWeight: 'bold' }}>{v.riskTier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
