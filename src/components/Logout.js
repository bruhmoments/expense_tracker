import React from 'react';
import { useNavigate } from "react-router-dom";
import { CNavItem } from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilExitToApp } from '@coreui/icons'; 

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    sessionStorage.removeItem('token'); // Justincase
    localStorage.removeItem('startDate');
    localStorage.removeItem('endDate');
    navigate('/');
    window.location.reload()
  };

  return (
    <CNavItem href="#" onClick={handleLogout} >
      <CIcon customClassName="nav-icon" icon={cilExitToApp} />
      Logout
    </CNavItem>
  );
};

export default Logout;
