import { useState, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api';

const initialSession = {
  phone: '',
  patient: null,
  reg: { firstName: '', lastName: '', conditions: [], lga: '' },
  vitalsDraft: {
    conditionFlow: null,
    nextFlow: null,
    systolic: '',
    diastolic: '',
    mealTiming: '',
    bloodGlucose: '',
    breathingStatus: '',
    symptoms: [],
    medicationTaken: null,
    medicationLabel: '',
  },
  selectedHospital: null,
};

export function useUssdSession() {
  const [stage, setStage] = useState('DIAL');
  const [session, setSession] = useState(initialSession);
  const [smsInbox, setSmsInbox] = useState([]);
  const [error, setError] = useState('');

  const goTo = useCallback((nextStage, patch) => {
    if (patch) setSession((s) => ({ ...s, ...patch }));
    setError('');
    setStage(nextStage);
  }, []);

  const updateSession = useCallback((patch) => {
    setSession((s) => ({ ...s, ...patch }));
  }, []);

  const updateVitalsDraft = useCallback((patch) => {
    setSession((s) => ({ ...s, vitalsDraft: { ...s.vitalsDraft, ...patch } }));
  }, []);

  const resetVitalsDraft = useCallback(() => {
    setSession((s) => ({ ...s, vitalsDraft: initialSession.vitalsDraft }));
  }, []);

  const pushSms = useCallback((card, tone) => {
    setSmsInbox((inbox) => [{ ...card, tone: tone || 'info', id: `${Date.now()}-${Math.random()}`, receivedAt: new Date() }, ...inbox]);
  }, []);

  const startNewSession = useCallback(() => {
    setSession(initialSession);
    setError('');
    setStage('DIAL');
  }, []);

  const lookupPhone = useCallback(async (phone) => {
    const res = await axios.get(`${API}/ussd/lookup/${phone}`);
    return res.data;
  }, []);

  const registerPatient = useCallback(async (payload) => {
    const res = await axios.post(`${API}/patients/register`, payload);
    return res.data.patient;
  }, []);

  const logVitals = useCallback(async (payload) => {
    const res = await axios.post(`${API}/vitals/log`, payload);
    return res.data;
  }, []);

  const getVitalsHistory = useCallback(async (patientId) => {
    const res = await axios.get(`${API}/vitals/patient/${patientId}`);
    return res.data;
  }, []);

  const setReminderTime = useCallback(async (patientId, time) => {
    const res = await axios.post(`${API}/ussd/reminder-time`, { patientId, time });
    return res.data.patient;
  }, []);

  return {
    stage,
    session,
    smsInbox,
    error,
    goTo,
    updateSession,
    updateVitalsDraft,
    resetVitalsDraft,
    pushSms,
    startNewSession,
    setError,
    lookupPhone,
    registerPatient,
    logVitals,
    getVitalsHistory,
    setReminderTime,
  };
}
