const DANGER_SYMPTOMS = ['chest pain', 'difficulty breathing', 'severe headache', 'blurred vision', 'fainting'];
const SEVERITY = { Green: 0, Yellow: 1, Red: 2 };

function worse(a, b) {
  return SEVERITY[b.tier] > SEVERITY[a.tier] ? b : a;
}

function checkDangerSymptoms(symptoms) {
  const lower = symptoms.map((s) => s.toLowerCase());
  const hasDangerSymptom = lower.some((s) => DANGER_SYMPTOMS.some((d) => s.includes(d)));
  if (hasDangerSymptom) {
    return { tier: 'Red', reason: 'Dangerous symptom reported. Immediate medical attention required.' };
  }
  return { tier: 'Green', reason: 'No dangerous symptoms reported.' };
}

function checkHypertension({ systolic, diastolic }) {
  if (systolic >= 180 || diastolic >= 120) {
    return { tier: 'Red', reason: 'Hypertensive crisis (BP ≥ 180/120). Visit hospital immediately.' };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { tier: 'Yellow', reason: 'Blood pressure is elevated (Stage 2). Visit recommended soon.' };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { tier: 'Yellow', reason: 'Blood pressure is slightly elevated (Stage 1). Monitor closely.' };
  }
  return { tier: 'Green', reason: 'Blood pressure is within a safe range.' };
}

function checkDiabetes({ bloodGlucose }) {
  if (bloodGlucose > 400 || bloodGlucose < 50) {
    return { tier: 'Red', reason: 'Critical blood glucose level. Go to the hospital immediately.' };
  }
  if (bloodGlucose > 250 || bloodGlucose < 70) {
    return { tier: 'Red', reason: 'Blood glucose is dangerously high or low. Seek medical attention today.' };
  }
  if (bloodGlucose > 180 || bloodGlucose < 80) {
    return { tier: 'Yellow', reason: 'Blood glucose is outside the ideal range. Visit recommended soon.' };
  }
  return { tier: 'Green', reason: 'Blood glucose is within a safe range.' };
}

function checkAsthma(symptoms) {
  const lower = symptoms.map((s) => s.toLowerCase());
  if (lower.some((s) => s.includes('very difficult'))) {
    return { tier: 'Red', reason: 'Severe breathing difficulty reported. Immediate medical attention required.' };
  }
  const yellowFlags = ['slightly difficult', 'used my inhaler', 'used inhaler', 'wheezing', 'chest tightness', 'woke up at night coughing'];
  if (lower.some((s) => yellowFlags.some((f) => s.includes(f)))) {
    return { tier: 'Yellow', reason: 'Breathing symptoms reported. Monitor closely and consider a doctor visit.' };
  }
  return { tier: 'Green', reason: 'Breathing is normal, no asthma symptoms reported.' };
}

function checkPepticUlcer(symptoms) {
  const lower = symptoms.map((s) => s.toLowerCase());
  if (lower.some((s) => s.includes('blood in stool') || s.includes('severe stomach pain'))) {
    return { tier: 'Red', reason: 'Severe stomach symptoms reported. Immediate medical attention required.' };
  }
  const yellowFlags = ['stomach pain', 'bloating', 'nausea or vomiting'];
  if (lower.some((s) => yellowFlags.some((f) => s.includes(f)))) {
    return { tier: 'Yellow', reason: 'Stomach symptoms reported. Monitor closely and consider a doctor visit.' };
  }
  return { tier: 'Green', reason: 'No stomach symptoms reported.' };
}

function calculateRisk({ systolic, diastolic, bloodGlucose, symptoms = [], medicationTaken, conditions = [] }) {
  let best = { tier: 'Green', reason: 'All readings are within safe range.' };

  best = worse(best, checkDangerSymptoms(symptoms));

  if (conditions.includes('Hypertension') || systolic || diastolic) {
    best = worse(best, checkHypertension({ systolic, diastolic }));
  }
  if (conditions.includes('Diabetes') || bloodGlucose) {
    best = worse(best, checkDiabetes({ bloodGlucose }));
  }
  if (conditions.includes('Asthma')) {
    best = worse(best, checkAsthma(symptoms));
  }
  if (conditions.includes('Peptic Ulcer')) {
    best = worse(best, checkPepticUlcer(symptoms));
  }

  if (!medicationTaken && best.tier === 'Green') {
    best = { tier: 'Yellow', reason: 'Medication was not taken today. Monitor symptoms closely.' };
  }

  return best;
}

module.exports = calculateRisk;
