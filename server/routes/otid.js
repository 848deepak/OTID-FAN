const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { ethers } = require('ethers');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const BlockchainLedger = require('../models/BlockchainLedger');
const { upload } = require('../utils/fileUpload');
const { verifyFaces } = require('../utils/faceVerification');

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

// Upload identification documents
router.post(
  '/upload',
  auth,
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      if (!req.files.photo || !req.files.idDocument) {
        return res.status(400).json({ message: 'Both photo and ID document are required' });
      }
      
      const photoPath = req.files.photo[0].path.replace(/\\/g, '/');
      const idDocumentPath = req.files.idDocument[0].path.replace(/\\/g, '/');
      
      // Update user with file paths
      const user = await User.findById(req.user.id);
      user.photoUrl = photoPath;
      user.idDocumentUrl = idDocumentPath;
      await user.save();
      
      res.json({ 
        message: 'Documents uploaded successfully', 
        photoUrl: photoPath, 
        idDocumentUrl: idDocumentPath 
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// Verify identity and generate OTID
router.post('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.photoUrl || !user.idDocumentUrl) {
      return res.status(400).json({ message: 'Please upload your photo and ID first' });
    }
    
    // Use our new face verification utility
    const faceMatchResult = await verifyFaces(user.photoUrl, user.idDocumentUrl);
    
    if (!faceMatchResult.success) {
      return res.status(400).json({ 
        message: 'Identity verification failed: ' + faceMatchResult.message,
        confidence: faceMatchResult.confidence
      });
    }
    
    // Generate OTID - a unique hash
    const otid = generateOTID(user);
    
    // Generate simulated blockchain record
    const blockchainRef = await storeOTIDOnBlockchain(otid, user);
    
    // Update user with OTID and blockchain reference
    user.otid = otid;
    user.otidBlockchainRef = blockchainRef;
    user.isVerified = true;
    await user.save();
    
    res.json({
      message: 'Identity verified successfully: ' + faceMatchResult.message,
      confidence: faceMatchResult.confidence,
      otid,
      blockchainRef
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Check if an OTID is valid and verified
router.get('/validate/:otid', async (req, res) => {
  try {
    const { otid } = req.params;
    
    // Check if OTID exists in blockchain ledger
    const ledgerEntry = await BlockchainLedger.findOne({ otid });
    
    if (!ledgerEntry) {
      return res.status(404).json({ message: 'OTID not found or invalid' });
    }
    
    // For a production system, you would verify against a real blockchain
    res.json({
      isValid: true,
      createdAt: ledgerEntry.timestamp
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Generate a unique OTID
function generateOTID(user) {
  const data = `${user.id}${user.email}${Date.now()}${uuidv4()}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Store OTID on blockchain (simulated)
async function storeOTIDOnBlockchain(otid, user) {
  // In a real implementation, this would interact with an actual blockchain
  // For this demo, we're simulating with a local ledger
  
  // Create a hash from user data
  const userHash = crypto.createHash('sha256')
    .update(`${user.name}${user.email}${user.id}`)
    .digest('hex');
  
  // Generate a fake transaction hash
  const transactionHash = crypto.createHash('sha256')
    .update(`${otid}${Date.now()}${Math.random()}`)
    .digest('hex');
  
  // Store in our ledger
  const blockchainEntry = new BlockchainLedger({
    otid,
    userHash,
    transactionHash,
    blockNumber: Math.floor(Math.random() * 1000000)
  });
  
  await blockchainEntry.save();
  
  return transactionHash;
}

module.exports = router; 