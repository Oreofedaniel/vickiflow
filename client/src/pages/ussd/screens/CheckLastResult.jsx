import { useEffect, useState } from 'react';

const TIER_EMOJI = { Green: '🟢 STABLE', Yellow: '🟡 MONITOR', Red: '🔴 URGENT' };

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function readingLine(vital) {
  if (vital.systolic) return `BP: ${vital.systolic}/${vital.diastolic}`;
  if (vital.bloodGlucose) return `Blood Sugar: ${vital.bloodGlucose} mg/dL`;
  if (vital.symptoms?.length > 0) return `Reported: ${vital.symptoms.join(', ')}`;
  return 'No symptoms reported';
}

export default function CheckLastResult({ session, actions }) {
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState(null);
  const { goTo, getVitalsHistory } = actions;

  useEffect(() => {
    getVitalsHistory(session.patient._id).then((vitals) => {
      setLatest(vitals[0] || null);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div>
        <div className="ussd-title">VickiFlow - Your Last Result</div>
        <div className="ussd-lines"><p>Loading…</p></div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div>
        <div className="ussd-title">VickiFlow - Your Last Result</div>
        <div className="ussd-lines"><p>You have not logged any readings yet.</p></div>
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={() => goTo('VITALS_1_1')}>1. Log new reading now</button>
          <button data-key="0" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>0. Exit</button>
        </div>
      </div>
    );
  }

  const checkedInToday = isToday(latest.createdAt);
  const timeLabel = checkedInToday
    ? `Today, ${new Date(latest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    : `${new Date(latest.createdAt).toLocaleDateString()}, ${new Date(latest.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div>
      <div className="ussd-title">VickiFlow - Your Last Result</div>
      <div className="ussd-lines">
        <p>Last check-in: {timeLabel}</p>
        <p>{readingLine(latest)}</p>
        <p>Status: {TIER_EMOJI[latest.riskTier]}</p>
        {checkedInToday && <p>Medication: {latest.medicationTaken ? 'Taken' : 'Not taken'}</p>}
        {!checkedInToday && <p>You have NOT checked in today.</p>}
      </div>
      <div className="ussd-options">
        <button data-key="1" className="ussd-option-btn" onClick={() => goTo('VITALS_1_1')}>
          1. {checkedInToday ? 'Log new reading now' : "Log today's reading now"}
        </button>
        <button data-key="0" className="ussd-option-btn" onClick={() => goTo('MAIN_MENU')}>0. Exit</button>
      </div>
    </div>
  );
}
