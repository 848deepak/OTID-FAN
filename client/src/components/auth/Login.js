import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = ({ login }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    setLoading(false);
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="text-center mb-4">Login to Your Account</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={onSubmit}>
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
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Form>
      
      <div className="mt-3 text-center">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login; 