// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
import React from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard'; // Belom Diubah
import PrivateRoute from './components/PrivateRoute';
import { isAuthenticated } from './authUtils';

function App() {
    return (
        <Router>
            <Routes>
              <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />} />
              <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" />: <LoginPage />} />
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            </Routes>
        </Router>
    );
}

export default App;
