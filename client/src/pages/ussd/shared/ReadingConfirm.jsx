const FIRST_STAGE = { Hypertension: 'HYP_1_2', Diabetes: 'DIA_1_2B', Asthma: 'ASTHMA_1_2C', 'Peptic Ulcer': 'PEPTIC_1' };

function buildSummaryLines(draft) {
  const lines = [];
  if (draft.conditionFlow === 'Hypertension') {
    lines.push(`BP: ${draft.systolic}/${draft.diastolic}`);
  } else if (draft.conditionFlow === 'Diabetes') {
    lines.push(`Blood Sugar: ${draft.bloodGlucose} mg/dL (${draft.mealTiming})`);
  } else if (draft.conditionFlow === 'Asthma') {
    lines.push(`Breathing: ${draft.breathingStatus}`);
  }
  lines.push(`Symptoms: ${draft.symptoms.length > 0 ? draft.symptoms.join(', ') : 'None'}`);
  lines.push(`Medication: ${draft.medicationLabel}`);
  return lines;
}

export default function ReadingConfirm({ session, actions }) {
  const { goTo, updateVitalsDraft, resetVitalsDraft } = actions;
  const draft = session.vitalsDraft;
  const summaryLines = buildSummaryLines(draft);

  const editAgain = () => {
    goTo(FIRST_STAGE[draft.conditionFlow]);
  };

  const cancel = () => {
    resetVitalsDraft();
    goTo('MAIN_MENU');
  };

  return (
    <div>
      <div className="ussd-title">VickiFlow - Confirm Reading</div>
      <div className="ussd-lines">
        {summaryLines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
      <div className="ussd-options">
        <button data-key="1" className="ussd-option-btn" onClick={() => goTo('PROCESSING_1_7')}>1. Submit reading</button>
        <button data-key="2" className="ussd-option-btn" onClick={editAgain}>2. Enter again (correct mistake)</button>
        <button data-key="0" className="ussd-option-btn" onClick={cancel}>0. Cancel</button>
      </div>
    </div>
  );
}
