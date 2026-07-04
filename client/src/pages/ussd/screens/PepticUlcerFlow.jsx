// The spec has no screens for Peptic Ulcer check-ins at all (only lists it as a registration
// condition). This screen mirrors the structure/tone of the spec's other symptom-check screens
// (single stated wording, extrapolated per the group leader's silence on this condition).
const SYMPTOM_OPTIONS = ['Stomach pain', 'Bloating', 'Nausea or vomiting', 'Blood in stool', 'I feel fine'];

export default function PepticUlcerFlow({ actions }) {
  const { goTo, updateVitalsDraft } = actions;

  const choose = (label) => {
    updateVitalsDraft({ symptoms: label === 'I feel fine' ? [] : [label] });
    goTo('MED_CHECK');
  };

  return (
    <div>
      <div className="ussd-title">VickiFlow - Stomach Check</div>
      <div className="ussd-lines"><p>Any of these symptoms today?</p></div>
      <div className="ussd-options">
        {SYMPTOM_OPTIONS.map((s, i) => (
          <button key={s} data-key={String(i + 1)} className="ussd-option-btn" onClick={() => choose(s)}>{i + 1}. {s}</button>
        ))}
      </div>
    </div>
  );
}
