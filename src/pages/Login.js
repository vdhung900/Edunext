import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:9999/users?username=${username}&password=${password}`);
      const user = response.data[0];
      if (user) {
        login(user.id); // Store user id instead of role name
        navigate('/');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed', error);
    }
  };


  return (
    <Container className="login-container">
      <Row className="justify-content-md-center mt-3">
        <Col md={4} className="text-center">
          <img style={{ width: '70px' }} src="logo.png" alt="FPT Logo" className="logo mb-2" />
          <p style={{ color: '#0768B1' }}>Education</p>
          <h6 className="mb-4">The social constructive learning tool</h6>
        </Col>
      </Row>
      <Row className="justify-content-md-center mt-5">
        <Col md={4}>
          <div className="login-box p-4 shadow">
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
