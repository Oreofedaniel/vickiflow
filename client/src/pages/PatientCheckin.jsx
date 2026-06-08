import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const SYMPTOM_OPTIONS = [
  'Chest pain',
  'Difficulty breathing',
  'Severe headache',
  'Blurred vision',
  'Fainting',
  'Dizziness',
  'Nausea',
  'Fatigue',
];

export default function PatientCheckin() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    patientId: '',
    systolic: '',
    diastolic: '',
    bloodGlucose: '',
    heartRate: '',
    symptoms: [],
    medicationTaken: true,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`${API}/patients`).then((res) => setPatients(res.data));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSymptom = (symptom) => {
    const already = form.symptoms.includes(symptom);
    setForm({ ...form, symptoms: already ? form.symptoms.filter((s) => s !== symptom) : [...form.symptoms, symptom] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        ...form,
        systolic: form.systolic ? Number(form.systolic) : undefined,
        diastolic: form.diastolic ? Number(form.diastolic) : undefined,
        bloodGlucose: form.bloodGlucose ? Number(form.bloodGlucose) : undefined,
        heartRate: form.heartRate ? Number(form.heartRate) : undefined,
        medicationTaken: form.medicationTaken === 'true' || form.medicationTaken === true,
      };
      const res = await axios.post(`${API}/vitals/log`, payload);
      setResult(res.data);
    } catch (err) {
      setResult({ error: err.response?.data?.error || 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  const tierStyle = {
    Green: { background: '#d1fae5', color: '#065f46', border: '2px solid #10b981' },
    Yellow: { background: '#fef3c7', color: '#92400e', border: '2px solid #f59e0b' },
    Red: { background: '#fee2e2', color: '#991b1b', border: '2px solid #ef4444' },
  };

  return (
    <div className="card">
      <h2>Daily Vitals Check-In</h2>
      <p className="subtitle">Log today's readings to get your risk assessment</p>

      {result && !result.error && (
        <div className="risk-result" style={tierStyle[result.riskTier]}>
          <h3>Risk Status: {result.riskTier}</h3>
          <p>{result.riskReason}</p>
        </div>
      )}
      {result?.error && <div className="alert alert-error">{result.error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Patient</label>
          <select name="patientId" value={form.patientId} onChange={handleChange} required>
            <option value="">-- Choose a patient --</option>
            {patients.map((p) => (
              <option key={p._id} value={p._id}>
                {p.fullName} — {p.condition}
              </option>
            ))}
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Systolic BP (mmHg)</label>
            <input name="systolic" type="number" value={form.systolic} onChange={handleChange} placeholder="e.g. 130" />
          </div>
          <div className="form-group">
            <label>Diastolic BP (mmHg)</label>
            <input name="diastolic" type="number" value={form.diastolic} onChange={handleChange} placeholder="e.g. 85" />
          </div>
          <div className="form-group">
            <label>Blood Glucose (mg/dL)</label>
            <input name="bloodGlucose" type="number" value={form.bloodGlucose} onChange={handleChange} placeholder="e.g. 120" />
          </div>
          <div className="form-group">
            <label>Heart Rate (bpm)</label>
            <input name="heartRate" type="number" value={form.heartRate} onChange={handleChange} placeholder="e.g. 72" />
          </div>
        </div>

        <div className="form-group">
          <label>Did you take your medication today?</label>
          <select name="medicationTaken" value={form.medicationTaken} onChange={handleChange}>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <div className="form-group">
          <label>Any symptoms today? (select all that apply)</label>
          <div className="symptom-grid">
            {SYMPTOM_OPTIONS.map((s) => (
              <label key={s} className={`symptom-chip ${form.symptoms.includes(s) ? 'selected' : ''}`}>
                <input type="checkbox" checked={form.symptoms.includes(s)} onChange={() => toggleSymptom(s)} />
                {s}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Calculating...' : 'Submit & Get Risk Assessment'}
        </button>
      </form>
    </div>
  );
}
