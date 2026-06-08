const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true, unique: true },
    condition: {
      type: String,
      enum: ['Hypertension', 'Diabetes', 'Asthma', 'Peptic Ulcer'],
      required: true,
    },
    medications: { type: String, default: '' },
    allergies: { type: String, default: '' },
    assignedDoctor: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Patient', patientSchema);
