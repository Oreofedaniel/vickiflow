const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();

// Set DNS servers explicitly to Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const patientRoutes = require('./routes/patients');
const vitalRoutes = require('./routes/vitals');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/patients', patientRoutes);
app.use('/api/vitals', vitalRoutes);

app.get('/', (req, res) => res.json({ message: 'VickiFlow API running' }));

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 15000
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('DB connection error:', err);
    console.error('Full error details:', JSON.stringify(err, null, 2));
  });
