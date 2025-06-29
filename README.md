# OTID-FAN (One-Time Digital Identity Verification & Fraud Alert Network)

A hybrid web application that provides digital identity verification and fraud reporting/tracking functionality.

## Project Overview

The project has two main components:

1. **OTID (One-Time Digital Identity Verification)**
   - User registration with name, email, photo, and ID document
   - AI-based face matching for identity verification
   - Generation of unique OTID tokens stored on a simulated blockchain

2. **FAN (Fraud Alert Network)**
   - Form for reporting fraud incidents
   - Secure database for storing fraud reports
   - Association of fraud reports with OTIDs
   - API endpoint to check fraud status of any OTID

## Tech Stack

- **Frontend**: React.js with React Bootstrap
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Additional Tools**:
  - face-api.js for facial recognition
  - ethers.js for blockchain simulation
  - JWT for authentication

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd OTID-FAN
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Create the uploads directories:
   ```
   mkdir -p uploads/photos uploads/ids uploads/evidence
   ```

5. Start the backend development server:
   ```
   npm run dev
   ```

6. In a separate terminal, start the frontend:
   ```
   cd client
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
OTID-FAN/
├── client/                  # React frontend
│   ├── public/              # Static files
│   └── src/                 # React source code
│       ├── components/      # React components
│       │   ├── auth/        # Authentication components
│       │   ├── fraud/       # Fraud reporting components
│       │   ├── layout/      # Layout components
│       │   ├── otid/        # Identity verification components
│       │   └── pages/       # Page components
│       ├── App.js           # Main App component
│       └── index.js         # Entry point
├── server/                  # Node.js backend
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   └── index.js             # Server entry point
├── uploads/                 # Uploaded files directory
└── .env                     # Environment variables
```

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Login a user
  - `GET /api/auth/me` - Get current user's data

- **OTID**
  - `POST /api/otid/upload` - Upload identity documents
  - `POST /api/otid/verify` - Verify identity and generate OTID
  - `GET /api/otid/validate/:otid` - Validate an OTID

- **Fraud**
  - `POST /api/fraud/report` - Submit a fraud report
  - `GET /api/fraud/check/:otid` - Check if an OTID has fraud reports
  - `GET /api/fraud/all` - Get all fraud reports (admin only)

## Features

1. **User Registration and Authentication**
   - Secure user registration and login
   - JWT-based authentication

2. **Identity Verification**
   - Upload of selfie photo and ID document
   - Simulated face matching verification
   - Generation of unique OTID

3. **Blockchain Integration**
   - Simulated blockchain for storing OTID hashes
   - Optional Ethereum testnet integration

4. **Fraud Reporting System**
   - Detailed fraud reporting form
   - Association with OTID if known
   - Evidence upload capabilities

5. **Fraud Lookup**
   - OTID validation
   - Fraud status checking
   - Detailed fraud report display 