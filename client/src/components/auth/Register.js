import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Register = ({ register }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    // Form validation
    if (!name || !email || !password) {
      setError('Please enter all fields');
      return;
    }

    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    const result = await register(name, email, password);
    
    setLoading(false);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-center mb-4">Register Account</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter your password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm your password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength="6"
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          className="w-100" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      
      <div className="mt-3 text-center">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register; 