import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserShield, FaExclamationTriangle, FaSearch } from 'react-icons/fa';

const Home = () => {
  return (
    <Container className="mt-5">
      <Row className="text-center mb-5">
        <Col>
          <h1>Welcome to OTID-FAN</h1>
          <p className="lead">
            One-Time Digital Identity Verification & Fraud Alert Network
          </p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button as={Link} to="/register" variant="primary" size="lg">
              Register
            </Button>
            <Button as={Link} to="/login" variant="outline-primary" size="lg">
              Login
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="feature-card h-100">
            <Card.Body className="text-center">
              <FaUserShield className="feature-icon" />
              <Card.Title>Identity Verification</Card.Title>
              <Card.Text>
                Register and verify your identity using our secure OTID system. Upload your photo and ID document to get verified.
              </Card.Text>
              <Button as={Link} to="/register" variant="primary">Get Started</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="feature-card h-100">
            <Card.Body className="text-center">
              <FaExclamationTriangle className="feature-icon" />
              <Card.Title>Fraud Reporting</Card.Title>
              <Card.Text>
                Report scams and fraud incidents to our network. Help others avoid falling victim to the same scammers.
              </Card.Text>
              <Button as={Link} to="/report-fraud" variant="primary">Report Fraud</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="feature-card h-100">
            <Card.Body className="text-center">
              <FaSearch className="feature-icon" />
              <Card.Title>OTID Lookup</Card.Title>
              <Card.Text>
                Check if an OTID has been flagged for fraudulent activity in our database. Stay protected with quick verification.
              </Card.Text>
              <Button as={Link} to="/lookup-otid" variant="primary">Lookup OTID</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>How It Works</Card.Title>
              <Card.Text>
                <ol>
                  <li><strong>Register:</strong> Create an account with your basic information.</li>
                  <li><strong>Verify:</strong> Upload your photo and ID document for identity verification.</li>
                  <li><strong>Receive OTID:</strong> Get your unique One-Time Digital Identity token.</li>
                  <li><strong>Use Your OTID:</strong> Share your verified identity securely without revealing personal details.</li>
                  <li><strong>Report Fraud:</strong> Help others by reporting scammers to our Fraud Alert Network.</li>
                </ol>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home; 