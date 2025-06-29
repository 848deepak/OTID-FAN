const mongoose = require('mongoose');

const BlockchainLedgerSchema = new mongoose.Schema({
  otid: {
    type: String,
    required: true,
    unique: true
  },
  userHash: {
    type: String,
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isEthereumTestnet: {
    type: Boolean,
    default: false
  },
  blockNumber: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('BlockchainLedger', BlockchainLedgerSchema); 