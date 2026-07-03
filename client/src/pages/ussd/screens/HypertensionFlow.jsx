import { useState } from 'react';

const SYMPTOM_OPTIONS = ['Headache or dizziness', 'Chest pain or tightness', 'Blurred vision', 'I feel fine'];

export default function HypertensionFlow({ stage, session, actions }) {
  const [textInput, setTextInput] = useState('');
  const [localError, setLocalError] = useState('');
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [ticked, setTicked] = useState([]);
  const { goTo, updateVitalsDraft } = actions;

  if (stage === 'HYP_1_2') {
    const submit = () => {
      const value = Number(textInput);
      if (!textInput.trim() || Number.isNaN(value)) {
        setLocalError('Enter a valid number');
        return;
      }
      updateVitalsDraft({ systolic: value });
      setTextInput('');
      setLocalError('');
      goTo('HYP_1_3');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Blood Pressure</div>
        <div className="ussd-lines">
          <p>Enter your TOP number (systolic pressure):</p>
          <p>Example: if reading is 140/90, enter 140</p>
        </div>
        <div className="ussd-input-row">
          <input value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. 138" />
          <button onClick={submit}>Send</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  if (stage === 'HYP_1_3') {
    const submit = () => {
      const value = Number(textInput);
      if (!textInput.trim() || Number.isNaN(value)) {
        setLocalError('Enter a valid number');
        return;
      }
      updateVitalsDraft({ diastolic: value });
      setTextInput('');
      setLocalError('');
      goTo('HYP_1_4');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Blood Pressure</div>
        <div className="ussd-lines">
          <p>Enter your BOTTOM number (diastolic pressure):</p>
          <p>Example: if reading is 140/90, enter 90</p>
        </div>
        <div className="ussd-input-row">
          <input value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. 88" />
          <button onClick={submit}>Send</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  // HYP_1_4 — symptom check
  const chooseSingle = (label) => {
    updateVitalsDraft({ symptoms: label === 'I feel fine' ? [] : [label] });
    goTo('MED_CHECK');
  };

  const toggleTick = (label) => {
    setTicked((t) => (t.includes(label) ? t.filter((x) => x !== label) : [...t, label]));
  };

  const doneMultiSelect = () => {
    updateVitalsDraft({ symptoms: ticked });
    goTo('MED_CHECK');
  };

  if (multiSelectMode) {
    return (
      <div>
        <div className="ussd-title">VickiFlow - How do you feel?</div>
        <div className="ussd-lines"><p>Select all that apply:</p></div>
        <div className="ussd-options">
          {SYMPTOM_OPTIONS.filter((s) => s !== 'I feel fine').map((s) => (
            <button key={s} className="ussd-option-btn" onClick={() => toggleTick(s)}>
              {ticked.includes(s) ? '☑' : '☐'} {s}
            </button>
          ))}
          <button className="ussd-option-btn" onClick={doneMultiSelect}>Done</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ussd-title">VickiFlow - How do you feel?</div>
      <div className="ussd-lines"><p>Do you have any of these today?</p></div>
      <div className="ussd-options">
        {SYMPTOM_OPTIONS.map((s, i) => (
          <button key={s} className="ussd-option-btn" onClick={() => chooseSingle(s)}>{i + 1}. {s}</button>
        ))}
        <button className="ussd-option-btn" onClick={() => setMultiSelectMode(true)}>5. More than one of the above</button>
      </div>
    </div>
  );
}
