import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CButton, CForm, CFormInput, CContainer, CRow, CCol } from '@coreui/react';
import API from '../api/api';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await API.post('/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', username);
        navigate('/dashboard');
      } else {
        setError('Invalid login credentials');
      }
    } catch (err) {
        setError(err.response?.data?.error || 'An unexpected error occurred');
    }
  };

  return (
    <CContainer
    fluid
    className="d-flex justify-content-center align-items-center"
    style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#f8f9fa',
    }}
    >
    <CRow className="justify-content-center align-items-center" style={{ width: '100%' }}>
        <CCol md={4}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Expense Tracker Login</h2>
        <CForm
            onSubmit={handleLogin}
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
            <CFormInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ marginBottom: '15px', width: '50%' }}
            />
            <CFormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '15px', width: '50%' }}
            />
            <CButton type="submit" color="primary" style={{ width: '50%' }}>
                Login
            </CButton>
        </CForm>
        </CCol>
    </CRow>
    </CContainer>

  );
};

export default LoginPage;
