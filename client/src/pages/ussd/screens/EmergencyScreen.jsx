import { useEffect, useRef, useState } from 'react';
import { HOSPITALS } from '../hospitalData';
import { emergencyPatientSms, emergencyDoctorSms } from '../smsTemplates';

export default function EmergencyScreen({ session, actions }) {
  const { pushSms, goTo, startNewSession, getVitalsHistory } = actions;
  const firedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const patient = session.patient;
  const hospital = HOSPITALS[0];

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    if (!patient) {
      setReady(true);
      return;
    }
    getVitalsHistory(patient._id).then((vitals) => {
      const latest = vitals[0];
      const lastVitalSummary = latest?.systolic
        ? `Last BP: ${latest.systolic}/${latest.diastolic} (recorded ${new Date(latest.createdAt).toDateString() === new Date().toDateString() ? 'today' : new Date(latest.createdAt).toLocaleDateString()}).`
        : 'No recent reading on file.';

      pushSms(emergencyPatientSms({ hospital, doctorName: patient.assignedDoctor || 'your doctor' }), 'Red');
      pushSms(emergencyDoctorSms({ patientName: patient.fullName, phone: patient.phone, lastVitalSummary, doctorName: patient.assignedDoctor || 'the doctor' }), 'Red');
      setReady(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!patient) {
    return (
      <div>
        <div className="ussd-title">VickiFlow 🚨 EMERGENCY</div>
        <div className="ussd-lines">
          <p>Please dial in with a registered phone number first so we know who to alert.</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={startNewSession}>1. 📞 Dial *384*8425#</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ussd-title">VickiFlow 🚨 EMERGENCY</div>
      <div className="ussd-lines">
        <p>We are alerting your doctor and finding help near you NOW.</p>
        <p>Please stay calm. Help is on the way.</p>
        <p>Nearest hospital:</p>
        <p>{hospital.name}</p>
        <p>Call: {hospital.phone}</p>
      </div>
      {ready && (
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>1. 📞 Dial *384*8425# again</button>
        </div>
      )}
    </div>
  );
}
