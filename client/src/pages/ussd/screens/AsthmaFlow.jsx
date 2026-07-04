const BREATHING_OPTIONS = ['Normal - no issues', 'Slightly difficult', 'Very difficult', 'I used my inhaler today'];
const SYMPTOM_OPTIONS = ['Wheezing sounds', 'Chest tightness', 'Woke up at night coughing', 'None of the above'];

export default function AsthmaFlow({ stage, session, actions }) {
  const { goTo, updateVitalsDraft } = actions;
  const draft = session.vitalsDraft;

  if (stage === 'ASTHMA_1_2C') {
    const choose = (label) => {
      updateVitalsDraft({ breathingStatus: label, symptoms: label === 'Normal - no issues' ? [] : [label] });
      goTo('ASTHMA_1_3C');
    };
    return (
      <div>
        <div className="ussd-title">VickiFlow - Breathing Check</div>
        <div className="ussd-lines"><p>How is your breathing today?</p></div>
        <div className="ussd-options">
          {BREATHING_OPTIONS.map((b, i) => (
            <button key={b} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => choose(b)}>{i + 1}. {b}</button>
          ))}
        </div>
      </div>
    );
  }

  // ASTHMA_1_3C
  const choose = (label) => {
    const symptoms = label === 'None of the above' ? draft.symptoms : [...draft.symptoms, label];
    updateVitalsDraft({ symptoms });
    goTo('MED_CHECK');
  };
  return (
    <div>
      <div className="ussd-title">VickiFlow - Asthma Check</div>
      <div className="ussd-lines"><p>Did you experience any of these today?</p></div>
      <div className="ussd-options">
        {SYMPTOM_OPTIONS.map((s, i) => (
          <button key={s} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => choose(s)}>{i + 1}. {s}</button>
        ))}
      </div>
    </div>
  );
}
