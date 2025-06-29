const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const FraudReport = require('../models/FraudReport');
const User = require('../models/User');
const BlockchainLedger = require('../models/BlockchainLedger');
const { upload } = require('../utils/fileUpload');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Report fraud
router.post(
  '/report',
  upload.single('evidence'),
  async (req, res) => {
    try {
      const {
        reporterName,
        reporterEmail,
        scammerName,
        platform,
        fraudType,
        description,
        relatedOtid
      } = req.body;
      
      // Create new fraud report
      const fraudReport = new FraudReport({
        reporterName,
        reporterEmail,
        scammerName,
        platform,
        fraudType,
        description,
        relatedOtid: relatedOtid || null
      });
      
      // If evidence was uploaded, add the file path
      if (req.file) {
        fraudReport.evidence = req.file.path.replace(/\\/g, '/');
      }
      
      // If OTID was provided, verify it exists
      if (relatedOtid) {
        const ledgerEntry = await BlockchainLedger.findOne({ otid: relatedOtid });
        if (!ledgerEntry) {
          return res.status(400).json({ message: 'The provided OTID is not valid' });
        }
      }
      
      await fraudReport.save();
      
      res.json({
        message: 'Fraud report submitted successfully',
        reportId: fraudReport._id
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Check if an OTID has fraud reports
router.get('/check/:otid', async (req, res) => {
  try {
    const { otid } = req.params;
    
    // Verify OTID exists
    const ledgerEntry = await BlockchainLedger.findOne({ otid });
    if (!ledgerEntry) {
      return res.status(404).json({ message: 'OTID not found or invalid' });
    }
    
    // Find fraud reports associated with this OTID
    const fraudReports = await FraudReport.find({ relatedOtid: otid });
    
    res.json({
      otid,
      hasFraudReports: fraudReports.length > 0,
      fraudCount: fraudReports.length,
      reports: fraudReports.map(report => ({
        id: report._id,
        scammerName: report.scammerName,
        platform: report.platform,
        fraudType: report.fraudType,
        reportDate: report.reportDate,
        status: report.status
      }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all fraud reports (admin function)
router.get('/all', auth, async (req, res) => {
  try {
    // In a real app, you'd check if the user is an admin
    const user = await User.findById(req.user.id);
    
    // For demo purposes, all logged-in users can access this
    const fraudReports = await FraudReport.find().sort({ reportDate: -1 });
    
    res.json(fraudReports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router; 