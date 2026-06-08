const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    systolic: { type: Number },
    diastolic: { type: Number },
    bloodGlucose: { type: Number },
    heartRate: { type: Number },
    symptoms: { type: [String], default: [] },
    medicationTaken: { type: Boolean, required: true },
    riskTier: { type: String, enum: ['Green', 'Yellow', 'Red'], required: true },
    riskReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vital', vitalSchema);
