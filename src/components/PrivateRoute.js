// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../authUtils';

const PrivateRoute = ({ element }) => {
  if (!isAuthenticated()) {
    
    return <Navigate to="/login" />;
  }
  return element;
};

export default PrivateRoute;
