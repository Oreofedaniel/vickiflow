import { useState } from 'react';
import { HOSPITALS } from '../hospitalData';
import { hospitalDirectionsSms } from '../smsTemplates';

export default function FindHospital({ stage, session, actions }) {
  const [textInput, setTextInput] = useState('');
  const { goTo, updateSession, pushSms } = actions;

  if (stage === 'HOSPITAL_3_1') {
    const submit = () => {
      const area = textInput.trim() || 'your area';
      updateSession({ hospitalSearchArea: area });
      setTextInput('');
      goTo('HOSPITAL_3_2');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Find Hospital</div>
        <div className="ussd-lines">
          <p>Enter your LGA or area:</p>
          <p>(e.g. Ogbomoso, Ibadan North, Surulere, Kano Municipal)</p>
        </div>
        <div className="ussd-input-row">
          <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. Ogbomoso" />
          <button data-key="send" onClick={submit}>Send</button>
        </div>
      </div>
    );
  }

  if (stage === 'HOSPITAL_3_2') {
    const pick = (hospital) => {
      updateSession({ selectedHospital: hospital });
      goTo('HOSPITAL_3_3');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Hospitals Near You</div>
        <div className="ussd-lines"><p>({session.hospitalSearchArea} area)</p></div>
        <div className="ussd-options">
          {HOSPITALS.map((h, i) => (
            <button key={h.id} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => pick(h)}>
              {i + 1}. {h.name} — {h.distanceKm}km - {h.status}
            </button>
          ))}
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>0. Back</button>
        </div>
      </div>
    );
  }

  const hospital = session.selectedHospital;

  if (stage === 'HOSPITAL_3_3') {
    const sendRecord = () => goTo('HOSPITAL_3_5');
    const getDirections = () => {
      pushSms(hospitalDirectionsSms(hospital), 'info');
      goTo('HOSPITAL_3_4');
    };
    return (
      <div>
        <div className="ussd-title">{hospital.name}</div>
        <div className="ussd-lines">
          <p>{hospital.address}</p>
          <p>Phone: {hospital.phone}</p>
          <p>Chronic Care Clinic: {hospital.clinicDays}</p>
          <p>Opening: {hospital.hours}</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={sendRecord}>1. Send my health record to this hospital</button>
          <button data-key="2" className="ussd-option-btn" onClick={getDirections}>2. Get directions by SMS</button>
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('HOSPITAL_3_2')}>0. Back</button>
        </div>
      </div>
    );
  }

  if (stage === 'HOSPITAL_3_4') {
    return (
      <div>
        <div className="ussd-title">VickiFlow</div>
        <div className="ussd-lines">
          <p>Directions will be sent to your phone by SMS now.</p>
          <p>Stay safe. 🙏</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>📞 Dial *384*8425# again</button>
        </div>
      </div>
    );
  }

  // HOSPITAL_3_5 — "send health record" confirmation (not detailed in the spec beyond the menu option existing)
  return (
    <div>
      <div className="ussd-title">VickiFlow</div>
      <div className="ussd-lines">
        <p>Your health record has been shared with {hospital.name}.</p>
      </div>
      <div className="ussd-options">
        <button data-key="1" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>📞 Dial *384*8425# again</button>
      </div>
    </div>
  );
}
