import React, { useState } from 'react';
import { Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const ReportFraud = () => {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterEmail: '',
    scammerName: '',
    platform: '',
    fraudType: '',
    description: '',
    relatedOtid: '',
    evidence: null
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportId, setReportId] = useState(null);
  
  const { 
    reporterName, reporterEmail, scammerName, platform, 
    fraudType, description, relatedOtid 
  } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = e => {
    setFormData({ ...formData, evidence: e.target.files[0] });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    // Basic validation
    if (!reporterName || !reporterEmail || !scammerName || !platform || !fraudType || !description) {
      setError('Please fill all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const submitData = new FormData();
    submitData.append('reporterName', reporterName);
    submitData.append('reporterEmail', reporterEmail);
    submitData.append('scammerName', scammerName);
    submitData.append('platform', platform);
    submitData.append('fraudType', fraudType);
    submitData.append('description', description);
    
    if (relatedOtid) {
      submitData.append('relatedOtid', relatedOtid);
    }
    
    if (formData.evidence) {
      submitData.append('evidence', formData.evidence);
    }
    
    try {
      const res = await axios.post('/api/fraud/report', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setReportId(res.data.reportId);
      setSubmitted(true);
      toast.success('Fraud report submitted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting fraud report');
      toast.error('Error submitting report');
    }
    
    setLoading(false);
  };
  
  const resetForm = () => {
    setFormData({
      reporterName: '',
      reporterEmail: '',
      scammerName: '',
      platform: '',
      fraudType: '',
      description: '',
      relatedOtid: '',
      evidence: null
    });
    setSubmitted(false);
    setReportId(null);
  };
  
  if (submitted) {
    return (
      <div className="fraud-form">
        <Card>
          <Card.Body className="text-center">
            <FaCheckCircle className="text-success mb-3" style={{ fontSize: '4rem' }} />
            <h2>Fraud Report Submitted</h2>
            <p className="lead">Thank you for helping make the internet safer!</p>
            <p>Your report has been submitted and will be reviewed by our team.</p>
            <p><strong>Report ID:</strong> {reportId}</p>
            <Button 
              variant="primary" 
              onClick={resetForm}
              className="mt-3"
            >
              Submit Another Report
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="fraud-form">
      <div className="text-center mb-4">
        <FaExclamationTriangle className="text-warning mb-3" style={{ fontSize: '3rem' }} />
        <h2>Report Fraud</h2>
        <p className="lead">Help others avoid scams by reporting fraudulent activity</p>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                name="reporterName"
                value={reporterName}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Your Email</Form.Label>
              <Form.Control
                type="email"
                name="reporterEmail"
                value={reporterEmail}
                onChange={onChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>Scammer/Fraudster Name</Form.Label>
          <Form.Control
            type="text"
            name="scammerName"
            value={scammerName}
            onChange={onChange}
            required
          />
        </Form.Group>
        
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Platform Where Fraud Occurred</Form.Label>
              <Form.Control
                type="text"
                name="platform"
                value={platform}
                onChange={onChange}
                placeholder="e.g. Facebook, Email, Phone, Website"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Type of Fraud</Form.Label>
              <Form.Select
                name="fraudType"
                value={fraudType}
                onChange={onChange}
                required
              >
                <option value="">Select fraud type</option>
                <option value="Financial">Financial Fraud</option>
                <option value="Identity Theft">Identity Theft</option>
                <option value="Phishing">Phishing</option>
                <option value="Romance Scam">Romance Scam</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3">
          <Form.Label>OTID (if known)</Form.Label>
          <Form.Control
            type="text"
            name="relatedOtid"
            value={relatedOtid}
            onChange={onChange}
            placeholder="Enter the person's OTID if you know it"
          />
          <Form.Text className="text-muted">
            If you know the scammer's OTID, please enter it here to help us link this report.
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description of Fraud</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={description}
            onChange={onChange}
            placeholder="Please provide details about the fraudulent activity"
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Evidence (optional)</Form.Label>
          <Form.Control
            type="file"
            onChange={handleFileChange}
          />
          <Form.Text className="text-muted">
            You can upload screenshots, documents, or other evidence of the fraud.
          </Form.Text>
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          className="w-100 mt-3" 
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Fraud Report'}
        </Button>
      </Form>
    </div>
  );
};

export default ReportFraud; 