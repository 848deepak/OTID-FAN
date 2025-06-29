import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Alert, Card, Row, Col, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

const VerifyIdentity = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [idFile, setIdFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [idPreview, setIdPreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [verificationStep, setVerificationStep] = useState(0);
  const [otid, setOtid] = useState(null);
  const navigate = useNavigate();

  const photoInputRef = useRef(null);
  const idInputRef = useRef(null);

  // Check if user is already verified
  useEffect(() => {
    if (user && user.isVerified) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Handle file selection for photo
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*')) {
      setError('Please select an image file for your photo');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setPhotoFile(file);
    setError('');
  };

  // Handle file selection for ID
  const handleIdChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setIdPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    setIdFile(file);
    setError('');
  };

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!photoFile || !idFile) {
      setError('Please upload both your photo and ID document');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('idDocument', idFile);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': localStorage.getItem('token')
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };
      
      await axios.post('/api/otid/upload', formData, config);
      toast.success('Documents uploaded successfully');
      
      // Proceed to verification
      setVerificationStep(1);
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading documents');
      toast.error('Upload failed');
    }
    
    setLoading(false);
  };

  // Handle verification
  const handleVerify = async () => {
    setVerifying(true);
    setError('');
    
    try {
      // Simulate face recognition process with progressive updates
      setVerificationStep(2);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      setVerificationStep(3);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing
      
      // Send verification request to server
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };
      
      const res = await axios.post('/api/otid/verify', {}, config);
      
      setVerificationStep(4);
      setOtid(res.data.otid);
      toast.success('Identity verification successful!');
      
      // Refresh user data and navigate to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
      toast.error('Verification failed');
      setVerificationStep(0); // Reset to upload step
    }
    
    setVerifying(false);
  };

  // Render upload form
  const renderUploadForm = () => (
    <Form onSubmit={handleUpload}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Your Photo</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              ref={photoInputRef}
              onChange={handlePhotoChange}
              required
            />
            <Form.Text className="text-muted">
              Please upload a clear photo of your face
            </Form.Text>
            {photoPreview && (
              <img 
                src={photoPreview} 
                alt="Photo preview" 
                className="preview-image"
              />
            )}
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>ID Document</Form.Label>
            <Form.Control
              type="file"
              accept="image/*,.pdf"
              ref={idInputRef}
              onChange={handleIdChange}
              required
            />
            <Form.Text className="text-muted">
              Please upload your government-issued ID (passport, driver's license, etc.)
            </Form.Text>
            {idPreview && (
              <img 
                src={idPreview} 
                alt="ID preview" 
                className="preview-image"
              />
            )}
          </Form.Group>
        </Col>
      </Row>
      
      {loading && (
        <ProgressBar 
          now={uploadProgress} 
          label={`${uploadProgress}%`} 
          className="mb-3" 
        />
      )}
      
      <Button 
        variant="primary" 
        type="submit" 
        className="w-100 mt-3" 
        disabled={loading || !photoFile || !idFile}
      >
        {loading ? 'Uploading...' : 'Upload Documents'}
      </Button>
    </Form>
  );

  // Render verification steps
  const renderVerificationSteps = () => (
    <div>
      <Alert variant="info">
        Your documents have been uploaded. Please proceed with identity verification.
      </Alert>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Verification Process</Card.Title>
          <div className="mb-3">
            <div className={`d-flex align-items-center mb-2 ${verificationStep >= 2 ? 'text-success' : ''}`}>
              <div className={`rounded-circle border d-flex justify-content-center align-items-center me-2`} style={{ width: '30px', height: '30px', background: verificationStep >= 2 ? '#d4edda' : 'transparent' }}>
                {verificationStep >= 2 ? '✓' : '1'}
              </div>
              <div>Processing your photo</div>
            </div>
            <div className={`d-flex align-items-center mb-2 ${verificationStep >= 3 ? 'text-success' : ''}`}>
              <div className={`rounded-circle border d-flex justify-content-center align-items-center me-2`} style={{ width: '30px', height: '30px', background: verificationStep >= 3 ? '#d4edda' : 'transparent' }}>
                {verificationStep >= 3 ? '✓' : '2'}
              </div>
              <div>Matching with ID document</div>
            </div>
            <div className={`d-flex align-items-center mb-2 ${verificationStep >= 4 ? 'text-success' : ''}`}>
              <div className={`rounded-circle border d-flex justify-content-center align-items-center me-2`} style={{ width: '30px', height: '30px', background: verificationStep >= 4 ? '#d4edda' : 'transparent' }}>
                {verificationStep >= 4 ? '✓' : '3'}
              </div>
              <div>Generating OTID and registering on blockchain</div>
            </div>
          </div>
          
          {verificationStep < 4 ? (
            <Button 
              variant="primary" 
              onClick={handleVerify} 
              disabled={verifying || verificationStep > 1}
              className="w-100"
            >
              {verifying ? 'Verifying...' : 'Start Verification'}
            </Button>
          ) : (
            <div className="success-card">
              <h4>Verification Successful!</h4>
              <p>Your OTID has been generated and stored on the blockchain.</p>
              <div className="otid-box">
                {otid}
              </div>
              <p className="mt-3 mb-0">
                Redirecting to dashboard...
              </p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <div className="identity-verification">
      <h2 className="text-center mb-4">Identity Verification</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {verificationStep === 0 ? renderUploadForm() : renderVerificationSteps()}
    </div>
  );
};

export default VerifyIdentity; 