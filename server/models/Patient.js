const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number },
    phone: { type: String, required: true, unique: true },
    conditions: {
      type: [String],
      enum: ['Hypertension', 'Diabetes', 'Asthma', 'Peptic Ulcer'],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'At least one condition is required.',
      },
    },
    lga: { type: String, default: '' },
    reminderTime: { type: String, default: '' },
    medications: { type: String, default: '' },
    allergies: { type: String, default: '' },
    assignedDoctor: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
