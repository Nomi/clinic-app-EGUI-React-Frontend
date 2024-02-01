// App.js
import React, { useState } from 'react';
import Login from './auth/Login';
import Signup from './auth/Signup';
import './App.css'; // Assuming you have some styles in App.css
import AdminControlPanel from './controlpanels/AdminControlPanel';
import DoctorControlPanel from './controlpanels/DoctorControlPanel';
import PatientControlPanel from './controlpanels/PatientControlPanel';
import CommonControlPanel from './controlpanels/CommonControlPanel';


function App() {
  const [token, setToken] = useState(localStorage.getItem('token')); // State to track the token
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  // Function to handle login, receives token from child component
  const handleLoginClick = (newToken, newRole,newUsername) => {
    setToken(newToken); // Set the token received from the child component
    newRole = newRole ? newRole.toLowerCase() : null; // Convert role to lowercase if it exists
    setRole(newRole);
    setUsername(newUsername)
    // Store token, role, and username in local storage
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('username', newUsername);
  };

  
   // Function to handle logout
   const handleLogoutClick = () => {
    // Remove token, role, and username from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    // Clear state
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  // Render control panel based on the user's role
  const renderControlPanel = () => {
    switch (role) {
      case 'admin':
        return <AdminControlPanel token={token}/>;
      case 'doctor':
        return <DoctorControlPanel token={token} username={username}/>;
      case 'patient':
        return <PatientControlPanel token={token}/>;
      default:
        return null;
    }
  };


  const [logoutHovered, setLogoutHovered] = useState(false);

  return (
    <div className="App">
      <header className="App-header">
          {(token||role||username) && (
            <button
            onClick={handleLogoutClick}
            style={{
              backgroundColor: logoutHovered ? 'red' : 'transparent',
              color: logoutHovered ? 'black' : 'red',
              border: '2px solid red',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s, color 0.4s',
            }}
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
          >
            Logout
          </button>
        )}
        {/* Your existing content */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

        {/* New content - Login and Signup components */}
        {!token && (
          <div>
            <Login handleLoginClick={handleLoginClick} token={token} role={role} username={username}/> {/* Pass token state to Login component */}
            <Signup />
          </div>
        )}
        {token &&(
          <div>
            {/* Render role-specific control panel */}
            {renderControlPanel()}
            {/* Render common control panel */}
            {/* <CommonControlPanel/> */}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
