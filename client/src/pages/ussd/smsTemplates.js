// SMS bodies below are marked doc-exact (verbatim from the USSD workflow spec) or
// extrapolated (the spec gave no wording for this case, so it mirrors the style/
// structure of the doc-exact templates). Extrapolated ones are commented as such.

export function toIntlPhone(phone) {
  if (!phone) return '';
  return phone.startsWith('0') ? `+234${phone.slice(1)}` : phone;
}

// doc-exact
export function welcomeSms(firstName) {
  return {
    title: 'VickiFlow — Registration',
    body: `VickiFlow: Welcome ${firstName}! You are now registered. Dial *384*8425# daily to log your vitals and track your health. Your health is now in flow.`,
  };
}

// doc-exact (Hypertension is the only condition with verbatim SMS wording in the spec)
export function bpResultSms({ firstName, systolic, diastolic, tier }) {
  if (tier === 'Red') {
    return {
      title: 'VickiFlow 🚨 URGENT (RED)',
      body: `VickiFlow 🚨 Hi ${firstName}, your BP is ${systolic}/${diastolic}. STATUS: URGENT (RED). Your reading is dangerously high. Please go to a hospital NOW. Nearest VickiFlow hospital: LAUTECH Teaching Hospital. Call: 08012345678. Do NOT delay. Go now.`,
    };
  }
  if (tier === 'Yellow') {
    return {
      title: 'VickiFlow ⚠️ MONITOR (YELLOW)',
      body: `VickiFlow ⚠️ Hi ${firstName}, your BP is ${systolic}/${diastolic}. STATUS: MONITOR (YELLOW). Your reading is slightly high. Please book an appointment with your doctor this week. Dial *384*8425# to find a hospital near you.`,
    };
  }
  return {
    title: 'VickiFlow — STABLE (GREEN)',
    body: `VickiFlow — Hi ${firstName}, your BP is ${systolic}/${diastolic}. STATUS: STABLE (GREEN). No hospital visit needed today. Keep taking your medication. Next check-in: Tomorrow 8AM. Dial *384*8425# anytime.`,
  };
}

// extrapolated — spec doesn't give Diabetes result SMS wording; mirrors the BP template's structure
export function diabetesResultSms({ firstName, bloodGlucose, tier }) {
  if (tier === 'Red') {
    return {
      title: 'VickiFlow 🚨 URGENT (RED)',
      body: `VickiFlow 🚨 Hi ${firstName}, your blood sugar is ${bloodGlucose} mg/dL. STATUS: URGENT (RED). Your reading is dangerously high or low. Please go to a hospital NOW. Nearest VickiFlow hospital: LAUTECH Teaching Hospital. Call: 08012345678. Do NOT delay. Go now.`,
    };
  }
  if (tier === 'Yellow') {
    return {
      title: 'VickiFlow ⚠️ MONITOR (YELLOW)',
      body: `VickiFlow ⚠️ Hi ${firstName}, your blood sugar is ${bloodGlucose} mg/dL. STATUS: MONITOR (YELLOW). Your reading is outside the ideal range. Please book an appointment with your doctor this week. Dial *384*8425# to find a hospital near you.`,
    };
  }
  return {
    title: 'VickiFlow — STABLE (GREEN)',
    body: `VickiFlow — Hi ${firstName}, your blood sugar is ${bloodGlucose} mg/dL. STATUS: STABLE (GREEN). No hospital visit needed today. Keep taking your medication. Next check-in: Tomorrow 8AM. Dial *384*8425# anytime.`,
  };
}

// extrapolated — spec doesn't give Asthma result SMS wording; mirrors the BP template's structure
export function asthmaResultSms({ firstName, breathingStatus, tier }) {
  if (tier === 'Red') {
    return {
      title: 'VickiFlow 🚨 URGENT (RED)',
      body: `VickiFlow 🚨 Hi ${firstName}, your reported breathing status is "${breathingStatus}". STATUS: URGENT (RED). Please go to a hospital NOW. Nearest VickiFlow hospital: LAUTECH Teaching Hospital. Call: 08012345678. Do NOT delay. Go now.`,
    };
  }
  if (tier === 'Yellow') {
    return {
      title: 'VickiFlow ⚠️ MONITOR (YELLOW)',
      body: `VickiFlow ⚠️ Hi ${firstName}, your reported breathing status is "${breathingStatus}". STATUS: MONITOR (YELLOW). Please book an appointment with your doctor this week. Dial *384*8425# to find a hospital near you.`,
    };
  }
  return {
    title: 'VickiFlow — STABLE (GREEN)',
    body: `VickiFlow — Hi ${firstName}, your breathing is normal today. STATUS: STABLE (GREEN). Keep taking your medication. Next check-in: Tomorrow 8AM. Dial *384*8425# anytime.`,
  };
}

// extrapolated — spec has no screens or SMS wording for Peptic Ulcer at all; mirrors the BP template's structure
export function pepticUlcerResultSms({ firstName, symptoms, tier }) {
  const symptomText = symptoms.length > 0 ? symptoms.join(', ') : 'no stomach symptoms';
  if (tier === 'Red') {
    return {
      title: 'VickiFlow 🚨 URGENT (RED)',
      body: `VickiFlow 🚨 Hi ${firstName}, you reported: ${symptomText}. STATUS: URGENT (RED). Please go to a hospital NOW. Nearest VickiFlow hospital: LAUTECH Teaching Hospital. Call: 08012345678. Do NOT delay. Go now.`,
    };
  }
  if (tier === 'Yellow') {
    return {
      title: 'VickiFlow ⚠️ MONITOR (YELLOW)',
      body: `VickiFlow ⚠️ Hi ${firstName}, you reported: ${symptomText}. STATUS: MONITOR (YELLOW). Please book an appointment with your doctor this week. Dial *384*8425# to find a hospital near you.`,
    };
  }
  return {
    title: 'VickiFlow — STABLE (GREEN)',
    body: `VickiFlow — Hi ${firstName}, you reported ${symptomText}. STATUS: STABLE (GREEN). Keep taking your medication. Next check-in: Tomorrow 8AM. Dial *384*8425# anytime.`,
  };
}

export function resultSmsFor(conditionFlow, args) {
  if (conditionFlow === 'Hypertension') return bpResultSms(args);
  if (conditionFlow === 'Diabetes') return diabetesResultSms(args);
  if (conditionFlow === 'Asthma') return asthmaResultSms(args);
  return pepticUlcerResultSms(args);
}

// doc-exact for LAUTECH; extrapolated (same structure) for the other two demo hospitals
export function hospitalDirectionsSms(hospital) {
  return {
    title: 'VickiFlow — Directions',
    body: `VickiFlow - Directions to ${hospital.name}: ${hospital.directionsNote} Call: ${hospital.phone}. Show this SMS at reception.`,
  };
}

// doc-exact
export function medicationOutOfStockSms({ doctorName, patientName, phone, medication }) {
  return {
    title: 'VickiFlow Alert — Doctor Notified',
    body: `VickiFlow Alert - Dr. ${doctorName}: Patient ${patientName} (${toIntlPhone(phone)}) has run out of ${medication}. Please renew prescription or contact patient. Dashboard: vickiflow.com/doctor`,
  };
}

// doc-exact
export function emergencyPatientSms({ hospital, doctorName }) {
  return {
    title: 'VickiFlow 🚨 EMERGENCY',
    body: `VickiFlow 🚨 EMERGENCY Nearest hospital: ${hospital.name} Tel: ${hospital.phone} Address: ${hospital.address} Your doctor Dr. ${doctorName} has been notified. Show this SMS at reception.`,
  };
}

// doc-exact
export function emergencyDoctorSms({ patientName, phone, lastVitalSummary, doctorName }) {
  return {
    title: 'VickiFlow 🚨 EMERGENCY ALERT (to Dr. ' + doctorName + ')',
    body: `VickiFlow 🚨 EMERGENCY ALERT Patient ${patientName} triggered emergency via USSD. Phone: ${toIntlPhone(phone)} ${lastVitalSummary} Please contact patient immediately. Dashboard: vickiflow.com/doctor`,
  };
}
