const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');

router.get('/lookup/:phone', async (req, res) => {
  try {
    const patient = await Patient.findOne({ phone: req.params.phone });
    if (!patient) return res.json({ registered: false });
    res.json({ registered: true, patient });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reminder-time', async (req, res) => {
  try {
    const { patientId, time } = req.body;
    const patient = await Patient.findByIdAndUpdate(patientId, { reminderTime: time }, { new: true });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json({ patient });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
