function calculateRisk({ systolic, diastolic, bloodGlucose, symptoms, medicationTaken, condition }) {
  let tier = 'Green';
  let reason = 'All readings are within safe range.';

  const dangerSymptoms = ['chest pain', 'difficulty breathing', 'severe headache', 'blurred vision', 'fainting'];
  const hasDangerSymptom = symptoms.some((s) => dangerSymptoms.includes(s.toLowerCase()));

  if (hasDangerSymptom) {
    return { tier: 'Red', reason: 'Dangerous symptom reported. Immediate medical attention required.' };
  }

  if (condition === 'Hypertension' || systolic || diastolic) {
    if (systolic >= 180 || diastolic >= 120) {
      return { tier: 'Red', reason: 'Hypertensive crisis (BP ≥ 180/120). Visit hospital immediately.' };
    }
    if (systolic >= 140 || diastolic >= 90) {
      tier = 'Yellow';
      reason = 'Blood pressure is elevated (Stage 2). Visit recommended soon.';
    } else if (systolic >= 130 || diastolic >= 80) {
      tier = 'Yellow';
      reason = 'Blood pressure is slightly elevated (Stage 1). Monitor closely.';
    }
  }

  if (condition === 'Diabetes' || bloodGlucose) {
    if (bloodGlucose > 400 || bloodGlucose < 50) {
      return { tier: 'Red', reason: 'Critical blood glucose level. Go to the hospital immediately.' };
    }
    if (bloodGlucose > 250 || bloodGlucose < 70) {
      tier = 'Red';
      reason = 'Blood glucose is dangerously high or low. Seek medical attention today.';
    } else if (bloodGlucose > 180 || bloodGlucose < 80) {
      if (tier !== 'Red') {
        tier = 'Yellow';
        reason = 'Blood glucose is outside the ideal range. Visit recommended soon.';
      }
    }
  }

  if (!medicationTaken && tier === 'Green') {
    tier = 'Yellow';
    reason = 'Medication was not taken today. Monitor symptoms closely.';
  }

  return { tier, reason };
}

module.exports = calculateRisk;
