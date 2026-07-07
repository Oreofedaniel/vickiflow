import { useState } from 'react';

const CONDITIONS = ['Hypertension', 'Diabetes', 'Asthma', 'Peptic Ulcer'];

export default function Registration({ stage, session, actions }) {
  const [textInput, setTextInput] = useState('');
  const [localError, setLocalError] = useState('');
  const { goTo, updateSession, registerPatient, pushSms } = actions;
  const reg = session.reg;

  const setReg = (patch) => updateSession({ reg: { ...reg, ...patch } });

  const submitText = (fieldName, nextStage) => {
    const value = textInput.trim();
    if (!value) {
      setLocalError('This field is required');
      return;
    }
    setLocalError('');
    setReg({ [fieldName]: value });
    setTextInput('');
    goTo(nextStage);
  };

  if (stage === 'REG_R1') {
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines"><p>Enter your first name:</p></div>
        <div className="ussd-input-row">
          <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. Seun" />
          <button data-key="send" onClick={() => submitText('firstName', 'REG_R2')}>Send</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  if (stage === 'REG_R2') {
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines"><p>Enter your last name:</p></div>
        <div className="ussd-input-row">
          <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. Adeleke" />
          <button data-key="send" onClick={() => submitText('lastName', 'REG_R3')}>Send</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  if (stage === 'REG_R3') {
    const pickSingle = (condition) => {
      setReg({ conditions: [condition] });
      goTo('REG_R5');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines"><p>Select your condition:</p></div>
        <div className="ussd-options">
          {CONDITIONS.map((c, i) => (
            <button key={c} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => pickSingle(c)}>{i + 1}. {c}</button>
          ))}
          <button data-key="5" className="ussd-option-btn" onClick={() => goTo('REG_R3B')}>5. More than one</button>
        </div>
      </div>
    );
  }

  // Sub-step needed to make "more than one" concrete: pick the first of the two conditions.
  if (stage === 'REG_R3B') {
    const pickFirst = (condition) => {
      setReg({ conditions: [condition] });
      goTo('REG_R4');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines"><p>Select your first condition:</p></div>
        <div className="ussd-options">
          {CONDITIONS.map((c, i) => (
            <button key={c} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => pickFirst(c)}>{i + 1}. {c}</button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'REG_R4') {
    const remaining = CONDITIONS.filter((c) => !reg.conditions.includes(c));
    const pickSecond = (condition) => {
      setReg({ conditions: [...reg.conditions, condition] });
      goTo('REG_R5');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines"><p>Select your second condition:</p></div>
        <div className="ussd-options">
          {remaining.map((c) => (
            <button key={c} data-key={String(CONDITIONS.indexOf(c) + 1)} className="ussd-option-btn" onClick={() => pickSecond(c)}>{CONDITIONS.indexOf(c) + 1}. {c}</button>
          ))}
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('REG_R5')}>0. None of the above</button>
        </div>
      </div>
    );
  }

  if (stage === 'REG_R5') {
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines">
          <p>Enter your LGA</p>
          <p>(e.g. Ogbomoso North, Ibadan North, Lagos Island):</p>
        </div>
        <div className="ussd-input-row">
          <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. Ogbomoso North" />
          <button data-key="send" onClick={() => submitText('lga', 'REG_R6')}>Send</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  if (stage === 'REG_R6') {
    const startOver = () => {
      updateSession({ reg: { firstName: '', lastName: '', conditions: [], lga: '' } });
      goTo('REG_R1');
    };
    const confirm = async () => {
      setLocalError('');
      try {
        const patient = await registerPatient({
          fullName: `${reg.firstName} ${reg.lastName}`,
          phone: session.phone,
          conditions: reg.conditions,
          lga: reg.lga,
        });
        updateSession({ patient });
        pushSms({
          title: 'VickiFlow — Registration',
          body: `VickiFlow: Welcome ${reg.firstName}! You are now registered. Dial *384*8425# daily to log your vitals and track your health. Your health is now in flow.`,
        }, 'info');
        goTo('REG_R7');
      } catch (err) {
        setLocalError(err.response?.data?.error || 'Registration failed. Try again.');
      }
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow Registration</div>
        <div className="ussd-lines">
          <p>Confirm your details:</p>
          <p>Name: {reg.firstName} {reg.lastName}</p>
          <p>Condition: {reg.conditions.join(', ')}</p>
          <p>LGA: {reg.lga}</p>
        </div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={confirm}>1. Confirm &amp; Register</button>
          <button data-key="2" className="ussd-option-btn" onClick={startOver}>2. Start over</button>
          <button data-key="0" className="ussd-option-btn" onClick={actions.startNewSession}>0. Exit</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  // REG_R7
  const continueToMenu = async () => {
    const result = await actions.lookupPhone(session.phone);
    if (result.registered) {
      updateSession({ patient: result.patient });
      goTo('MAIN_MENU');
    }
  };
  return (
    <div>
      <div className="ussd-title">VickiFlow</div>
      <div className="ussd-lines">
        <p>You are now registered!</p>
        <p>Dial *384*8425# anytime to log your vitals and get your daily health check.</p>
        <p>Welcome to VickiFlow, {reg.firstName}.</p>
      </div>
      <div className="ussd-options">
        <button data-key="1" className="ussd-option-btn" onClick={continueToMenu}>1. 📞 Dial *384*8425# again</button>
      </div>
    </div>
  );
}
