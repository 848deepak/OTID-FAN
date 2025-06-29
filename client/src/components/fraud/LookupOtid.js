import React, { useState } from 'react';
import { Form, Button, Alert, Card, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { FaSearch, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

const LookupOtid = () => {
  const [otid, setOtid] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const onChange = e => {
    setOtid(e.target.value);
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!otid) {
      setError('Please enter an OTID to check');
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      // First validate if the OTID exists and is valid
      const otidValidation = await axios.get(`/api/otid/validate/${otid}`);
      
      if (!otidValidation.data.isValid) {
        setError('The provided OTID is not valid or not found');
        setLoading(false);
        return;
      }
      
      // Check for fraud reports
      const res = await axios.get(`/api/fraud/check/${otid}`);
      setResult(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('The provided OTID was not found');
      } else {
        setError(err.response?.data?.message || 'Error checking OTID');
      }
    }
    
    setLoading(false);
  };
  
  const renderResultCard = () => {
    if (!result) return null;
    
    const { hasFraudReports, fraudCount, reports } = result;
    
    return (
      <Card className="mt-4">
        <Card.Header className={`text-white ${hasFraudReports ? 'bg-danger' : 'bg-success'}`}>
          <div className="d-flex align-items-center">
            {hasFraudReports ? 
              <FaExclamationTriangle className="me-2" /> : 
              <FaCheckCircle className="me-2" />
            }
            <h5 className="mb-0">
              {hasFraudReports ? 
                `${fraudCount} Fraud Report${fraudCount > 1 ? 's' : ''} Found` : 
                'No Fraud Reports'
              }
            </h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Card.Title>OTID: {otid}</Card.Title>
          
          {hasFraudReports ? (
            <>
              <Alert variant="danger">
                <FaExclamationTriangle className="me-2" />
                This OTID has been flagged for potentially fraudulent activity. 
                Please proceed with caution when dealing with this person.
              </Alert>
              
              <h6 className="mt-4">Reported Incidents:</h6>
              {reports.map(report => (
                <Card key={report.id} className="mb-3">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <div>
                        <strong>Scammer Name:</strong> {report.scammerName}
                      </div>
                      <Badge 
                        bg={
                          report.status === 'Verified' ? 'danger' : 
                          report.status === 'Rejected' ? 'secondary' : 
                          'warning'
                        }
                      >
                        {report.status}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <strong>Platform:</strong> {report.platform}
                    </div>
                    <div>
                      <strong>Type:</strong> {report.fraudType}
                    </div>
                    <div>
                      <strong>Reported:</strong> {new Date(report.reportDate).toLocaleDateString()}
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </>
          ) : (
            <Alert variant="success">
              <FaCheckCircle className="me-2" />
              Good news! This OTID has no fraud reports associated with it.
              However, always exercise caution when interacting online.
            </Alert>
          )}
          
          <div className="mt-4 text-center">
            <Button 
              variant="primary" 
              onClick={() => {
                setOtid('');
                setResult(null);
              }}
            >
              Check Another OTID
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  };
  
  return (
    <div className="lookup-form">
      <div className="text-center mb-4">
        <FaSearch className="text-primary mb-3" style={{ fontSize: '3rem' }} />
        <h2>OTID Lookup</h2>
        <p className="lead">Check if an OTID has any fraud reports</p>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {!result && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>
                <FaInfoCircle className="me-2 text-info" />
                What is an OTID?
              </Card.Title>
              <Card.Text>
                A One-Time Digital Identity (OTID) is a unique hash assigned to verified users. 
                You can use this tool to check if an OTID has been associated with any 
                reported fraudulent activity.
              </Card.Text>
            </Card.Body>
          </Card>
          
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Enter OTID</Form.Label>
              <Form.Control
                type="text"
                value={otid}
                onChange={onChange}
                placeholder="Enter the OTID you want to check"
                required
              />
              <Form.Text className="text-muted">
                The OTID is a 64-character hexadecimal string
              </Form.Text>
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Checking...
                </>
              ) : (
                'Check OTID'
              )}
            </Button>
          </Form>
        </>
      )}
      
      {renderResultCard()}
    </div>
  );
};

export default LookupOtid; 