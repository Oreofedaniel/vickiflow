import { useState } from 'react';

export default function MainMenu({ stage, session, actions }) {
  const [phoneInput, setPhoneInput] = useState('');
  const [localError, setLocalError] = useState('');

  const { goTo, updateSession, lookupPhone, startNewSession } = actions;

  if (stage === 'DIAL') {
    const handleDial = async () => {
      const phone = phoneInput.trim();
      if (!phone) {
        setLocalError('Enter a phone number');
        return;
      }
      setLocalError('');
      try {
        const result = await lookupPhone(phone);
        if (result.registered) {
          updateSession({ phone, patient: result.patient });
          goTo('MAIN_MENU', { phone, patient: result.patient });
        } else {
          updateSession({ phone, patient: null });
          goTo('NOT_REGISTERED', { phone, patient: null });
        }
      } catch {
        setLocalError('Could not reach VickiFlow. Try again.');
      }
    };

    return (
      <div>
        <div className="ussd-title">Dial *384*8425#</div>
        <div className="ussd-lines">
          <p>Enter the phone number placing this call to simulate dialing in:</p>
        </div>
        <div className="ussd-input-row">
          <input autoFocus value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="e.g. 08012345678" />
          <button data-key="send" onClick={handleDial}>Dial</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  if (stage === 'NOT_REGISTERED') {
    return (
      <div>
        <div className="ussd-title">Welcome to VickiFlow</div>
        <div className="ussd-lines">
          <p>You are not registered yet.</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={() => goTo('REG_R1')}>1. Register now</button>
          <button data-key="2" className="ussd-option-btn" onClick={() => goTo('INFO_VISIT_WEB')}>2. Visit vickiflow.com to register</button>
          <button data-key="0" className="ussd-option-btn" onClick={startNewSession}>0. Exit</button>
        </div>
      </div>
    );
  }

  if (stage === 'INFO_VISIT_WEB') {
    return (
      <div>
        <div className="ussd-title">VickiFlow</div>
        <div className="ussd-lines">
          <p>Please visit vickiflow.com on any internet-enabled device to register.</p>
        </div>
        <div className="ussd-options">
          <button data-key="0" className="ussd-option-btn" onClick={startNewSession}>0. Exit</button>
        </div>
      </div>
    );
  }

  if (stage === 'EXIT') {
    return (
      <div>
        <div className="ussd-title">VickiFlow</div>
        <div className="ussd-lines">
          <p>Thank you for using VickiFlow.</p>
          <p>Stay healthy. 💙</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={startNewSession}>📞 Dial *384*8425# again</button>
        </div>
      </div>
    );
  }

  // MAIN_MENU
  return (
    <div>
      <div className="ussd-title">Welcome to VickiFlow</div>
      <div className="ussd-lines">
        <p>Smart Care. Connected Health.</p>
      </div>
      <div className="ussd-options">
        <button data-key="1" className="ussd-option-btn" onClick={() => goTo('VITALS_1_1')}>1. Log my vitals</button>
        <button data-key="2" className="ussd-option-btn" onClick={() => goTo('CHECK_2_1')}>2. Check my last result</button>
        <button data-key="3" className="ussd-option-btn" onClick={() => goTo('HOSPITAL_3_1')}>3. Find hospital near me</button>
        <button data-key="4" className="ussd-option-btn" onClick={() => goTo('REMINDER_4_1')}>4. Medication reminder</button>
        <button data-key="0" className="ussd-option-btn" onClick={() => goTo('EXIT')}>0. Exit</button>
      </div>
    </div>
  );
}
