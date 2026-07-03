import { useEffect } from 'react';

const FIRST_STAGE = {
  Hypertension: 'HYP_1_2',
  Diabetes: 'DIA_1_2B',
  Asthma: 'ASTHMA_1_2C',
  'Peptic Ulcer': 'PEPTIC_1',
};

const MENU_LABEL = {
  Hypertension: 'Blood Pressure',
  Diabetes: 'Blood Sugar',
  Asthma: 'Breathing Check',
  'Peptic Ulcer': 'Stomach Check',
};

const ORDER = ['Hypertension', 'Diabetes', 'Asthma', 'Peptic Ulcer'];

export default function VitalsRouter({ session, actions }) {
  const { goTo, updateVitalsDraft } = actions;
  const conditions = session.patient?.conditions || [];
  const present = ORDER.filter((c) => conditions.includes(c));

  const enterFlow = (condition, nextFlow) => {
    updateVitalsDraft({ conditionFlow: condition, nextFlow: nextFlow || null });
    goTo(FIRST_STAGE[condition]);
  };

  useEffect(() => {
    // Doc's SCREEN 1.1 only makes sense when there's a choice to make — skip straight in for a single condition.
    if (present.length === 1) {
      enterFlow(present[0], null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (present.length === 1) {
    return (
      <div>
        <div className="ussd-lines"><p>Loading…</p></div>
      </div>
    );
  }

  const isHtnDmOnly = present.length === 2 && present.includes('Hypertension') && present.includes('Diabetes');

  return (
    <div>
      <div className="ussd-title">VickiFlow - Daily Check-in</div>
      <div className="ussd-lines">
        <p>Hi {session.patient?.fullName?.split(' ')[0]} 👋</p>
        <p>What are you logging today?</p>
      </div>
      <div className="ussd-options">
        {isHtnDmOnly ? (
          <>
            <button className="ussd-option-btn" onClick={() => enterFlow('Hypertension')}>1. Blood Pressure</button>
            <button className="ussd-option-btn" onClick={() => enterFlow('Diabetes')}>2. Blood Sugar</button>
            <button className="ussd-option-btn" onClick={() => enterFlow('Hypertension', 'Diabetes')}>3. Both</button>
            <button className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>0. Back</button>
          </>
        ) : (
          <>
            {present.map((c, i) => (
              <button key={c} className="ussd-option-btn" onClick={() => enterFlow(c)}>{i + 1}. {MENU_LABEL[c]} ({c})</button>
            ))}
            <button className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>0. Back</button>
          </>
        )}
      </div>
    </div>
  );
}
