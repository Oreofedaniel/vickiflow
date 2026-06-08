const express = require('express');
const router = express.Router();
const Vital = require('../models/Vital');
const Patient = require('../models/Patient');
const calculateRisk = require('../middleware/riskScoring');

router.post('/log', async (req, res) => {
  try {
    const { patientId, systolic, diastolic, bloodGlucose, heartRate, symptoms, medicationTaken } = req.body;

    const patient = await Patient.findById(patientId);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    const { tier, reason } = calculateRisk({
      systolic,
      diastolic,
      bloodGlucose,
      symptoms: symptoms || [],
      medicationTaken,
      condition: patient.condition,
    });

    const vital = new Vital({
      patient: patientId,
      systolic,
      diastolic,
      bloodGlucose,
      heartRate,
      symptoms: symptoms || [],
      medicationTaken,
      riskTier: tier,
      riskReason: reason,
    });

    await vital.save();

    res.status(201).json({ vital, riskTier: tier, riskReason: reason });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/patient/:patientId', async (req, res) => {
  try {
    const vitals = await Vital.find({ patient: req.params.patientId }).sort({ createdAt: -1 });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard', async (req, res) => {
  try {
    const latest = await Vital.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$patient', latestVital: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$latestVital' } },
      {
        $lookup: {
          from: 'patients',
          localField: 'patient',
          foreignField: '_id',
          as: 'patientInfo',
        },
      },
      { $unwind: '$patientInfo' },
      {
        $addFields: {
          riskOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$riskTier', 'Red'] }, then: 1 },
                { case: { $eq: ['$riskTier', 'Yellow'] }, then: 2 },
                { case: { $eq: ['$riskTier', 'Green'] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      { $sort: { riskOrder: 1 } },
    ]);

    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
