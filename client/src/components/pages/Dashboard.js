import React from 'react';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUserCheck, FaIdCard, FaShieldAlt } from 'react-icons/fa';

const Dashboard = ({ user }) => {
  if (!user) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4">
      <h2 className="mb-4">User Dashboard</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>
            <FaUserCheck className="me-2" />
            Welcome, {user.name}!
          </Card.Title>
          <Card.Text>
            Email: {user.email}
          </Card.Text>
          
          {user.isVerified ? (
            <Alert variant="success">
              <FaShieldAlt className="me-2" />
              Your identity has been verified
            </Alert>
          ) : (
            <Alert variant="warning">
              <FaIdCard className="me-2" />
              Your identity has not been verified yet
            </Alert>
          )}
        </Card.Body>
      </Card>
      
      <Row>
        {!user.isVerified && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Verify Your Identity</Card.Title>
                <Card.Text>
                  Upload your photo and ID document to verify your identity and get your OTID.
                </Card.Text>
                <Button 
                  as={Link} 
                  to="/verify-identity" 
                  variant="primary"
                >
                  Verify Identity
                </Button>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        {user.isVerified && (
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Your OTID</Card.Title>
                <Card.Text>
                  This is your One-Time Digital Identity (OTID) hash:
                </Card.Text>
                <div className="otid-box">
                  {user.otid}
                </div>
                <small className="text-muted">
                  This OTID has been securely stored on our blockchain with reference: {user.otidBlockchainRef?.substring(0, 20)}...
                </small>
              </Card.Body>
            </Card>
          </Col>
        )}
        
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Fraud Protection</Card.Title>
              <Card.Text>
                Report scammers to our Fraud Alert Network to help protect others.
              </Card.Text>
              <Button 
                as={Link} 
                to="/report-fraud" 
                variant="warning"
              >
                Report Fraud
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 