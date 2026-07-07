import { useEffect, useRef, useState } from 'react';
import { resultSmsFor } from '../smsTemplates';

const FIRST_STAGE = { Hypertension: 'HYP_1_2', Diabetes: 'DIA_1_2B', Asthma: 'ASTHMA_1_2C', 'Peptic Ulcer': 'PEPTIC_1' };

export default function Processing({ session, actions }) {
  const { logVitals, pushSms, goTo, updateVitalsDraft } = actions;
  const submittedRef = useRef(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const draft = session.vitalsDraft;
  const firstName = session.patient?.fullName?.split(' ')[0] || 'there';

  useEffect(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    const payload = {
      patientId: session.patient._id,
      medicationTaken: draft.medicationTaken,
      symptoms: draft.symptoms,
    };
    if (draft.conditionFlow === 'Hypertension') {
      payload.systolic = Number(draft.systolic);
      payload.diastolic = Number(draft.diastolic);
    }
    if (draft.conditionFlow === 'Diabetes') {
      payload.bloodGlucose = Number(draft.bloodGlucose);
    }

    logVitals(payload)
      .then((res) => {
        setResult(res);
        const card = resultSmsFor(draft.conditionFlow, {
          firstName,
          systolic: draft.systolic,
          diastolic: draft.diastolic,
          bloodGlucose: draft.bloodGlucose,
          breathingStatus: draft.breathingStatus,
          symptoms: draft.symptoms,
          tier: res.riskTier,
        });
        pushSms(card, res.riskTier);
      })
      .catch((err) => setErrorMsg(err.response?.data?.error || 'Could not submit reading.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const continueNext = () => {
    if (draft.nextFlow) {
      updateVitalsDraft({
        conditionFlow: draft.nextFlow,
        nextFlow: null,
        systolic: '',
        diastolic: '',
        mealTiming: '',
        bloodGlucose: '',
        breathingStatus: '',
        symptoms: [],
        medicationTaken: null,
        medicationLabel: '',
      });
      goTo(FIRST_STAGE[draft.nextFlow]);
    } else {
      goTo('MAIN_MENU');
    }
  };

  return (
    <div>
      <div className="ussd-title">VickiFlow</div>
      <div className="ussd-lines">
        <p>Thank you {firstName}.</p>
        <p>Your reading is being checked.</p>
        <p>You will receive your result by SMS in less than 1 minute.</p>
        <p>Stay healthy. 💙</p>
      </div>
      {errorMsg && <p className="ussd-inline-error">{errorMsg}</p>}
      {!result && !errorMsg && <p className="ussd-processing-spinner">⏳ Checking your reading…</p>}
      {result && (
        <div className="ussd-options">
          <button data-key="1" className="ussd-option-btn" onClick={continueNext}>
            {draft.nextFlow ? `1. Continue to ${draft.nextFlow === 'Diabetes' ? 'Blood Sugar' : draft.nextFlow} entry` : '1. 📞 Dial *384*8425# again'}
          </button>
        </div>
      )}
    </div>
  );
}
