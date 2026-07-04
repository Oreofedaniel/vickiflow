import { useState } from 'react';

const MEAL_OPTIONS = ['I have not eaten yet today (fasting reading)', 'Less than 2 hours ago', 'More than 2 hours ago'];
const SYMPTOM_OPTIONS = ['Excessive thirst or hunger', 'Dizziness or weakness', 'Blurred vision', 'Frequent urination', 'I feel fine'];

export default function DiabetesFlow({ stage, session, actions }) {
  const [textInput, setTextInput] = useState('');
  const [localError, setLocalError] = useState('');
  const { goTo, updateVitalsDraft } = actions;

  if (stage === 'DIA_1_2B') {
    const choose = (label) => {
      updateVitalsDraft({ mealTiming: label });
      goTo('DIA_1_3B');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Blood Sugar</div>
        <div className="ussd-lines"><p>When did you last eat?</p></div>
        <div className="ussd-options">
          {MEAL_OPTIONS.map((m, i) => (
            <button key={m} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => choose(m)}>{i + 1}. {m}</button>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'DIA_1_3B') {
    const submit = () => {
      const value = Number(textInput);
      if (!textInput.trim() || Number.isNaN(value)) {
        setLocalError('Enter a valid number');
        return;
      }
      updateVitalsDraft({ bloodGlucose: value });
      setTextInput('');
      setLocalError('');
      goTo('DIA_1_4B');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Blood Sugar</div>
        <div className="ussd-lines">
          <p>Enter your blood sugar reading:</p>
          <p>(From your glucometer in mg/dL)</p>
          <p>Example: enter 126 for 126 mg/dL</p>
        </div>
        <div className="ussd-input-row">
          <input autoFocus value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="e.g. 142" />
          <button data-key="send" onClick={submit}>Send</button>
        </div>
        {localError && <p className="ussd-inline-error">{localError}</p>}
      </div>
    );
  }

  // DIA_1_4B — symptom check (single-select per doc; no "more than one" option given here)
  const choose = (label) => {
    updateVitalsDraft({ symptoms: label === 'I feel fine' ? [] : [label] });
    goTo('MED_CHECK');
  };
  return (
    <div>
      <div className="ussd-title">VickiFlow - How do you feel?</div>
      <div className="ussd-lines"><p>Any of these symptoms today?</p></div>
      <div className="ussd-options">
        {SYMPTOM_OPTIONS.map((s, i) => (
          <button key={s} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => choose(s)}>{i + 1}. {s}</button>
        ))}
      </div>
    </div>
  );
}
