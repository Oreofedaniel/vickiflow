export default function MedicationCheck({ actions }) {
  const { updateVitalsDraft, goTo } = actions;

  const choose = (medicationTaken, label) => {
    updateVitalsDraft({ medicationTaken, medicationLabel: label });
    goTo('CONFIRM_1_6');
  };

  return (
    <div>
      <div className="ussd-title">VickiFlow - Medication</div>
      <div className="ussd-lines"><p>Did you take your medication today?</p></div>
      <div className="ussd-options">
        <button className="ussd-option-btn" onClick={() => choose(true, 'Yes, I took all my medicine')}>1. Yes, I took all my medicine</button>
        <button className="ussd-option-btn" onClick={() => choose(false, 'I took some of it')}>2. I took some of it</button>
        <button className="ussd-option-btn" onClick={() => choose(false, 'No, I did not take it')}>3. No, I did not take it</button>
        <button className="ussd-option-btn" onClick={() => choose(false, 'I ran out of medication')}>4. I ran out of medication</button>
      </div>
    </div>
  );
}
