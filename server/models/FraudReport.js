const mongoose = require('mongoose');

const FraudReportSchema = new mongoose.Schema({
  reporterName: {
    type: String,
    required: true
  },
  reporterEmail: {
    type: String,
    required: true
  },
  scammerName: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  fraudType: {
    type: String,
    required: true,
    enum: ['Financial', 'Identity Theft', 'Phishing', 'Romance Scam', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  relatedOtid: {
    type: String,
    default: null
  },
  evidence: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending'
  },
  reportDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FraudReport', FraudReportSchema); 