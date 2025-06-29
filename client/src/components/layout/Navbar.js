import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar as BSNavbar } from 'react-bootstrap';

const Navbar = ({ isAuthenticated, user, logout }) => {
  return (
    <BSNavbar bg="primary" variant="dark" expand="lg">
      <Container>
        <BSNavbar.Brand as={Link} to="/">OTID-FAN</BSNavbar.Brand>
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/report-fraud">Report Fraud</Nav.Link>
            <Nav.Link as={Link} to="/lookup-otid">Lookup OTID</Nav.Link>
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/verify-identity">Verify Identity</Nav.Link>
                <Nav.Link onClick={logout}>Logout</Nav.Link>
                <BSNavbar.Text className="ms-2">
                  Signed in as: <span className="text-white">{user?.name}</span>
                </BSNavbar.Text>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar; 