import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

export default function PatientRegister() {
  const [form, setForm] = useState({
    fullName: '',
    age: '',
    phone: '',
    condition: 'Hypertension',
    medications: '',
    allergies: '',
    assignedDoctor: '',
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await axios.post(`${API}/patients/register`, form);
      setMessage({ type: 'success', text: `Patient registered! ID: ${res.data.patient._id}` });
      setForm({ fullName: '', age: '', phone: '', condition: 'Hypertension', medications: '', allergies: '', assignedDoctor: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Register New Patient</h2>
      <p className="subtitle">Create a patient passport for chronic disease monitoring</p>
      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required placeholder="e.g. Ngozi Eze" />
          </div>
          <div className="form-group">
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} required placeholder="e.g. 49" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="e.g. 08012345678" />
          </div>
          <div className="form-group">
            <label>Chronic Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange}>
              <option>Hypertension</option>
              <option>Diabetes</option>
              <option>Asthma</option>
              <option>Peptic Ulcer</option>
            </select>
          </div>
          <div className="form-group full-width">
            <label>Current Medications</label>
            <input name="medications" value={form.medications} onChange={handleChange} placeholder="e.g. Amlodipine 5mg, Lisinopril 10mg" />
          </div>
          <div className="form-group full-width">
            <label>Known Allergies</label>
            <input name="allergies" value={form.allergies} onChange={handleChange} placeholder="e.g. Penicillin" />
          </div>
          <div className="form-group full-width">
            <label>Assigned Doctor</label>
            <input name="assignedDoctor" value={form.assignedDoctor} onChange={handleChange} placeholder="e.g. Dr. Chukwuemeka Obi" />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Registering...' : 'Register Patient'}
        </button>
      </form>
    </div>
  );
}
