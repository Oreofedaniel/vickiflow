import { useState } from 'react';
import { medicationOutOfStockSms } from '../smsTemplates';

const TIME_OPTIONS = ['7:00 AM', '8:00 AM', '12:00 PM (noon)', '6:00 PM', '9:00 PM'];

export default function MedicationReminder({ stage, session, actions }) {
  const [selectedMedication, setSelectedMedication] = useState('');
  const { goTo, setReminderTime, pushSms, updateSession } = actions;
  const patient = session.patient;
  const medications = (patient.medications || '').split(',').map((m) => m.trim()).filter(Boolean);

  if (stage === 'REMINDER_4_1') {
    return (
      <div>
        <div className="ussd-title">VickiFlow - Medication Reminder</div>
        <div className="ussd-lines"><p>What would you like to do?</p></div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={() => goTo('REMINDER_4_2')}>1. Set daily reminder time</button>
          <button data-key="2" className="ussd-option-btn" onClick={() => goTo('REMINDER_4_4')}>2. View my medications</button>
          <button data-key="3" className="ussd-option-btn" onClick={() => goTo('REMINDER_4_5')}>3. Report I ran out of medicine</button>
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>0. Back</button>
        </div>
      </div>
    );
  }

  if (stage === 'REMINDER_4_2') {
    const pick = async (time) => {
      const updated = await setReminderTime(patient._id, time);
      updateSession({ patient: updated });
      goTo('REMINDER_4_3');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Set Reminder</div>
        <div className="ussd-lines"><p>What time should we remind you to take your medication?</p></div>
        <div className="ussd-options">
          {TIME_OPTIONS.map((t, i) => (
            <button key={t} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => pick(t)}>{i + 1}. {t}</button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'REMINDER_4_3') {
    return (
      <div>
        <div className="ussd-title">VickiFlow</div>
        <div className="ussd-lines">
          <p>Reminder set for {patient.reminderTime} daily.</p>
          <p>You will receive an SMS each morning to take your medicine and log your vitals.</p>
          <p>Stay consistent. Stay healthy. 💪</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>📞 Dial *384*8425# again</button>
        </div>
      </div>
    );
  }

  if (stage === 'REMINDER_4_4') {
    return (
      <div>
        <div className="ussd-title">VickiFlow - Your Medications</div>
        <div className="ussd-lines">
          {medications.length > 0 ? (
            medications.map((m, i) => <p key={m}>{i + 1}. {m}</p>)
          ) : (
            <p>No medications on file.</p>
          )}
          <p>Last updated by:</p>
          <p>Dr. {patient.assignedDoctor || 'Not assigned'}</p>
          <p>{new Date(patient.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="ussd-options">
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('REMINDER_4_1')}>0. Back</button>
        </div>
      </div>
    );
  }

  if (stage === 'REMINDER_4_5') {
    const pick = (medication) => {
      setSelectedMedication(medication);
      pushSms(
        medicationOutOfStockSms({
          doctorName: patient.assignedDoctor || 'your doctor',
          patientName: patient.fullName,
          phone: patient.phone,
          medication,
        }),
        'info'
      );
      goTo('REMINDER_4_6');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Out of Medication</div>
        <div className="ussd-lines"><p>Which medication did you run out of?</p></div>
        <div className="ussd-options">
          {medications.map((m, i) => (
            <button key={m} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => pick(m)}>{i + 1}. {m}</button>
          ))}
          <button data-key={String(medications.length + 1)} className="ussd-option-btn" onClick={() => pick('all my medications')}>{medications.length + 1}. All my medications</button>
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('REMINDER_4_1')}>0. Back</button>
        </div>
      </div>
    );
  }

  // REMINDER_4_6
  return (
    <div>
      <div className="ussd-title">VickiFlow</div>
      <div className="ussd-lines">
        <p>Your doctor has been notified that you are out of {selectedMedication}.</p>
        <p>Dr. {patient.assignedDoctor || 'Your doctor'} will contact you or renew your prescription shortly.</p>
        <p>Do NOT skip doses. 💊</p>
      </div>
      <div className="ussd-options">
        <button data-key="1" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>📞 Dial *384*8425# again</button>
      </div>
    </div>
  );
}
